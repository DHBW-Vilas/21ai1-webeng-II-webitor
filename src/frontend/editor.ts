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

interface DisplayedWSFile extends WSFile {
	isSaved: boolean;
	modifiedContent: string | null;
	el: HTMLDivElement | null;
}

interface DisplayedWSDir extends WSDir {
	isOpen: boolean;
	el: HTMLDivElement | null;
	icon: HTMLImageElement | null;
	files: DisplayedWSFile[];
	dirs: DisplayedWSDir[];
}

type Document = {
	id: WSId;
	name: string;
};

let root: DisplayedWSDir | null = null;
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
			root = {
				_id: (res.root as WSDir)._id,
				name: (res.root as WSDir).name,
				dirs: (res.root as WSDir).dirs.map((d) => addDirEl(fileExplorerEl, d, 0)),
				files: (res.root as WSDir).files.map((f) => addFileEl(fileExplorerEl, f, 0)),
				isOpen: true,
				el: null,
				icon: null,
			};
			fileExplorerHeader.innerText = root.name;
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

function openFile(file: DisplayedWSFile | null) {
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

function addFileEl(parent: HTMLDivElement, file: WSFile, depth: number): DisplayedWSFile {
	const container = document.createElement('div');
	container.classList.add('file-explorer-container');

	const fileEl = document.createElement('div');
	fileEl.classList.add('file-explorer-el', 'file-el');

	const displayedFile: DisplayedWSFile = {
		_id: file._id,
		name: file.name,
		content: file.isTextfile ? b64_to_utf8(file.content as string) : '',
		isTextfile: file.isTextfile,
		el: fileEl,
		isSaved: true,
		modifiedContent: null,
	};
	let fileIconName = (file.isTextfile ? 'text' : 'binary') + '-file.png';
	fileEl.addEventListener('click', (e) => openFile(displayedFile));

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
	return displayedFile;
}

function addDirEl(parent: HTMLDivElement, dir: WSDir, depth: number): DisplayedWSDir {
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

	folderEl.appendChild(folderIcon);
	folderEl.appendChild(folderName);
	for (let i = 0; i < depth; i++) container.appendChild(makeDepthPadEl());
	container.appendChild(folderEl);
	parent.appendChild(container);

	const displayedFolder: DisplayedWSDir = {
		_id: dir._id,
		name: dir.name,
		isOpen: true,
		el: folderEl,
		icon: folderIcon,
		dirs: dir.dirs.map((d) => addDirEl(parent, d, depth + 1)),
		files: dir.files.map((f) => addFileEl(parent, f, depth + 1)),
	};
	folderEl.addEventListener('click', (e) => toggleFolder(displayedFolder));

	return displayedFolder;
}

function toggleFolder(folder: DisplayedWSDir) {
	if (folder.isOpen) {
		if (folder.icon) folder.icon.src = '/public/icons/closed-folder.png';
		folder.dirs.forEach((d) => d.el?.classList.add('hidden'));
		folder.files.forEach((f) => f.el?.classList.add('hidden'));
	} else {
		if (folder.icon) folder.icon.src = '/public/icons/open-folder.png';
		folder.dirs.forEach((d) => d.el?.classList.remove('hidden'));
		folder.files.forEach((f) => f.el?.classList.remove('hidden'));
	}
	folder.isOpen = !folder.isOpen;
}
