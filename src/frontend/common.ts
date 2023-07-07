import { WSId } from '../models';
import { Res } from '../util/endpoints';

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

export async function downloadWorkspace(workspaceId: string) {
	const anchor = document.createElement('a');
	anchor.href = '/download/' + workspaceId;
	anchor.target = '_blank';
	anchor.click();
	anchor.remove();
}

// Returns the nameEl
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
	addRenamableWorkspaceEls,
	downloadWorkspace,
	errorPopUp,
};
