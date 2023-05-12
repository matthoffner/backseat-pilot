import * as vscode from 'vscode';
import * as fs from 'fs';
import * as TOML from 'toml';
import { LLM } from 'llama-node';
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";

const llama = new LLM(LLamaCpp);

export function activate(context) {
    const LLM_PATH = getLlmPath();

    llama.load({
        path: LLM_PATH,
        enableLogging: true,
        nCtx: 1024,
        nParts: -1,
        seed: 0,
        nThreads: 4,
        f16Kv: true,
        logitsAll: false,
        vocabOnly: false,
        useMlock: true,
        embedding: false,
        useMmap: true,
    });

	let disposableRefactor = vscode.commands.registerCommand('llm-helper.llm_refactor', async () => {
		const selectedTextResult = getSelectedTextAndLanguage();
		const selectedText = selectedTextResult[0];
		console.log(`Selected text: ${selectedText}\n\n========\n`);
		const message = `Refactor this code and fix any typos or mistakes.\n\n=======\n${selectedText}\n==========`;
		const result = await llamaChat(message, llama);
		await replaceSelectedText(result);

	});

	context.subscriptions.push(disposableRefactor);

	let disposableText2Code = vscode.commands.registerCommand('llm-helper.llm_description2code', async () => {
		const selectedTextResult = getSelectedTextAndLanguage();
		const selectedText = selectedTextResult[0];
		const lang = selectedTextResult[1];
		console.log(`Selected text: ${selectedText}\nLang is ${lang}`);
		const message = `Refactor this text description into ${lang} code. Only return code. \n\n=======\n${selectedText}\n==========`;
		const result = await llamaChat(message, llama);
		await replaceSelectedText("\n"+result, true);

	});
	context.subscriptions.push(disposableText2Code);

	let disposableChat = vscode.commands.registerCommand('llm-helper.chat', async () => {
		const selectedTextResult = getSelectedTextAndLanguage();
		const selectedText = selectedTextResult[0];
		const lang = selectedTextResult[1];
		console.log(`Selected text: ${selectedText}\nLang is ${lang}`);
		const message = selectedText;
		const result = await llamaChat(message, llama);
		await replaceSelectedText("\n"+result, true);

	});
	context.subscriptions.push(disposableChat);
}


async function llamaChat(message, llama) {
	const response = await llama.createCompletion({
        messages: [
            {role: 'system', content: system},
            ...previousMessages.map(({author, message}) => ({role: author, content: message})),
            {role: 'user', content: prompt},
        ],
        max_tokens: 1024,
        temperature: 0.1,
        nThreads: 6,
        nTokPredict: 1024,
        topK: 1000,
        prompt: message
    }, async (res) => {
        return res;
    });
	return response.tokens.join('');

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

function getLlmPath() {
	if (process.env.LLM_PATH) {
		return process.env.LLM_PATH;
	}
	let secretsFilePath;
	if (process.platform === 'win32') {
		secretsFilePath = path.join(process.env.USERPROFILE, '.llminterface', '.secrets.toml');
	} else {
		secretsFilePath = path.join(os.homedir(), '.llminterface', '.secrets.toml');
	}
	try {
		const secretsFileContents = fs.readFileSync(secretsFilePath, 'utf8');
		const secrets = TOML.parse(secretsFileContents);
		return secrets.openaikey;
	} catch (err) {
		const txt = "Failed to read LLM_PATH from TOML file or environment variable";
		console.error(txt);
		// add a message box to alert the user. 
		vscode.window.showInformationMessage(txt);
		return '';
	}
}
