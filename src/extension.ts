'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CKMonContentProvider } from './ckmon-provider';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ckmon" is now active!');

    const ckMonContentProvider = new CKMonContentProvider( context );
    const ckMonProvider = vscode.workspace.registerTextDocumentContentProvider( CKMonContentProvider.scheme,  ckMonContentProvider);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.ckmon', () => {
        // The code you place here will be executed every time your command is executed

        const textEditor = vscode.window.activeTextEditor;
        if( textEditor && !textEditor.document.fileName.endsWith('ckmon')){
            vscode.window.showWarningMessage('Cannot perform CKMon to Text conversion on non CKMon files.');
            return;
        }
        
        const uri = textEditor ? textEditor.document.uri :vscode.workspace.rootPath;
        const previewUri = vscode.Uri.parse(`${CKMonContentProvider.scheme}:${uri}`);
		return vscode.workspace.openTextDocument(previewUri).then(doc => {
            if( textEditor){
                vscode.window.showTextDocument(doc, textEditor.viewColumn + 1);
            }
            else{
                vscode.window.showTextDocument(doc);
            }
        });
    });

    context.subscriptions.push(disposable, ckMonProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}