import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

const fileExplorerEl = document.getElementById('file-explorer');
const downloadBtn = document.getElementById('download-btn');

const editorView = new EditorView({
	extensions: [basicSetup, javascript()],
	parent: document.getElementById('editor') ?? undefined,
});

let workspaceId = localStorage.getItem('workspaceId');
console.log({ workspaceId });
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
			const root = res.root;
			addDirEl(fileExplorerEl, root);
		})
		.catch((err) => {
			// TODO: Error Handling
			console.log({ err });
		});
}

downloadBtn?.addEventListener('click', downloadWorkspace);

async function downloadWorkspace() {
	const anchor = document.createElement('a');
	anchor.href = '/download/' + workspaceId;
	anchor.target = '_blank';
	anchor.click();
	anchor.remove();
}

// saveBtn.addEventListener('click', saveFile);

document.addEventListener('keyup', (e) => {
	if (e.key === 's' && e.ctrlKey) {
		saveFile();
	}
});

function saveFile() {
	fetch('/');
}

// See this post on why we need this function:
// https://stackoverflow.com/a/30106551/13764271
function b64_to_utf8(str) {
	return decodeURIComponent(escape(atob(str)));
}

function openFile(file) {
	const content = b64_to_utf8(file.content);
	console.log(content);
}

function addFileEl(parent, file) {
	const div = document.createElement('div');
	div.classList.add('file-explorer-el', 'file-el');
	div.innerText = file.name;
	div.addEventListener('click', (e) => openFile(file));
	parent.insertAdjacentElement('beforeend', div);
}

function toggleDirEl(dirEl) {
	// TODO: isOpen is not implemented
	let isOpen = false;
	if (isOpen) {
		dirEl.childNodes.forEach((c) => c.remove());
	} else {
		dirEl.dirs.forEach((dir) => addDirEl(dirEl, dir));
		dirEl.files.forEach((file) => addFileEl(dirEl, file));
	}
}

function addDirEl(parent, dir) {
	const div = document.createElement('div');
	div.innerText = dir.name;
	// div.addEventListener('click', (e) => toggleDirEl(div));
	dir.dirs.forEach((d) => addDirEl(div, d));
	dir.files.forEach((f) => addFileEl(div, f));
	parent.insertAdjacentElement('beforeend', div);
}
