import { EditorState } from '@codemirror/state';
import {
	EditorView,
	keymap,
	highlightSpecialChars,
	drawSelection,
	highlightActiveLine,
	dropCursor,
	rectangularSelection,
	crosshairCursor,
	lineNumbers,
	highlightActiveLineGutter,
} from '@codemirror/view';
import { defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { getLangExtension } from './lang';
import { WSDir, WSElement, WSFile, Workspace } from '../models';
import { idxOfDir, isValidName } from '../util/workspace';
import { ResCreateDir, ResCreateFile } from '../util/endpoints';

const fileExplorerEl = document.getElementById('file-explorer') as HTMLDivElement;
const fileExplorerHeader = document.getElementById('file-explorer-header') as HTMLHeadingElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const editorTextArea = document.getElementById('editor') as HTMLTextAreaElement;
const editorHeader = document.getElementById('editor-header') as HTMLHeadingElement;
const newFileIcon = document.getElementById('new-file-icon') as HTMLImageElement;
const newFolderIcon = document.getElementById('new-folder-icon') as HTMLImageElement;

function updateBoxHeights() {
	const container = document.getElementById('container') as HTMLDivElement;
	const header = document.getElementById('editor-page-header') as HTMLHeadingElement;
	document.querySelectorAll('.box').forEach((box) => {
		(box as HTMLDivElement).style.height = container.clientHeight - header.clientHeight + 'px';
	});
}
updateBoxHeights();
window.addEventListener('resize', updateBoxHeights);

const fixedHeightEditor = EditorView.theme({
	'&': { height: '300px' },
	'.cm-scroller': { overflow: 'auto' },
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
	depth: number;
}

interface DisplayedWorkspace extends DisplayedWSDir {
	idCounter: number;
}

const editorExtensions = [
	lineNumbers(),
	highlightActiveLineGutter(),
	highlightSpecialChars(),
	history(),
	foldGutter(),
	drawSelection(),
	dropCursor(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
	bracketMatching(),
	closeBrackets(),
	autocompletion(),
	rectangularSelection(),
	crosshairCursor(),
	highlightActiveLine(),
	highlightSelectionMatches(),
	EditorView.lineWrapping,
	fixedHeightEditor,
	keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap]),
	EditorView.updateListener.of((update) => {
		if (!update.docChanged || !openedFile) return;
		openedFile.isSaved = false;
		openedFile.modifiedContent = update.state.doc.toString();
		openedFile.el?.classList.add('unsaved');
	}),
];

const editorView = new EditorView({
	parent: editorTextArea,
	state: EditorState.create({
		extensions: editorExtensions,
	}),
});

let root: DisplayedWorkspace | null = null;
let openedFile: DisplayedWSFile | null = null;
let workspaceId = localStorage.getItem('workspaceId');

document.addEventListener('keydown', (e) => {
	if (e.ctrlKey && e.key == 's') {
		e.preventDefault();
		saveFile();
	}
});

openFile(null);

function saveFile() {
	if (!openedFile || !openedFile.modifiedContent) return;
	const state = editorView.state;
	fetch('/workspace/file/' + workspaceId + '/' + openedFile._id, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text: utf8_to_b64(openedFile.modifiedContent) }),
	})
		.then((res) => res.json())
		.then((res) => {
			console.log({ res });
			if (res.success && openedFile) {
				openedFile.content = openedFile.modifiedContent ?? '';
				openedFile.modifiedContent = null;
				openedFile.isSaved = true;
				openedFile.el?.classList.remove('unsaved');
			}
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
				dirs: [],
				files: [],
				idCounter: (res.root as Workspace).idCounter,
				isOpen: true,
				el: null,
				icon: null,
				depth: 0,
			};
			root.dirs = (res.root as WSDir).dirs.map((d, i) => addDirEl(root!, -1, d, 0));
			root.files = (res.root as WSDir).files.map((f, i) => addFileEl(root!, -1, f, 0));
			fileExplorerHeader.innerText = root.name;
			newFileIcon.addEventListener('click', (ev) => newFile(root!));
			newFolderIcon.addEventListener('click', (ev) => newFolder(root!));
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
	openedFile = file;
	if (file === null) {
		// TODO: Maybe hide editor?
		editorView.setState(EditorState.create({ doc: '' }));
		editorHeader.innerText = 'No File opened';
	} else if (!file.isTextfile) {
		// TODO: Error handling
		editorHeader.innerText = file.name;
		console.log('You can only open text files');
		return;
	} else {
		let fileExt = '';
		let idx = file.name.lastIndexOf('.');
		if (idx >= 0) fileExt = file.name.substring(idx + 1);

		editorHeader.innerText = file.name;
		let exts = editorExtensions;
		let langExt = getLangExtension(fileExt);
		if (langExt) exts = [exts, langExt];
		editorView.setState(EditorState.create({ doc: file.content as string, extensions: exts }));
	}
	editorView.focus();
}

const FILE_EXPLORER_DEPTH_PAD = 10;

type FileExplorEl = {
	outer: HTMLDivElement;
	innerRight: HTMLDivElement;
	icon: HTMLImageElement;
};

