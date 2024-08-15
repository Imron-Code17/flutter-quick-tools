const vscode = require('vscode');

function createWebviewPanel(context) {
    const panel = vscode.window.createWebviewPanel(
        'createModelForm', // Identifikasi panel
        'Create Model', // Judul panel
        vscode.ViewColumn.One, // Tempatkan panel di kolom pertama
        {
            enableScripts: true // Aktifkan JavaScript dalam webview
        }
    );

    // HTML konten untuk webview
    panel.webview.html = getWebviewContent();

    // Tambahkan handler untuk pesan yang dikirim dari webview
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'submit':
                    vscode.window.showInformationMessage(`Model created: ${message.modelName}`);
                    panel.dispose(); // Tutup panel setelah aksi
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Create Model</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    width: 300px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                }
                .form-group input {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .button {
                    padding: 10px;
                    background-color: #007acc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .button:hover {
                    background-color: #005f99;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Create Model</h2>
                <div class="form-group">
                    <label for="modelName">Model Name</label>
                    <input type="text" id="modelName" placeholder="Enter model name" />
                </div>
                <button class="button" onclick="submit()">Create</button>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                
                function submit() {
                    const modelName = document.getElementById('modelName').value;
                    vscode.postMessage({
                        command: 'submit',
                        modelName: modelName
                    });
                }
            </script>
        </body>
        </html>
    `;
}

module.exports = {
    createWebviewPanel
};
