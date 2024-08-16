const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const coreScript = require('../script/lib/core/core');
const errorsScript = require('../script/lib/core/errors');
const apiExceptionsScript = require('../script/lib/core/api_exception');
const failureScript = require('../script/lib/core/failure');
const networkExceptionsScript = require('../script/lib/core/network_exception');
const responseScript = require('../script/lib/core/response');
const usecaseScript = require('../script/lib/core/usecase');
const dataScript = require('../script/lib/data/data');
const domainScript = require('../script/lib/domain/domain');



function registerInitializeCommand(context) {
    let initCommand = vscode.commands.registerCommand('flutterquicktools.initialize', function () {
        vscode.window.showInformationMessage('Apakah Anda yakin ingin menginisialisasi?', 'Yes', 'No')
            .then(selection => {
                if (selection === 'Yes') {
                    runTask('flutter pub add dio auto_route connectivity_plus collection dartz device_info_plus equatable flutter_bloc freezed_annotation get_it gap hydrated_bloc json_annotation')
                        .then(() => {
                            return runTask('flutter pub add auto_route_generator build_runner freezed json_serializable -d').then(() => {
                                return runTask('flutter pub get');
                            });
                        })
                        .then(() => {
                            vscode.window.showInformationMessage('Packages fetched successfully!');

                            const libPath = path.join(vscode.workspace.rootPath, 'lib');

                            if (fs.existsSync(libPath)) {
                                fs.rmdirSync(libPath, { recursive: true });
                            }

                            fs.mkdirSync(libPath);
                            const folders = ['core', 'data', 'domain', 'di', 'presentations', 'router'];
                            folders.forEach(folder => {
                                fs.mkdirSync(path.join(libPath, folder));
                            });

                            const files = ['app.dart', 'config.dart', 'lib.dart', 'main.dart'];
                            files.forEach(file => {
                                fs.writeFileSync(path.join(libPath, file), '');
                            });

                            createCoreFiles(libPath);
                            createDataFiles(libPath);
                            createDomainFiles(libPath);
                            vscode.window.showInformationMessage('Inisialisasi selesai.');
                        })
                        .catch(err => {
                            vscode.window.showErrorMessage(`Error during initialization: ${err}`);
                        });
                } else if (selection === 'No') {
                    vscode.window.showInformationMessage('Inisialisasi dibatalkan.');
                }
            });
    });

    context.subscriptions.push(initCommand);
}

function createCoreFiles(libPath) {
    const corePath = path.join(libPath, 'core');
    fs.writeFileSync(path.join(corePath, 'core.dart'), coreScript);
    const subFolders = ['errors', 'network', 'response', 'usecase'];
    subFolders.forEach(folder => {
        const folderPath = path.join(corePath, folder);
        fs.mkdirSync(folderPath);

        if (folder === 'errors') {
            const subFileErrors = ['api_exception', 'failure', 'network_exception', 'errors'];
            subFileErrors.forEach(file => {
                createFile(corePath, folder, file);
            });
        } else {
            const fileName = folder === 'response' ? 'api_' + folder : folder;
            createFile(corePath, folder, fileName);
        }
    });
}

function createDataFiles(libPath) {
    const dataPath = path.join(libPath, 'data');
    fs.writeFileSync(path.join(dataPath, 'data.dart'), dataScript);
    const subFolders = ['api', 'repositories', 'themes', 'utils', 'widgets'];
    subFolders.forEach(folder => {
        const folderPath = path.join(dataPath, folder);
        fs.mkdirSync(folderPath);
        createFile(dataPath, folder, folder);
    });
}

function createDomainFiles(libPath) {
    const domainPath = path.join(libPath, 'domain');
    fs.writeFileSync(path.join(domainPath, 'domain.dart'), domainScript);
    const subFolders = ['entities', 'repositories', 'usecases'];
    subFolders.forEach(folder => {
        const folderPath = path.join(domainPath, folder);
        fs.mkdirSync(folderPath);
        fs.writeFileSync(path.join(folderPath, `${folder}.dart`), '');
    });
}

function createFile(libPath, folder, file) {
    const scriptContent = getScriptContent(file);
    const filePath = path.join(libPath, folder, `${file}.dart`);
    fs.writeFileSync(filePath, scriptContent);
}

function getScriptContent(fileName) {
    switch (fileName) {
        case 'core':
            return coreScript;
        case 'errors':
            return errorsScript;
        case 'api_exception':
            return apiExceptionsScript;
        case 'failure':
            return failureScript;
        case 'network_exception':
            return networkExceptionsScript;
        case 'response':
            return responseScript;
        case 'usecase':
            return usecaseScript;
        default:
            return `// Default script content for ${fileName}\n`;
    }
}

function runTask(command) {
    return new Promise((resolve, reject) => {
        const task = new vscode.Task(
            { type: 'shell' },
            vscode.TaskScope.Workspace,
            'Flutter Command',
            'Flutter',
            new vscode.ShellExecution(command)
        );

        task.presentationOptions = {
            reveal: vscode.TaskRevealKind.Always
        };

        vscode.tasks.executeTask(task).then(
            () => {
                resolve();
            },
            (err) => {
                reject(err);
            }
        );
    });
}

module.exports = {
    registerInitializeCommand
};
