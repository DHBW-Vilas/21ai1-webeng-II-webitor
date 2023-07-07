import { WSId } from '../models';
import { Res } from '../util/endpoints';

const styles: {
	[index: string]: string;
} = {
	light: 'Light Mode',
	dark: 'Dark Mode',
	contrast: 'High Contrast Mode',
	spooky: 'Spooky Mode',
};

// Check whether the user is logged in
export function isLoggedIn(): boolean {
	return document.cookie.split(';').some((cookie) => cookie.includes('anon=false'));
}

// Inserts a button, that either lets the user login or logout,
// depending on whether they already are logged in.
// The button will be inserted relative to `el`
export function insertLoginBtn(pos: InsertPosition, el: HTMLElement): HTMLButtonElement {
	const btn = document.createElement('button');
	if (isLoggedIn()) {
		btn.innerText = 'Sign out';
		btn.addEventListener('click', () => {
			document.cookie = 'auth=;expires=Thu, 01 Jan 1970 00:00:01 GMT'; // Clear auth cookie
		});
	} else {
		btn.innerText = 'Sign Up/In';
	}
	btn.addEventListener('click', () => (window.location.href = '/login'));

	el.insertAdjacentElement(pos, btn);
	return btn;
}

// Load cached style preference
export function loadStyleFromCache() {
	let styleMode = localStorage.getItem('style');
	if (styleMode) switchStyle(styleMode);
}

// Insert the drop-down-menu for selecting the style (light/dark/etc)
// The select-element will be inserted relative to `el`.
export function insertStyleSelector(pos: InsertPosition, el: HTMLElement): HTMLSelectElement {
	const styleSelector = document.createElement('select');
	styleSelector.addEventListener('change', (ev) => {
		switchStyle(styleSelector.value);
	});

	for (const key in styles) {
		const opt = document.createElement('option');
		opt.value = key;
		opt.innerText = styles[key];
		styleSelector.appendChild(opt);
	}

	const selected = localStorage.getItem('style');
	if (selected) styleSelector.value = selected;

	el.insertAdjacentElement(pos, styleSelector);
	return styleSelector;
}

// Switch style (e.g. to dark-mode)
export function switchStyle(mode: string) {
	document.body.classList.remove('light', 'dark', 'contrast', 'spooky');
	document.body.classList.add(mode);
	localStorage.setItem('style', mode); // Store style preference in cache
}

// Show the Error Message to the user via a popup
export function errorPopUp(msgs: string | string[], parentEl: HTMLElement = document.body) {
	const popUp = document.createElement('div');
	popUp.classList.add('error-popup', 'centered');

	const msgContainer = document.createElement('div');
	msgContainer.classList.add('error-popup-msg');

	if (!Array.isArray(msgs)) msgs = [msgs];
	for (const msg of msgs) {
		const msgEl = document.createElement('p');
		msgEl.innerText = msg;
		msgContainer.appendChild(msgEl);
	}

	const closeIcon = document.createElement('img');
	closeIcon.src = '/public/icons/close.png';
	closeIcon.classList.add('icon', 'clickable', 'close-icon');
	closeIcon.addEventListener('click', (ev) => popUp.remove());

	window.addEventListener('keypress', (ev) => {
		console.log(ev.key);

		if (ev.key == 'Escape') popUp.remove();
	});
	popUp.appendChild(msgContainer);
	popUp.appendChild(closeIcon);
	console.log(parentEl);

	parentEl.appendChild(popUp);
}

// Download the workspace
export async function downloadWorkspace(workspaceId: string) {
	const anchor = document.createElement('a');
	anchor.href = '/download/' + workspaceId;
	anchor.target = '_blank';
	anchor.click();
	anchor.remove();
}

// Add the elements for making the workspace name-element renamable
// Returns the name-element
export function addRenamableWorkspaceEls(
	workspaceName: string,
	workspaceId: WSId,
	nameEl: null | HTMLElement,
	nameContainer: HTMLDivElement,
	iconContainer: HTMLDivElement,
	iconPos: InsertPosition,
	...inputElClasses: string[]
): HTMLElement {
	if (nameEl === null) {
		nameEl = document.createElement('p');
		nameContainer.appendChild(nameEl);
	}
	nameEl!.innerText = workspaceName;
	nameEl!.classList.add('workspace-name');

	const workspaceInputEl = document.createElement('input');
	workspaceInputEl.classList.add('workspace-name', ...inputElClasses);
	const renameWorkspace = (fail: boolean = false) => {
		const newName = workspaceInputEl.value.trim();
		if (fail || !newName) {
			workspaceInputEl.value = '';
			workspaceInputEl.classList.add('hidden');
			nameEl!.classList.remove('hidden');
		} else {
			fetch(`/rename/${workspaceId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newName }),
			})
				.then((res) => res.json() as Promise<Res>)
				.then((res) => {
					if (!res.success) {
						errorPopUp(res.err!);
					} else {
						nameEl!.innerText = newName;
					}
					renameWorkspace(true); // To remove input element again
				});
		}
	};
	workspaceInputEl.type = 'text';
	workspaceInputEl.classList.add('hidden');
	workspaceInputEl.addEventListener('click', (ev) => {
		ev.stopPropagation();
	});
	workspaceInputEl.addEventListener('focusout', (ev) => renameWorkspace());
	workspaceInputEl.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') renameWorkspace(true);
		if (e.key === 'Enter') renameWorkspace();
	});
	nameContainer.appendChild(workspaceInputEl);

	const workspaceRenameIcon = document.createElement('img');
	workspaceRenameIcon.src = '/public/icons/rename.png';
	workspaceRenameIcon.classList.add('icon', 'clickable');
	workspaceRenameIcon.addEventListener('click', (ev) => {
		ev.stopPropagation();
		nameEl!.classList.add('hidden');
		workspaceInputEl.classList.remove('hidden');
		workspaceInputEl.focus();
	});
	iconContainer.insertAdjacentElement(iconPos, workspaceRenameIcon);

	return nameEl;
}

export default {
	isLoggedIn,
	insertLoginBtn,
	loadStyleFromCache,
	insertStyleSelector,
	switchStyle,
	addRenamableWorkspaceEls,
	downloadWorkspace,
	errorPopUp,
};
