const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerCreateRequestCommand(context) {
    let initCommand = vscode.commands.registerCommand('fluttermagictools.createRequest', async ()=> {
        const functionName = await vscode.window.showInputBox({
            prompt: 'Enter the function name',
            placeHolder: 'e.g., getAllData'
        });
        const objectName = await vscode.window.showInputBox({
            prompt: 'Enter the object name',
            placeHolder: 'e.g., List<Object>'
        });

        const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const apiFolderPath = path.join(rootPath, 'lib', 'data', 'api');
        

        if (!fs.existsSync(apiFolderPath)) {
            fs.mkdirSync(apiFolderPath, { recursive: true });
        }

        const selectedFolder = await vscode.window.showQuickPick(
            getDirectories(apiFolderPath).concat('+ Add Folder'),
            { placeHolder: 'Select a folder to save the api or add a new folder' }
        );

        let targetFolderPath = apiFolderPath;
        let targetFolder;
        

        if (selectedFolder === '+ Add Folder') {
            const newFolderName = await vscode.window.showInputBox({
                prompt: 'Enter the new folder name'
            });

            if (newFolderName) {
                targetFolderPath = path.join(apiFolderPath, newFolderName);
                fs.mkdirSync(targetFolderPath, { recursive: true });
                targetFolder = newFolderName;
            }
        } else {
            targetFolderPath = path.join(apiFolderPath, selectedFolder);
            targetFolder = selectedFolder;
        }

        const functionFileName = `${toSnakeCase(targetFolder)}_api.dart`;
        const functionFilePath = path.join(targetFolderPath, functionFileName);
        const functionTemplate = createApiClass(toSnakeCase(targetFolder));
        fs.writeFileSync(functionFilePath, functionTemplate);
    });

    context.subscriptions.push(initCommand);
}

function createApiClass(nameClass){
    return [
        `
// ignore_for_file: unused_import

import 'package:dio/dio.dart';
import '../../../lib.dart';

abstract class ${formatSingleText(nameClass)}Api {}

class ${formatSingleText(nameClass)}ApiImpl implements ${formatSingleText(nameClass)}Api {
  final Dio dio;

  ${formatSingleText(nameClass)}ApiImpl(this.dio);
} `
    ].join('\n');
}

function getDirectories(srcPath) {
    return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
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

module.exports = {
    registerCreateRequestCommand,
};




// const vscode = require('vscode');
// const fs = require('fs');
// const path = require('path');

// function registerCreateRequestCommand(context) {
//     let initCommand = vscode.commands.registerCommand('fluttermagictools.createRequest', function () {
        
        
//         const panel = vscode.window.createWebviewPanel(
//             '', // Identitas panel
//             'Create Request', // Judul panel
//             vscode.ViewColumn.One, // Tempat munculnya panel
//             {
//                 enableScripts: true // Izinkan penggunaan JavaScript di Webview
//             }
//         );

//         // HTML yang akan dirender oleh Webview
//         const htmlPath = path.join(__dirname, 'view.html');

//         // Baca file HTML dan set HTML untuk Webview
//         const htmlContent = getWebviewContent(htmlPath);
//         panel.webview.html = htmlContent;

//         // Handle pesan yang dikirim dari Webview
//         panel.webview.onDidReceiveMessage(
//             message => {
//                 switch (message.command) {
//                     case 'submitForm':
//                         vscode.window.showInformationMessage(`Form Submitted: ${message.text}`);
//                         return;
//                 }
//             },
//             undefined,
//             context.subscriptions
//         );
//     });

//     context.subscriptions.push(initCommand);
// }

// // Fungsi untuk menghasilkan konten HTML Webview
// function getWebviewContent(filePath) {
//     // Baca file HTML sebagai string
//     const html = fs.readFileSync(filePath, 'utf8');

//     // Return konten HTML
//     return html;
// }

// module.exports = {
//     registerCreateRequestCommand,
//     getWebviewContent
// };
