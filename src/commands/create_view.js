const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerCreateViewCommand(context) {
    let initCommand = vscode.commands.registerCommand('fluttermagictools.createView', function () { });
    context.subscriptions.push(initCommand);
}

module.exports = {
    registerCreateViewCommand
};