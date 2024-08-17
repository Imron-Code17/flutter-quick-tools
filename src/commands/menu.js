const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerMenuCommand(context) {
    let initCommand = vscode.commands.registerCommand('fluttermagictools.menu', function () {
        const panel = vscode.window.createWebviewPanel(
            'createRequest', // Identitas panel
            'Create Feature', // Judul panel
            vscode.ViewColumn.One, // Tempat munculnya panel
            {
                enableScripts: true // Izinkan penggunaan JavaScript di Webview
            }
        );

        // HTML yang akan dirender oleh Webview
        const htmlPath = path.join(__dirname, '../menu/menu_view.html');

        // Baca file HTML dan set HTML untuk Webview
        const htmlContent = getWebviewContent(htmlPath);
        panel.webview.html = htmlContent;

        // Handle pesan yang dikirim dari Webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'submitForm':
                        vscode.window.showInformationMessage(`Form Submitted: ${message.text}`);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'fileSelected':
                        const filePath = path.join(__dirname, '../menu', message.file);
                        vscode.window.showInformationMessage(`Form Submitted: ${message.text}`);
                        break;
                }
            },
            undefined,
            context.subscriptions
        );
    });
    context.subscriptions.push(initCommand);
}


function getWebviewContent(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    return html;
}

module.exports = {
    registerMenuCommand
};