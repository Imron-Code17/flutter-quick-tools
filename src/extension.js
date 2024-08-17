const vscode = require('vscode');
const { registerInitializeCommand } = require('./commands/initialize');
const { registerMenuCommand } = require('./commands/menu');
const { registerCreateRequestCommand } = require('./commands/create_request');
const { registerCreateModelCommand } = require('./commands/create_model');
const { getWebviewContent } = require('./sidebar/sidebar');
const { registerCreateViewCommand } = require('./commands/create_view');
const { registerCreateCubitCommand } = require('./commands/create_cubit');
const { registerCreateEndpointCommand } = require('./commands/create_endpoint');



/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('FlutterMagicTools is now active!');

	// Daftarkan command di sini
	registerInitializeCommand(context);
	registerMenuCommand(context);
	registerCreateRequestCommand(context);
	registerCreateModelCommand(context);
	registerCreateViewCommand(context);
	registerCreateCubitCommand(context);
	registerCreateEndpointCommand(context);
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('fluttermagictools.sidebar', sidebarProvider));


	// Daftarkan command lain di sini
	// registerCreateFeatureCommand(context);
}

function deactivate() { }

class SidebarProvider {
	constructor(extensionUri) {
		this._extensionUri = extensionUri;
	}

	resolveWebviewView(webviewView, context) {
		webviewView.webview.html = getWebviewContent;

		webviewView.webview.onDidReceiveMessage(
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
	}
}


module.exports = {
	activate,
	deactivate
};
