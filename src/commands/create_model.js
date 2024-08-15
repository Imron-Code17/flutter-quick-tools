const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerCreateModelCommand(context) {
    let initCommand = vscode.commands.registerCommand('flutterquicktools.createModel', function () { });
    context.subscriptions.push(initCommand);
}

module.exports = {
    registerCreateModelCommand
};