const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerCreateFeatureCommand(context) {
    let initCommand = vscode.commands.registerCommand('flutterquicktools.createFeature', function () { });
    context.subscriptions.push(initCommand);
}

module.exports = {
    registerCreateFeatureCommand
};