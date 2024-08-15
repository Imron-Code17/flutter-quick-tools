const vscode = require('vscode');
const { registerInitializeCommand } = require('./commands/initialize');
const { registerCreateFeatureCommand } = require('./commands/create_feature');
const { registerCreateModelCommand } = require('./commands/create_model');
const { createWebviewPanel } = require('./webview_panel');

const MySidebarProvider = require('./my_sidebar_provider');
// Jika ada command lain, Anda bisa mengimpor seperti ini:
// const { registerCreateFeatureCommand } = require('./createFeature');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const sidebarProvider = new MySidebarProvider(context);

	// Register the sidebar view
	const sidebarView = vscode.window.createTreeView('mySidebar', {
		treeDataProvider: sidebarProvider
	});

	// Register the 'createModel' command
	context.subscriptions.push(
		vscode.commands.registerCommand('flutterquicktools.createModel', () => {
			createWebviewPanel(context);
		})
	);
	console.log('FlutterQuickTools is now active!');

	// Daftarkan command di sini
	registerInitializeCommand(context);

	// Daftarkan command lain di sini
	// registerCreateFeatureCommand(context);
}

function deactivate() { }


module.exports = {
	activate,
	deactivate
};
