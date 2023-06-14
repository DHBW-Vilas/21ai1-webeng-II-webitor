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
import { isValidName } from '../util/workspace';
import { ResCreateDir, ResCreateFile } from '../util/endpoints';

const fileExplorerEl = document.getElementById('file-explorer') as HTMLDivElement;
const fileExplorerHeader = document.getElementById('file-explorer-header') as HTMLHeadingElement;
const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
const editorTextArea = document.getElementById('editor') as HTMLTextAreaElement;
const editorHeader = document.getElementById('editor-header') as HTMLHeadingElement;
const newFileIcon = document.getElementById('new-file-icon') as HTMLImageElement;
const newFolderIcon = document.getElementById('new-folder-icon') as HTMLImageElement;

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
				dirs: (res.root as WSDir).dirs.map((d) => addDirEl(fileExplorerEl, d, 0)),
				files: (res.root as WSDir).files.map((f) => addFileEl(fileExplorerEl, f, 0)),
				idCounter: (res.root as Workspace).idCounter,
				isOpen: true,
				el: null,
				icon: null,
				depth: 0,
			};
			fileExplorerHeader.innerText = root.name;
			newFileIcon.addEventListener('click', (ev) => newFile(fileExplorerEl, root!));
			newFolderIcon.addEventListener('click', (ev) => newFolder(fileExplorerEl, root!));
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
}

const FILE_EXPLORER_DEPTH_PAD = 10;

type AddFileExplorerElRes<T extends HTMLElement, S> = {
	container: HTMLDivElement;
	icon: HTMLImageElement;
	el: T;
	state: S | undefined;
};

function addFileExplorerEl<T extends HTMLElement, S>(
	parent: HTMLDivElement,
	iconName: string,
	depth: number,
	makeEl: () => T,
	makeState: ((res: AddFileExplorerElRes<T, S>) => S | undefined) | undefined = undefined,
	makeOuterEls: ((state: S | undefined) => HTMLElement[]) | undefined = undefined
): AddFileExplorerElRes<T, S> {
	if (!makeOuterEls) makeOuterEls = () => [];
	if (!makeState) makeState = () => undefined;
	const outer = document.createElement('div');
	outer.classList.add('file-explorer-container');

	const innerLeft = document.createElement('div');
	innerLeft.classList.add('file-explorer-inner-left');
	const innerRight = document.createElement('div');
	innerRight.classList.add('file-explorer-inner-right');

	const iconEl = document.createElement('img');
	iconEl.classList.add('icon');
	iconEl.src = '/public/icons/' + iconName;
	const el = makeEl();
	el.classList.add('file-explorer-el-name');

	innerLeft.appendChild(iconEl);
	innerLeft.appendChild(el);
	innerLeft.style.position = 'absolute';
	innerLeft.style.left = depth * FILE_EXPLORER_DEPTH_PAD + 'px';
	outer.appendChild(innerLeft);
	outer.appendChild(innerRight);
	parent.appendChild(outer);

	const res: AddFileExplorerElRes<T, S> = { container: outer, icon: iconEl, el, state: undefined };
	res.state = makeState(res);
	for (let x of makeOuterEls(res.state)) innerRight.appendChild(x);

	return res;
}

function addFileEl(parent: HTMLDivElement, file: WSFile, depth: number): DisplayedWSFile {
	return addFileExplorerEl(
		parent,
		(file.isTextfile ? 'text' : 'binary') + '-file.png',
		depth,
		() => {
			const fileName = document.createElement('p');
			fileName.classList.add('file-name');
			fileName.innerText = file.name;
			return fileName;
		},
		({ container }) => {
			container.classList.add('file-explorer-clickable');
			const displayedFile: DisplayedWSFile = {
				_id: file._id,
				name: file.name,
				content: file.isTextfile ? b64_to_utf8(file.content as string) : '',
				isTextfile: file.isTextfile,
				el: container,
				isSaved: true,
				modifiedContent: null,
			};
			container.addEventListener('click', (e) => openFile(displayedFile));
			return displayedFile;
		},
		(state: DisplayedWSFile | undefined) => {
			// TODO
			return [];
		}
	).state as DisplayedWSFile;
}

