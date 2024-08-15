const vscode = require('vscode');
const { createWebviewPanel } = require('./webview_panel'); // Import the function to create a Webview Panel

class MySidebarProvider {
    constructor(context) {
        this.context = context;
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(this.getRootItems());
        }
    }

    getRootItems() {
        return [
            new vscode.TreeItem('Initialize', vscode.TreeItemCollapsibleState.None),
            new vscode.TreeItem('Create Feature', vscode.TreeItemCollapsibleState.Collapsed),
            new vscode.TreeItem('Create Model', vscode.TreeItemCollapsibleState.None),
        ];
    }

    // Add a method to handle clicks on items
    handleItemClick(element) {
        switch (element.label) {
            case 'Create Model':
                createWebviewPanel(this.context);
                break;
            // Handle other items if necessary
        }
    }
}

module.exports = MySidebarProvider;
