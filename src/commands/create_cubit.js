const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function registerCreateCubitCommand(context) {
    let initCommand = vscode.commands.registerCommand('fluttermagictools.createCubit', function () { });
    context.subscriptions.push(initCommand);
}

module.exports = {
    registerCreateCubitCommand
};