import * as vscode from 'vscode';
const { execFile } = require('child_process');

export class CKMonContentProvider implements vscode.TextDocumentContentProvider {
    static scheme: string = "ckmon";
    
    onDidChange?: vscode.Event<vscode.Uri>;    
    
    /**
     *
     */
    constructor(private context: vscode.ExtensionContext) {
    }

    processCKMon( uri: vscode.Uri ) : Promise<string> {
        return new Promise( (resolve, reject ) => {

            const extensionPath = this.context.extensionPath;
            const processorPath = extensionPath + '\\out\\ckmontotext\\CKMonWrapper.dll';

            execFile( "dotnet", [processorPath, uri.path], ( error, stdout, stderr) =>{
                if(error){
                    vscode.window.showErrorMessage(error);
                    reject(error);
                }
                else {
                    // Display a message box to the user
                    vscode.window.showInformationMessage('CKMon!');
                    resolve(stdout);
                    // return vscode.workspace.openTextDocument( activeFileName + '.txt' )
                    //     .then( d => {
                    //         const allDocumentText = d.getText();
                    //         resolve(stdout);
                    //     });
                }
                // console.log(arguments)
            } );
        });
    }

    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
        console.log("PreviewUri", uri);

        return this.processCKMon(uri);
    }
}

// let seq = 0;

// export function encodeLocation(uri: vscode.Uri, pos: vscode.Position): vscode.Uri {
// 	const query = JSON.stringify([uri.toString(), pos.line, pos.character]);
// 	return vscode.Uri.parse(`${CKMonContentProvider.scheme}:References.locations?${query}#${seq++}`);
// }

// export function decodeLocation(uri: vscode.Uri): [vscode.Uri, vscode.Position] {
// 	let [target, line, character] = <[string, number, number]>JSON.parse(uri.query);
// 	return [vscode.Uri.parse(target), new vscode.Position(line, character)];
// }