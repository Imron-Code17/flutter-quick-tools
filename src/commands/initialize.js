const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const buildScript = require('../script/build');
const coreScript = require('../script/lib/core/core');
const errorsScript = require('../script/lib/core/errors');
const apiExceptionsScript = require('../script/lib/core/api_exception');
const failureScript = require('../script/lib/core/failure');
const networkExceptionsScript = require('../script/lib/core/network_exception');
const responseScript = require('../script/lib/core/response');
const usecaseScript = require('../script/lib/core/usecase');
const networkScript = require('../script/lib/core/network');
const apiResponseScript = require('../script/lib/core/api_response');
const dataScript = require('../script/lib/data/data');
const domainScript = require('../script/lib/domain/domain');
const diScript = require('../script/lib/di/di');
const appScript = require('../script/lib/app');
const configScript = require('../script/lib/config');
const mainScript = require('../script/lib/main');
const libScript = require('../script/lib/lib');
const utilsScript = require('../script/lib/data/utils/utils');
const appBottomsheetScript = require('../script/lib/data/utils/app_bottomsheet');
const appDialogScript = require('../script/lib/data/utils/app_dialog');
const dioTokenInterceptorScript = require('../script/lib/data/utils/dio_token_interceptor');
const parseIntToBoolScript = require('../script/lib/data/utils/parse_int_to_bool');
const extensionsScript = require('../script/lib/data/utils/extensions/extensions');
const doubleExtensionScript = require('../script/lib/data/utils/extensions/double_extension');
const stringExtensionScript = require('../script/lib/data/utils/extensions/string_extension');
const contextExtensionScript = require('../script/lib/data/utils/extensions/context_extension');
const themeScript = require('../script/lib/data/themes/themes');
const themePrimaryScript = require('../script/lib/data/themes/primary_theme');
const routerScript = require('../script/lib/router/router');
const authGuardScript = require('../script/lib/router/guards/auth_guard');
const presentationsScript = require('../script/lib/presentations/presentations');
const authScript = require('../script/lib/presentations/auth/auth');
const authViewScript = require('../script/lib/presentations/auth/view/auth_view');
const authCubitScript = require('../script/lib/presentations/auth/cubit/auth_cubit');
const authStateScript = require('../script/lib/presentations/auth/cubit/auth_state');