function getNewFileExplorerEl<T extends HTMLElement>(iconName: string, depth: number, offsetFromParent: number, el: T): FileExplorEl {
	const outer = document.createElement('div');
	outer.classList.add('file-explorer-container');

	const innerLeft = document.createElement('div');
	innerLeft.classList.add('file-explorer-inner-left');
	const innerRight = document.createElement('div');
	innerRight.classList.add('file-explorer-inner-right');

	const iconEl = document.createElement('img');
	iconEl.classList.add('icon');
	iconEl.src = '/public/icons/' + iconName;
	el.classList.add('file-explorer-el-name');

	innerLeft.appendChild(iconEl);
	innerLeft.appendChild(el);
	innerLeft.style.position = 'absolute';
	innerLeft.style.left = depth * FILE_EXPLORER_DEPTH_PAD + 'px';
	outer.appendChild(innerLeft);
	outer.appendChild(innerRight);

	fileExplorerEl.insertBefore(outer, fileExplorerEl.childNodes[offsetFromParent]);
	return { outer, innerRight, icon: iconEl };
}

function addFileEl(parent: DisplayedWSDir, offsetFromParent: number, file: WSFile, depth: number): DisplayedWSFile {
	const fileNameEl = document.createElement('p');
	fileNameEl.classList.add('file-name');
	fileNameEl.innerText = file.name;
	const { outer } = getNewFileExplorerEl((file.isTextfile ? 'text' : 'binary') + '-file.png', depth, offsetFromParent, fileNameEl);

	const displayedFile: DisplayedWSFile = {
		_id: file._id,
		name: file.name,
		content: file.isTextfile ? b64_to_utf8(file.content as string) : '',
		isTextfile: file.isTextfile,
		el: outer,
		isSaved: true,
		modifiedContent: null,
	};
	outer.classList.add('file-explorer-clickable');
	outer.addEventListener('click', (e) => openFile(displayedFile));

	return displayedFile;
}

function addDirEl(parent: DisplayedWSDir, offsetFromParent: number, dir: WSDir, depth: number): DisplayedWSDir {
	const folderNameEl = document.createElement('p');
	folderNameEl.classList.add('folder-name');
	folderNameEl.innerText = dir.name;
	const { outer, innerRight, icon } = getNewFileExplorerEl('open-folder.png', depth, offsetFromParent, folderNameEl);

	outer.classList.add('file-explorer-clickable');
	const dirs = dir.dirs.map((d, i) => addDirEl(parent, i, d, depth + 1));
	const files = dir.files.map((f, i) => addFileEl(parent, dirs.length + i, f, depth + 1));
	const displayedFolder: DisplayedWSDir = {
		_id: dir._id,
		name: dir.name,
		isOpen: true,
		el: outer,
		icon,
		dirs,
		files,
		depth,
	};
	outer.addEventListener('click', (e) => toggleFolder(displayedFolder));

	const addFileIcon = document.createElement('img');
	addFileIcon.src = '/public/icons/new-file.png';
	addFileIcon.classList.add('icon', 'clickable');
	addFileIcon.addEventListener('click', (ev) => {
		ev.stopPropagation();
		newFile(displayedFolder);
	});
	innerRight.insertAdjacentElement('beforeend', addFileIcon);

	const addFolderIcon = document.createElement('img');
	addFolderIcon.src = '/public/icons/new-folder.png';
	addFolderIcon.classList.add('icon', 'clickable');
	addFolderIcon.addEventListener('click', (ev) => {
		ev.stopPropagation();
		newFolder(displayedFolder);
	});
	innerRight.insertAdjacentElement('beforeend', addFolderIcon);

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

function addNew<T extends WSElement>(parent: DisplayedWSDir, offsetFromParent: number, iconName: string, isFile: boolean, onChange: (el: HTMLInputElement, wsEl: T) => void) {
	console.log({ parent, offsetFromParent });

	const newElInput = document.createElement('input');
	newElInput.setAttribute('type', 'text');
	newElInput.classList.add('new-file-explorer-el-input');
	const { outer } = getNewFileExplorerEl(iconName, parent.depth + 1, offsetFromParent, newElInput);

	const changed = () => {
		if (!isValidName(parent, newElInput.value)) {
			// TODO:
			console.log('Name already taken');
			outer.remove();
			return;
		} else {
			newElInput.disabled = true;
			let url = '/workspace/' + (isFile ? 'file' : 'dir') + `/${workspaceId}/${parent._id}`;
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: newElInput.value }),
			})
				.then((res) => res.json() as Promise<ResCreateDir | ResCreateFile>)
				.then((res) => {
					outer.remove();
					if (!res.success) {
						// TODO: Error Handling
						console.log({ res });
						return;
					}
					onChange(newElInput, res.el as unknown as T);
				});
		}
	};
	newElInput.focus();
	newElInput.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') outer.remove();
		else if (e.key === 'Enter') changed();
	});
	newElInput.addEventListener('focusout', (e) => outer.remove());
	newElInput.addEventListener('change', changed);
}

function newFile(parent: DisplayedWSDir) {
	console.log({ parent, idx: idxOfDir(root!, parent._id) });
	addNew(parent, idxOfDir(root!, parent._id) + 1 + parent.dirs.length, 'text-file.png', true, (el, file) => {
		addFileEl(parent, idxOfDir(root!, parent._id) + 1 + parent.dirs.length, file as WSFile, parent.depth + 1);
	});
}

function newFolder(parent: DisplayedWSDir) {
	addNew(parent, idxOfDir(root!, parent._id) + 1, 'open-folder.png', false, (el, folder) => {
		addDirEl(parent, idxOfDir(root!, parent._id) + 1, folder as WSDir, parent.depth + 1);
	});
}
