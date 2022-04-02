import { window, commands, ExtensionContext } from "vscode";
import { CheckCodeService } from "./CheckCodeService";

export function activate(context: ExtensionContext) {
	
	let previewTemplate = commands.registerCommand('amazonmailing.previewTemplate', async () => {

		const fileOpened = window.activeTextEditor?.document.uri.fsPath,
				fileExtension = fileOpened?.split('.').pop();

		if(fileExtension==='liquid'){
			try{
				await commands.executeCommand('brazeLiquidPreview.preview');
			}catch(e){
				window.showErrorMessage('You must install/activate Braze Liquid Preview Extension');
			}
		}else if(fileExtension==='handlebars'){
			try{
				await commands.executeCommand('extension.previewHandlebars');
			}catch(e){
				window.showErrorMessage('You must install/activate Preview Handlebars Extension');
			}
		}

	});

	let verifyTemplate = commands.registerCommand('amazonmailing.verifyTemplate', () => {

		var editor = window.activeTextEditor;
		if(!editor){ return; }

		var text = editor.document.getText();
		if(!text){ window.showWarningMessage('Empty document'); return; }

		const checkcodeService = new CheckCodeService({ html:text });
		checkcodeService.checkSintaxys();

	});


}

export function deactivate() {}
