const vscode = require('vscode');

function activate(context) {
	console.log('Extension "flutterquicktools" is now active!');

	// Register a command that is invoked when the icon is clicked
	let disposable = vscode.commands.registerCommand('flutterquicktools.showDialog', function () {
		// Show a message box with a button
		vscode.window.showInformationMessage(
			'Do you want to proceed?',
			{ modal: true }, // make it a modal dialog
			'Yes' // this is the label of the button
		).then(selection => {
			if (selection === 'Yes') {
				vscode.window.showInformationMessage('You clicked Yes!');
			}
		});
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
