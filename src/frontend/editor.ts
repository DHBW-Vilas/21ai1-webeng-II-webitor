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
import { WSDir, WSElement, WSFile, WSId, Workspace } from '../models';
import { idxOfDir, isValidName } from '../util/workspace';
import { Res, ResCreateDir, ResCreateFile } from '../util/endpoints';

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
	innerChildren: HTMLDivElement;
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
				innerChildren: fileExplorerEl,
				el: null,
				icon: null,
				depth: 0,
			};
			root.dirs = (res.root as WSDir).dirs.map((d, i) => addDirEl(root!, d, 0));
			root.files = (res.root as WSDir).files.map((f, i) => addFileEl(root!, f, 0));
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
	innerChildren: HTMLDivElement;
	icon: HTMLImageElement;
};

function addFileExplorerEl<T extends HTMLElement>(id: string, iconName: string, depth: number, el: T, parent: DisplayedWSDir, isFile: boolean, isClickable: boolean): FileExplorEl {
	const outer = document.createElement('div');
	if (id) outer.setAttribute('data-id', id);

	const innerContainer = document.createElement('div');
	innerContainer.classList.add('file-explorer-container');
	outer.appendChild(innerContainer);
	if (isClickable) innerContainer.classList.add('file-explorer-clickable');

	const innerLeft = document.createElement('div');
	innerLeft.classList.add('file-explorer-inner-left');
	innerContainer.appendChild(innerLeft);

	const innerRight = document.createElement('div');
	innerRight.classList.add('file-explorer-inner-right');
	innerContainer.appendChild(innerRight);

	const innerChildren = document.createElement('div');
	innerChildren.classList.add('file-explorer-inner-children');
	outer.appendChild(innerChildren);

	const iconEl = document.createElement('img');
	iconEl.classList.add('icon');
	iconEl.src = '/public/icons/' + iconName;
	el.classList.add('file-explorer-el-name');

	innerLeft.appendChild(iconEl);
	innerLeft.appendChild(el);
	innerLeft.style.position = 'absolute';
	innerLeft.style.left = depth * FILE_EXPLORER_DEPTH_PAD + 'px';

	if (isFile || !parent.files.length) {
		parent.innerChildren.insertAdjacentElement('beforeend', outer);
	} else {
		parent.files[0].el?.insertAdjacentElement('beforebegin', outer);
	}
	return { outer, innerRight, innerChildren, icon: iconEl };
}

function addClickableFilExplorerEl(id: WSId, iconName: string, depth: number, name: string, parent: DisplayedWSDir, isFile: boolean, onRmCallback: null | (() => void)): FileExplorEl {
	const nameEl = document.createElement('p');
	nameEl.classList.add((isFile ? 'file' : 'folder') + '-name');
	nameEl.innerText = name;
	const res = addFileExplorerEl(String(id), iconName, depth, nameEl, parent, isFile, true);

	const rmElIcon = document.createElement('img');
	rmElIcon.src = '/public/icons/delete.png';
	rmElIcon.classList.add('icon', 'clickable');
	rmElIcon.addEventListener('click', (ev) => {
		ev.stopPropagation();
		if (onRmCallback) onRmCallback();
		res.outer.remove();
		fetch(`/workspace/${workspaceId}/${id}`, {
			method: 'DELETE',
		})
			.then((res) => res.json() as Promise<Res>)
			.then((res) => {
				if (!res.success) {
					// TODO: Error Handling
					console.log({ res });
				}
			});
	});
	res.innerRight.insertAdjacentElement('beforeend', rmElIcon);

	return res;
}

function addFileEl(parent: DisplayedWSDir, file: WSFile, depth: number): DisplayedWSFile {
	const { outer } = addClickableFilExplorerEl(file._id, (file.isTextfile ? 'text' : 'binary') + '-file.png', depth, file.name, parent, true, null);

	const displayedFile: DisplayedWSFile = {
		_id: file._id,
		name: file.name,
		content: file.isTextfile ? b64_to_utf8(file.content as string) : '',
		isTextfile: file.isTextfile,
		el: outer,
		isSaved: true,
		modifiedContent: null,
	};
	outer.addEventListener('click', (e) => openFile(displayedFile));

	return displayedFile;
}

