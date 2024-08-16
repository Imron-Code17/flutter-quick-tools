const vscode = require('vscode');
const { registerInitializeCommand } = require('./commands/initialize');
const { registerCreateFeatureCommand } = require('./commands/create_feature');
const { registerCreateModelCommand } = require('./commands/create_model');
const { registerCreateViewCommand } = require('./commands/create_view');
const { registerCreateCubitCommand } = require('./commands/create_cubit');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('FlutterMagicTools is now active!');

	// Daftarkan command di sini
	registerInitializeCommand(context);
	registerCreateFeatureCommand(context);
	registerCreateModelCommand(context);
	registerCreateViewCommand(context);
	registerCreateCubitCommand(context);

	// Daftarkan command lain di sini
	// registerCreateFeatureCommand(context);
}

function deactivate() { }


module.exports = {
	activate,
	deactivate
};
