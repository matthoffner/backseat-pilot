import * as vscode from 'vscode';

export async function activate(context) {
	let disposableRefactor = vscode.commands.registerCommand('backseat-pilot.llm_refactor', async () => {
		const selectedTextResult = getSelectedTextAndLanguage();
		const selectedText = selectedTextResult[0];
		console.log(`Selected text: ${selectedText}\n\n========\n`);
		const message = `Refactor this code and fix any typos or mistakes.\n\n=======\n${selectedText}\n==========`;
		const result = await llmChat(message);
		console.log(result);
		await replaceSelectedText(result);

	});

	context.subscriptions.push(disposableRefactor);

	let disposableText2Code = vscode.commands.registerCommand('backseat-pilot.llm_description2code', async () => {
		const selectedTextResult = getSelectedTextAndLanguage();
		const selectedText = selectedTextResult[0];
		const lang = selectedTextResult[1];
		console.log(`Selected text: ${selectedText}\nLang is ${lang}`);
		const message = `Refactor this text description into ${lang} code. Only return code. \n\n=======\n${selectedText}\n==========`;
		const result = await llmChat(message);
		console.log(result);
		await replaceSelectedText("\n"+result, true);

	});
	context.subscriptions.push(disposableText2Code);

	let disposableChat = vscode.commands.registerCommand('backseat-pilot.chat', async () => {
		const selectedTextResult = getSelectedTextAndLanguage();
		const selectedText = selectedTextResult[0];
		const lang = selectedTextResult[1];
		console.log(`Selected text: ${selectedText}\nLang is ${lang}`);
		const message = selectedText;
		const result = await llmChat(message);
		console.log(result);
		await replaceSelectedText("\n"+result, true);
	});
	context.subscriptions.push(disposableChat);
}


async function llmChat(message) {
	const request = JSON.stringify({
		prompt: message,
		stop: []
	});
	const response = await fetch('http://localhost:8000/v1/completions', {
		"headers": {
			"content-type": "application/json"
		},
		"method": "POST",
		"body": request,
	});
	const result = await response.json();
	console.log(result);
	
	return result.choices.map(choice => choice.text).join('\n');
}

// Helper function to get the selected text
function getSelectedTextAndLanguage() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found');
		return [undefined, undefined];
	}

	const selection = editor.selection;
	if (selection.isEmpty) {
		vscode.window.showInformationMessage('Please select some text to refactor.');
		return [undefined, undefined];
	}

	const document = editor.document;
	const language = document.languageId;
	const selectedText = document.getText(selection);
	return [selectedText, language];
}


// Helper function to replace the selected text with the given text
async function replaceSelectedText(text, appendAfterSelection = false) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active text editor found');
		return;
	}

	const selection = editor.selection;
	const start = selection.start;
	const end = selection.end;

	if (appendAfterSelection) {
		const line = editor.document.lineAt(end.line);
		const endOfLine = line.range.end;
		await editor.edit(editBuilder => editBuilder.insert(endOfLine, text));
	} else {
		await editor.edit(editBuilder => editBuilder.replace(selection, text));
	}
}
