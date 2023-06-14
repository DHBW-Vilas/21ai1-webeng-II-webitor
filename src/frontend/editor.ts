import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { WSDir, WSFile, WSId } from '../models';
import { findFileById } from '../util/workspace';

const fileExplorerEl = document.getElementById('file-explorer') as HTMLDivElement;
const fileExplorerHeader = document.getElementById('file-explorer-header') as HTMLHeadingElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const editorTextArea = document.getElementById('editor') as HTMLTextAreaElement;
const editorHeader = document.getElementById('editor-header') as HTMLHeadingElement;

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

openFile(null);

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
		body: JSON.stringify({ text: utf8_to_b64(file.content) }),
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
			root = res.root as WSDir;
			fileExplorerHeader.innerText = root.name;
			root.dirs.forEach((d) => addDirEl(fileExplorerEl, d, 0));
			root.files.forEach((f) => addFileEl(fileExplorerEl, f, 0));
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
function utf8_to_b64(str: string): string {
	return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str: string): string {
	return decodeURIComponent(escape(atob(str)));
}

function openFile(file: WSFile | null) {
	if (file === null) {
		currentDoc = null;
		editorView.setState(EditorState.create({ doc: '' }));
		editorHeader.innerText = 'No File opened';
	} else if (!file.isTextfile) {
		// TODO: Error handling
		editorHeader.innerText = file.name;
		console.log('You can only open text files');
		return;
	} else {
		editorHeader.innerText = file.name;
		currentDoc = { name: file.name, id: file._id };
		editorView.setState(EditorState.create({ doc: file.content as string }));
	}
}

function makeDepthPadEl(): HTMLDivElement {
	const pad = document.createElement('div');
	pad.classList.add('file-explorer-depth-pad');
	return pad;
}

function addFileEl(parent: HTMLDivElement, file: WSFile, depth: number) {
	const container = document.createElement('div');
	container.classList.add('file-explorer-container');

	const fileEl = document.createElement('div');
	fileEl.classList.add('file-explorer-el', 'file-el');

	let fileIconName = 'binary-file.png';
	if (file.isTextfile) {
		file.content = b64_to_utf8(file.content as string);
		fileIconName = 'text-file.png';
	}
	fileEl.addEventListener('click', (e) => openFile(file));

	const fileIcon = document.createElement('img');
	fileIcon.classList.add('icon');
	fileIcon.src = '/public/icons/' + fileIconName;

	const fileName = document.createElement('p');
	fileName.classList.add('file-name', 'file-explorer-el-name');
	fileName.innerText = file.name;

	fileEl.appendChild(fileIcon);
	fileEl.appendChild(fileName);
	for (let i = 0; i < depth; i++) container.appendChild(makeDepthPadEl());
	container.appendChild(fileEl);
	parent.appendChild(container);
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

function addDirEl(parent: HTMLDivElement, dir: WSDir, depth: number) {
	const container = document.createElement('div');
	container.classList.add('file-explorer-container');

	const folderEl = document.createElement('div');
	folderEl.classList.add('file-explorer-el', 'folder-el');

	const folderIcon = document.createElement('img');
	folderIcon.classList.add('icon');
	folderIcon.src = '/public/icons/open-folder.png';

	const folderName = document.createElement('p');
	folderName.classList.add('folder-name', 'file-explorer-el-name');
	folderName.innerText = dir.name;

	// folder.addEventListener('click', (e) => toggleDirEl(folder));

	folderEl.appendChild(folderIcon);
	folderEl.appendChild(folderName);
	for (let i = 0; i < depth; i++) container.appendChild(makeDepthPadEl());
	container.appendChild(folderEl);
	parent.appendChild(container);
	dir.dirs.forEach((d) => addDirEl(parent, d, depth + 1));
	dir.files.forEach((f) => addFileEl(parent, f, depth + 1));
}