function addDirEl(parent: HTMLDivElement, dir: WSDir, depth: number): DisplayedWSDir {
	return addFileExplorerEl(
		parent,
		'open-folder.png',
		depth,
		() => {
			const folderName = document.createElement('p');
			folderName.classList.add('folder-name');
			folderName.innerText = dir.name;
			return folderName;
		},
		({ container, icon }) => {
			container.classList.add('file-explorer-clickable');
			const dirs = dir.dirs.map((d) => addDirEl(parent, d, depth + 1));
			const files = dir.files.map((f) => addFileEl(parent, f, depth + 1));
			const displayedFolder: DisplayedWSDir = {
				_id: dir._id,
				name: dir.name,
				isOpen: true,
				el: container,
				icon: icon,
				dirs,
				files,
				depth,
			};
			container.addEventListener('click', (e) => toggleFolder(displayedFolder));
			return displayedFolder;
		},
		(state: DisplayedWSDir | undefined) => {
			if (!state) return []; // Should be unreachable
			const addFileIcon = document.createElement('img');
			addFileIcon.src = '/public/icons/new-file.png';
			addFileIcon.classList.add('icon', 'clickable');
			addFileIcon.addEventListener('click', (ev) => {
				ev.stopPropagation();
				newFile(parent, state);
			});

			const addFolderIcon = document.createElement('img');
			addFolderIcon.src = '/public/icons/new-folder.png';
			addFolderIcon.classList.add('icon', 'clickable');
			addFolderIcon.addEventListener('click', (ev) => {
				ev.stopPropagation();
				newFolder(parent, state);
			});

			return [addFileIcon, addFolderIcon];
		}
	).state as DisplayedWSDir;
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

function addNew<T extends WSElement>(parent: HTMLDivElement, parentDir: DisplayedWSDir, iconName: string, isFile: boolean, onChange: (el: HTMLInputElement, wsEl: T) => void) {
	const { container, el } = addFileExplorerEl(parent, iconName, parentDir.depth + 1, () => {
		const t = document.createElement('input');
		t.setAttribute('type', 'text');
		t.classList.add('new-file-explorer-el-input');
		return t;
	});
	el.focus();
	el.addEventListener('change', (e) => {
		if (!isValidName(parentDir, el.value)) {
			// TODO:
			console.log('Name already taken');
			return;
		} else {
			el.disabled = true;
			let url = '/workspace/' + (isFile ? 'file' : 'dir') + `/${workspaceId}/${parentDir._id}`;
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: el.value }),
			})
				.then((res) => res.json() as Promise<ResCreateDir | ResCreateFile>)
				.then((res) => {
					container.remove();
					if (!res.success) {
						// TODO: Error Handling
						console.log({ res });
						return;
					}
					localStorage.setItem('workspaceId', res.workspaceId);
					onChange(el, res.el as unknown as T);
				});
		}
	});
}

// @Cleanup newFile and newFolder can be factored into a single function
function newFile(parent: HTMLDivElement, parentDir: DisplayedWSDir) {
	addNew(parent, parentDir, 'text-file.png', true, (el, file) => {
		const displayedFile = addFileEl(parent, file as WSFile, parentDir.depth + 1);
		parentDir.files.push(displayedFile);
	});
}

function newFolder(parent: HTMLDivElement, parentDir: DisplayedWSDir) {
	addNew(parent, parentDir, 'open-folder.png', false, (el, folder) => {
		const displayedFolder = addDirEl(parent, folder as WSDir, parentDir.depth + 1);
		parentDir.dirs.push(displayedFolder);
	});
}