async function registerInitializeCommand(context) {
    let initCommand = vscode.commands.registerCommand('fluttermagictools.initialize', async function () {
        const selection = await vscode.window.showInformationMessage('Are you sure you want to initialize?', 'Yes', 'No');

        if (selection === 'Yes') {
            try {

                const libPath = path.join(vscode.workspace.rootPath, 'lib');
                const rootPath = vscode.workspace.rootPath;
                fs.writeFileSync(path.join(rootPath, 'build.yml'), buildScript);

                if (fs.existsSync(libPath)) {
                    fs.rmdirSync(libPath, { recursive: true });
                }

                fs.mkdirSync(libPath);
                const folders = ['core', 'data', 'domain', 'di', 'presentations', 'router'];
                folders.forEach(folder => {
                    fs.mkdirSync(path.join(libPath, folder));
                });

                const files = ['app.dart', 'config.dart', 'lib.dart', 'main.dart'];
                const scriptLibs = [appScript, configScript, libScript, mainScript];
                files.forEach((file, index) => {
                    createSubFiles(libPath, file, scriptLibs[index]);
                });

                createCoreFiles(libPath);
                createDataFiles(libPath);
                createDomainFiles(libPath);
                createPresentationFiles(libPath);
                createDiFiles(libPath);
                createRouterFiles(libPath);

                await runTask(`flutter pub add dio auto_route connectivity_plus path_provider collection dartz phosphor_flutter device_info_plus package_info_plus equatable flutter_easy_dialogs flutter_bloc freezed_annotation get_it gap hydrated_bloc json_annotation &&
                    flutter pub add auto_route_generator build_runner freezed json_serializable -d &&
                    flutter pub get &&
                    flutter pub run build_runner build`);
                vscode.window.showInformationMessage('Inisialisasi selesai.');
            } catch (err) {
                vscode.window.showErrorMessage(`Error during initialization: ${err}`);
            }
        } else if (selection === 'No') {
            vscode.window.showInformationMessage('Inisialisasi dibatalkan.');
        }
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
    createUtilsFiles(dataPath);
    createThemesFiles(dataPath);
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

function createPresentationFiles(libPath) {
    const presentationPath = path.join(libPath, 'presentations');
    fs.writeFileSync(path.join(presentationPath, 'presentations.dart'), presentationsScript);
    createAuthFiles(presentationPath);
}

function createDiFiles(libPath) {
    const presentationPath = path.join(libPath, 'di');
    fs.writeFileSync(path.join(presentationPath, 'di.dart'), diScript);
}

function createUtilsFiles(libPath) {
    const utilsPath = path.join(libPath, 'utils');
    fs.writeFileSync(path.join(utilsPath, 'utils.dart'), utilsScript);
    const files = ['app_bottomsheet.dart', 'app_dialog.dart', 'dio_token_interceptor.dart', 'parse_int_to_bool.dart'];
    const scriptLibs = [appBottomsheetScript, appDialogScript, dioTokenInterceptorScript, parseIntToBoolScript];
    files.forEach((file, index) => {
        createSubFiles(utilsPath, file, scriptLibs[index]);
    });
    createExtensionFiles(utilsPath);

}

function createExtensionFiles(libPath) {
    const extensionsPath = path.join(libPath, 'extensions');
    if (!fs.existsSync(extensionsPath)) {
        fs.mkdirSync(extensionsPath, { recursive: true });
    }

    fs.writeFileSync(path.join(extensionsPath, 'extensions.dart'), extensionsScript);

    const extensionFiles = ['context_extension.dart', 'double_extension.dart', 'string_extension.dart'];
    const extensionScripts = [contextExtensionScript, doubleExtensionScript, stringExtensionScript];

    extensionFiles.forEach((file, index) => {
        createSubFiles(extensionsPath, file, extensionScripts[index]);
    });
}

function createThemesFiles(libPath) {
    const themesPath = path.join(libPath, 'themes');
    fs.writeFileSync(path.join(themesPath, 'themes.dart'), themeScript);
    const files = ['primary_theme.dart'];
    const scriptTheme = [themePrimaryScript];
    files.forEach((file, index) => {
        createSubFiles(themesPath, file, scriptTheme[index]);
    });

}

function createRouterFiles(libPath) {
    const routerPath = path.join(libPath, 'router');
    fs.writeFileSync(path.join(routerPath, 'router.dart'), routerScript);
    fs.mkdirSync(path.join(routerPath, 'guards'));
    const guardsPath = path.join(routerPath, 'guards');
    fs.writeFileSync(path.join(guardsPath, 'auth_guard.dart'), authGuardScript);

}

function createAuthFiles(libPath) {
    const authPath = path.join(libPath, 'auth');
    if (!fs.existsSync(authPath)) {
        fs.mkdirSync(authPath);
    }

    fs.writeFileSync(path.join(authPath, 'auth.dart'), authScript);

    const viewPath = path.join(authPath, 'view');
    const cubitPath = path.join(authPath, 'cubit');
    if (!fs.existsSync(viewPath)) {
        fs.mkdirSync(viewPath);
    }
    if (!fs.existsSync(cubitPath)) {
        fs.mkdirSync(cubitPath);
    }
    fs.writeFileSync(path.join(viewPath, 'auth_view.dart'), authViewScript);

    fs.writeFileSync(path.join(cubitPath, 'auth_cubit.dart'), authCubitScript);
    fs.writeFileSync(path.join(cubitPath, 'auth_state.dart'), authStateScript);
}


function createFile(libPath, folder, file) {
    const scriptContent = getScriptContent(file);
    const filePath = path.join(libPath, folder, `${file}.dart`);
    fs.writeFileSync(filePath, scriptContent);
}

function createSubFiles(libPath, file, scriptContent) {
    const filePath = path.join(libPath, file);
    fs.writeFileSync(filePath, scriptContent, 'utf-8');
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
        case 'network':
            return networkScript;
        case 'api_response':
            return apiResponseScript;
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