function addDirEl(parent: DisplayedWSDir, dir: WSDir, depth: number): DisplayedWSDir {
	let displayedFolder: undefined | DisplayedWSDir;
	const { outer, innerRight, innerChildren, icon } = addClickableFilExplorerEl(dir._id, 'open-folder.png', depth, dir.name, parent, false, () => rmFolderElements(displayedFolder!));

	displayedFolder = {
		_id: dir._id,
		name: dir.name,
		isOpen: true,
		el: outer,
		innerChildren,
		icon,
		dirs: [],
		files: [],
		depth,
	};
	displayedFolder.dirs = dir.dirs.map((d) => addDirEl(displayedFolder!, d, depth + 1));
	displayedFolder.files = dir.files.map((f) => addFileEl(displayedFolder!, f, depth + 1));
	outer.addEventListener('click', (ev) => {
		ev.stopPropagation();
		toggleFolder(displayedFolder!);
	});

	const addFolderIcon = document.createElement('img');
	addFolderIcon.src = '/public/icons/new-folder.png';
	addFolderIcon.classList.add('icon', 'clickable');
	addFolderIcon.addEventListener('click', (ev) => {
		ev.stopPropagation();
		if (!displayedFolder!.isOpen) toggleFolder(displayedFolder!);
		newFolder(displayedFolder!);
	});
	innerRight.insertAdjacentElement('afterbegin', addFolderIcon);

	const addFileIcon = document.createElement('img');
	addFileIcon.src = '/public/icons/new-file.png';
	addFileIcon.classList.add('icon', 'clickable');
	addFileIcon.addEventListener('click', (ev) => {
		ev.stopPropagation();
		if (!displayedFolder!.isOpen) toggleFolder(displayedFolder!);
		newFile(displayedFolder!);
	});
	innerRight.insertAdjacentElement('afterbegin', addFileIcon);

	return displayedFolder;
}

function hideFolder(folder: DisplayedWSDir) {
	folder.files.forEach((f) => f.el?.classList.add('hidden'));
	folder.dirs.forEach((d) => {
		d.el?.classList.add('hidden');
		hideFolder(d);
	});
}

function showFolder(folder: DisplayedWSDir) {
	folder.files.forEach((f) => f.el?.classList.remove('hidden'));
	folder.dirs.forEach((d) => {
		d.el?.classList.remove('hidden');
		if (d.isOpen) showFolder(d);
	});
}

function toggleFolder(folder: DisplayedWSDir) {
	if (folder.isOpen) {
		folder.icon!.src = '/public/icons/closed-folder.png';
		hideFolder(folder);
	} else {
		folder.icon!.src = '/public/icons/open-folder.png';
		showFolder(folder);
	}
	folder.isOpen = !folder.isOpen;
}

function addNew<T extends WSElement>(parent: DisplayedWSDir, iconName: string, isFile: boolean, onChange: (el: HTMLInputElement, wsEl: T) => void) {
	const newElInput = document.createElement('input');
	newElInput.setAttribute('type', 'text');
	newElInput.classList.add('new-file-explorer-el-input');
	const { outer } = addFileExplorerEl('', iconName, parent.depth + 1, newElInput, parent, isFile, false);

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
	addNew(parent, 'text-file.png', true, (el, file) => {
		addFileEl(parent, file as WSFile, parent.depth + 1);
	});
}

function newFolder(parent: DisplayedWSDir) {
	addNew(parent, 'open-folder.png', false, (el, folder) => {
		addDirEl(parent, folder as WSDir, parent.depth + 1);
	});
}

function rmFolderElements(folder: DisplayedWSDir) {
	folder.files.forEach((f) => f.el?.remove());
	folder.dirs.forEach((d) => {
		d.el?.remove();
		rmFolderElements(d);
	});
}
