const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const { viewScript } = require('../script/view/view');

function registerCreateViewCommand(context) {
    let initCommand = vscode.commands.registerCommand('fluttermagictools.createView', async () => {
        const viewName = await vscode.window.showInputBox({
            prompt: 'Enter the view name',
            placeHolder: 'e.g., MyView'
        });

        if (!viewName) {
            vscode.window.showInformationMessage('View creation canceled or no input provided.');
            return;
        }

        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const presentationFolderPath = path.join(rootPath, 'lib', 'presentations');

        if (!fs.existsSync(presentationFolderPath)) {
            fs.mkdirSync(presentationFolderPath, { recursive: true });
        }

        const selectedFolder = await vscode.window.showQuickPick(
            getDirectories(presentationFolderPath).concat('+ Add Folder'),
            { placeHolder: 'Select a folder to save the view or add a new folder' }
        );

        let targetFolderPath = presentationFolderPath;
        let targetFolder;
        let selectFilePath;

        if (selectedFolder === '+ Add Folder') {
            const newFolderName = await vscode.window.showInputBox({
                prompt: 'Enter the new folder name'
            });

            if (newFolderName) {
                targetFolderPath = path.join(presentationFolderPath, newFolderName, 'view');
                fs.mkdirSync(targetFolderPath, { recursive: true });
                selectFilePath = path.join(presentationFolderPath, newFolderName, `${newFolderName}.dart`);
                targetFolder = newFolderName;
            } else {
                vscode.window.showInformationMessage('Folder creation canceled or no input provided.');
                return;
            }
        } else if (selectedFolder) {
            targetFolderPath = path.join(presentationFolderPath, selectedFolder, 'view');
            selectFilePath = path.join(presentationFolderPath, selectedFolder, `${selectedFolder}.dart`);
            targetFolder = selectedFolder;
        } else {
            vscode.window.showInformationMessage('No folder selected.');
            return;
        }

        const viewFileName = `${toSnakeCase(viewName)}_view.dart`;
        const viewFilePath = path.join(targetFolderPath, viewFileName);
        const exportStatement = `export 'view/${viewFileName}';\n`;
        const exportPresentationStatement = `export '${targetFolder}/${targetFolder}.dart';\n`;

        // Ensure that the 'presentations' directory exists
        const presentationFilePath = path.join(presentationFolderPath, 'presentations.dart');

        if (!fs.existsSync(viewFilePath)) {
            fs.writeFileSync(viewFilePath, viewScript(convertToCapitalized(viewName)));
        } else {
            const currentContent = fs.readFileSync(viewFilePath, 'utf-8');
            if (!currentContent.includes(viewScript(convertToCapitalized(viewName)))) {
                fs.appendFileSync(viewFilePath, viewScript(convertToCapitalized(viewName)));
            }
        }

        if (!fs.existsSync(selectFilePath)) {
            fs.writeFileSync(selectFilePath, exportStatement);
        } else {
            const currentContent = fs.readFileSync(selectFilePath, 'utf-8');
            if (!currentContent.includes(exportStatement)) {
                fs.appendFileSync(selectFilePath, exportStatement);
            }
        }

        if (!fs.existsSync(presentationFilePath)) {
            fs.writeFileSync(presentationFilePath, exportPresentationStatement);
        } else {
            const currentContent = fs.readFileSync(presentationFilePath, 'utf-8');
            if (!currentContent.includes(exportPresentationStatement)) {
                fs.appendFileSync(presentationFilePath, exportPresentationStatement);
            }
        }

        createRouter(viewName);

    });
    context.subscriptions.push(initCommand);
}

async function createRouter(viewName) {
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const routerFilePath = path.join(rootPath, 'lib', 'router', 'router.dart');

    const routeName = convertToCapitalized(viewName) + 'Route';

    const newRoute =
        `   AutoRoute(
          page: ${routeName}.page,
        ),\n`;

    if (fs.existsSync(routerFilePath)) {
        let routerContent = fs.readFileSync(routerFilePath, 'utf-8');
        const marker = '];';

        if (routerContent.includes(marker)) {
            const newContent = routerContent.replace(marker, newRoute + marker);
            fs.writeFileSync(routerFilePath, newContent, 'utf-8');
            vscode.window.showInformationMessage(`Route for ${viewName} added to router.dart.`);
        } else {
            vscode.window.showErrorMessage(`Marker '${marker}' not found in router.dart.`);
        }
        vscode.window.showInformationMessage(`View '${viewName}' created successfully'`);
        const shouldRunBuild = await vscode.window.showInformationMessage(
            'Do you want to run `flutter pub run build_runner build` now?',
            'Yes',
            'No'
        );

        if (shouldRunBuild === 'Yes') {
            runBuildRunnerCommand();
        }
    } else {
        vscode.window.showErrorMessage('router.dart file not found.');
    }
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

function toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
}

function convertToCapitalized(str) {
    return str
        .toLowerCase()
        .split(/[_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function runBuildRunnerCommand() {
    const terminal = vscode.window.createTerminal('Flutter Build Runner');
    terminal.show();
    terminal.sendText('flutter pub run build_runner build');
}

module.exports = {
    registerCreateViewCommand
};
