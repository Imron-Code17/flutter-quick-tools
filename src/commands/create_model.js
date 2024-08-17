const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerCreateModelCommand(context) {
    const createModelCommand = vscode.commands.registerCommand('fluttermagictools.createModel', async () => {
        // Step 1: Prompt for the model name
        const modelName = await vscode.window.showInputBox({
            prompt: 'Enter the model name',
            placeHolder: 'e.g., MyModel'
        });

        if (!modelName) {
            vscode.window.showInformationMessage('Model creation canceled or no input provided.');
            return;
        }

        // Step 2: Prompt for the JSON data
        const jsonData = await vscode.window.showInputBox({
            prompt: 'Paste the JSON response to generate the model',
            placeHolder: 'e.g., {"id": "123", "name": "Sample"}',
            value: '',
            ignoreFocusOut: true
        });
        if (!jsonData) {
            vscode.window.showInformationMessage('Model creation canceled or no JSON provided.');
            return;
        }

        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const entitiesFolderPath = path.join(rootPath, 'lib', 'domain', 'entities');

        // Ensure the `entities` directory exists
        if (!fs.existsSync(entitiesFolderPath)) {
            fs.mkdirSync(entitiesFolderPath, { recursive: true });
        }

        const selectedFolder = await vscode.window.showQuickPick(
            getDirectories(entitiesFolderPath).concat('+ Add Folder'),
            { placeHolder: 'Select a folder to save the model or add a new folder' }
        );

        let targetFolderPath = entitiesFolderPath;

        if (selectedFolder === '+ Add Folder') {
            const newFolderName = await vscode.window.showInputBox({
                prompt: 'Enter the new folder name'
            });

            if (newFolderName) {
                targetFolderPath = path.join(entitiesFolderPath, newFolderName);
                fs.mkdirSync(targetFolderPath, { recursive: true });
            }
        } else {
            targetFolderPath = path.join(entitiesFolderPath, selectedFolder);
        }

        // Step 4: Generate the model file name from the model name
        const modelFileName = `${toSnakeCase(modelName)}.dart`;

        // Step 5: Create the model file with the JSON content
        const modelFilePath = path.join(targetFolderPath, modelFileName);

        const modelTemplate = generateModelTemplate(modelName, jsonData);

        fs.writeFileSync(modelFilePath, modelTemplate);
        addExportToDomainFile(modelFilePath);

        vscode.window.showInformationMessage(`Model '${modelName}' created successfully at '${modelFilePath}'`);
        const shouldRunBuild = await vscode.window.showInformationMessage(
            'Do you want to run `flutter pub run build_runner build` now?',
            'Yes',
            'No'
        );

        if (shouldRunBuild === 'Yes') {
            runBuildRunnerCommand();
        }
    });

    context.subscriptions.push(createModelCommand);
}
function addExportToDomainFile(modelFilePath) {
    const libPath = path.join(vscode.workspace.rootPath, 'lib/domain/entities');
    const domainFilePath = path.join(libPath, 'entities.dart');

    // Get folderName and fileName from the model file path
    const folderName = path.relative(libPath, path.dirname(modelFilePath)).replace(/\\/g, '/');
    const fileName = path.basename(modelFilePath, '.dart');

    const exportStatement = `export '${folderName}/${fileName}.dart';\n`;

    // Check if the domain.dart file already exists
    if (!fs.existsSync(domainFilePath)) {
        // If not, create it
        fs.writeFileSync(domainFilePath, exportStatement);
    } else {
        // If it exists, append the export statement if it's not already in the file
        const currentContent = fs.readFileSync(domainFilePath, 'utf-8');
        if (!currentContent.includes(exportStatement)) {
            fs.appendFileSync(domainFilePath, exportStatement);
        }
    }
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}



function generateModelTemplate(modelName, jsonData) {
    const parsedJson = JSON.parse(jsonData);
    const { mainModel, nestedModels } = generateModels(parsedJson, modelName);

    // Combine all models into a single string, with a single header
    return [
        "// ignore_for_file: invalid_annotation_target",
        "import 'package:freezed_annotation/freezed_annotation.dart';",
        `part '${toSnakeCase(modelName)}.freezed.dart';`,
        `part '${toSnakeCase(modelName)}.g.dart';`,
        "",
        mainModel,
        ...nestedModels
    ].join('\n');
}

function generateModels(json, modelName, parentModelName = '') {
    let mainModel = generateSingleModel(json, modelName);
    let nestedModels = [];

    // Generate models for nested objects
    for (const key in json) {
        if (json[key] && typeof json[key] === 'object') {
            if (Array.isArray(json[key])) {
                // If it's an array, check if it contains objects
                if (json[key].length > 0 && typeof json[key][0] === 'object') {
                    const nestedModelName = capitalizeFirstLetter(singularize(key));
                    const result = generateModels(json[key][0], nestedModelName);
                    mainModel += result.mainModel;
                    nestedModels = [...nestedModels, ...result.nestedModels];
                }
            } else {
                // If it's a nested object, generate a model for it
                const nestedModelName = capitalizeFirstLetter(key);
                const result = generateModels(json[key], nestedModelName);
                nestedModels.push(result.mainModel);
                nestedModels = [...nestedModels, ...result.nestedModels];
            }
        }
    }

    return { mainModel, nestedModels };
}

function generateSingleModel(json, modelName) {
    let fields = '';
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const type = getDartType(json[key], key);
            fields += `    @JsonKey(name: '${key}') ${type} ${toCamelCaseFirstLetter(key)},\n`;
        }
    }

    const template = `
@freezed
class ${formatSingleText(modelName)} with _\$${formatSingleText(modelName)} {
    const factory ${formatSingleText(modelName)}({
${fields.trimEnd()}
    }) = _${formatSingleText(modelName)};

    factory ${formatSingleText(modelName)}.fromJson(Map<String, dynamic> json) => _\$${formatSingleText(modelName)}FromJson(json);
}
`;

    return template;
}

function getDartType(value, key) {
    if (value === null) return 'dynamic?';
    if (typeof value === 'string') return 'String?';
    if (typeof value === 'number') return value % 1 === 0 ? 'int?' : 'double?';
    if (typeof value === 'boolean') return 'bool?';
    if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
            return `List<${capitalizeFirstLetter(singularize(key))}>?`;
        }
        return 'List<dynamic>?';
    }
    if (typeof value === 'object') return `${capitalizeFirstLetter(key)}?`;
    return 'dynamic?';
}

function toCamelCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1).replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function singularize(str) {
    return str.replace(/s$/, '');
}

function toSnakeCase(input) {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/\s+/g, '_')
        .toLowerCase();
}

function formatSingleText(input) {
    if (input.includes(' ') || input.includes('_')) {
        return input.split(/[\s_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
    }
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}


function runBuildRunnerCommand() {
    const terminal = vscode.window.createTerminal('Flutter Build Runner');
    terminal.show();
    terminal.sendText('flutter pub run build_runner build');
}

module.exports = { registerCreateModelCommand };
