import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { WSDir, WSFile, WSId } from '../models';
import { findFileById } from '../util/workspace';

const fileExplorerEl = document.getElementById('file-explorer') as HTMLDivElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const editorTextArea = document.getElementById('editor') as HTMLTextAreaElement;

EditorView.baseTheme({
	'&light .cm-zebraStripe': { backgroundColor: '#d4fafa' },
	'&dark .cm-zebraStripe': { backgroundColor: '#1a2727' },
});

type Document = {
	id: WSId;
	name: string;
};

let root: WSDir | null = null;
let currentDoc: Document | null = null;
let workspaceId = localStorage.getItem('workspaceId');

const editorView = new EditorView({
	extensions: [basicSetup, javascript()],
	parent: editorTextArea,
});

document.addEventListener('keydown', (e) => {
	if (e.ctrlKey && e.key == 's') {
		e.preventDefault();
		saveFile();
	}
});

function saveFile() {
	if (currentDoc === null || root === null) return;
	const file = findFileById(root, currentDoc.id);
	if (file === null) {
		// TODO: sensible error handling
		console.log('File is null - should be unreachable');
		return;
	}
	const state = editorView.state;
	file.content = state.doc.toString();
	fetch('/workspace/file/' + workspaceId + '/' + currentDoc.id, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text: file.content }),
	})
		.then((res) => res.json())
		.then((res) => {
			console.log({ res });
		});
}

if (!workspaceId) {
	fetch('/empty/workspace', { method: 'POST' })
		.then((res) => res.json())
		.then((res) => {
			workspaceId = res.workspaceId;
			localStorage.setItem('workspaceId', workspaceId ?? '');
			getWorkspace();
		});
} else {
	getWorkspace();
}

function getWorkspace() {
	fetch('/workspace/' + workspaceId)
		.then((res) => res.json())
		.then((res) => {
			if (!res.success) {
				return fetch('/empty/workspace', { method: 'POST' })
					.then((res) => res.json())
					.then((res) => {
						workspaceId = res.workspaceId;
						localStorage.setItem('workspaceId', workspaceId ?? '');
						return getWorkspace();
					});
			}
			if (!res.root) throw new Error('Keine gültiges Workspace vom Server erhalten');
			root = res.root;
			addDirEl(fileExplorerEl, root!);
		})
		.catch((err) => {
			// TODO: Error Handling
			console.log({ err });
		});
}

downloadBtn.addEventListener('click', downloadWorkspace);

async function downloadWorkspace() {
	const anchor = document.createElement('a');
	anchor.href = '/download/' + workspaceId;
	anchor.target = '_blank';
	anchor.click();
	anchor.remove();
}

// See this post on why we need this function:
// https://stackoverflow.com/a/30106551/13764271
function b64_to_utf8(str: string) {
	return decodeURIComponent(escape(atob(str)));
}

function openFile(file: WSFile) {
	currentDoc = { name: file.name, id: file._id };
	const content = b64_to_utf8(file.content as string);
	editorView.setState(EditorState.create({ doc: content }));
}

function addFileEl(parent: HTMLDivElement, file: WSFile) {
	const div = document.createElement('div');
	div.classList.add('file-explorer-el', 'file-el');
	div.innerText = file.name;
	div.addEventListener('click', (e) => openFile(file));
	parent.insertAdjacentElement('beforeend', div);
}

// function toggleDirEl(dirEl) {
// 	// TODO: isOpen is not implemented
// 	let isOpen = false;
// 	if (isOpen) {
// 		dirEl.childNodes.forEach((c) => c.remove());
// 	} else {
// 		dirEl.dirs.forEach((dir) => addDirEl(dirEl, dir));
// 		dirEl.files.forEach((file) => addFileEl(dirEl, file));
// 	}
// }

function addDirEl(parent: HTMLDivElement, dir: WSDir) {
	const div = document.createElement('div');
	div.innerText = dir.name;
	// div.addEventListener('click', (e) => toggleDirEl(div));
	dir.dirs.forEach((d) => addDirEl(div, d));
	dir.files.forEach((f) => addFileEl(div, f));
	parent.insertAdjacentElement('beforeend', div);
}
