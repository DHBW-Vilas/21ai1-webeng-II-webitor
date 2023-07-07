import { Workspace } from '../models';
import { Res, ResCreateWorkspace, ResGetWorkspaces } from '../util/endpoints';
import { addRenamableWorkspaceEls, downloadWorkspace, errorPopUp } from './common';
import { langs } from './lang';
import { insertStyleSelector, loadStyleFromCache } from './switchStyle';

loadStyleFromCache();
insertStyleSelector('beforebegin', document.querySelector('.post-description') as HTMLElement).classList.add('centered-horizontal');

const workspaceParentDiv = document.getElementById('workspaces') as HTMLDivElement;
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const createWSName = document.getElementById('newWSName') as HTMLInputElement;
const createWSBtn = document.getElementById('newWSBtn') as HTMLButtonElement;
const uploadWSName = document.getElementById('uploadWSName') as HTMLInputElement;
const uploadWSBtn = document.getElementById('uploadWSBtn') as HTMLButtonElement;
const createWSBox = document.getElementById('ws-create-box') as HTMLDivElement;
const uploadWSBox = document.getElementById('ws-upload-box') as HTMLDivElement;

// Set up language drop-down menu
const langSelect = document.getElementById('langMenu') as HTMLSelectElement;
{
	const noneOpt = document.createElement('option');
	noneOpt.value = 'empty';
	noneOpt.text = 'Empty';
	langSelect.appendChild(noneOpt);
	langs.forEach((l) => {
		if (l.helloWorld !== null) {
			const opt = document.createElement('option');
			opt.value = l.fileExtensions[0];
			opt.text = l.name;
			langSelect.appendChild(opt);
		}
	});
}

fetch('/workspaces')
	.then((res) => res.json() as Promise<ResGetWorkspaces>)
	.then((res) => {
		if (res.success) {
			(res.workspaces as Workspace[]).forEach((workspace) => {
				const workspaceContainerEl = document.createElement('div');
				workspaceContainerEl.classList.add('name-icon-container');

				const nameEl = addRenamableWorkspaceEls(workspace.name, workspace._id, null, workspaceContainerEl, workspaceContainerEl, 'beforeend');
				nameEl.classList.add('clickable');

				const workspaceDownloadIcon = document.createElement('img');
				workspaceDownloadIcon.src = '/public/icons/download.png';
				workspaceDownloadIcon.classList.add('icon', 'clickable');
				workspaceDownloadIcon.addEventListener('click', (ev) => {
					ev.stopPropagation();
					downloadWorkspace(String(workspace._id));
				});
				workspaceContainerEl.appendChild(workspaceDownloadIcon);

				const workspaceRmIcon = document.createElement('img');
				workspaceRmIcon.src = '/public/icons/delete.png';
				workspaceRmIcon.classList.add('icon', 'clickable');
				workspaceRmIcon.addEventListener('click', (ev) => {
					ev.stopPropagation();
					fetch(`/workspace/${workspace._id}`, { method: 'DELETE' })
						.then((res) => res.json() as Promise<Res>)
						.then((res) => {
							if (!res.success) {
								errorPopUp(res.err!);
							} else {
								workspaceContainerEl.remove();
							}
						});
				});
				workspaceContainerEl.appendChild(workspaceRmIcon);

				workspaceContainerEl.addEventListener('click', (ev) => openWorkspace(workspace._id as string));
				workspaceParentDiv.insertAdjacentElement('beforeend', workspaceContainerEl);
			});
		}
	});

function openWorkspace(workspaceId: string) {
	localStorage.setItem('workspaceId', workspaceId);
	window.location.href = '/editor';
}

let pendingReq = false;

uploadWSBtn.addEventListener('click', uploadWS);
createWSBtn.addEventListener('click', createWS);

function uploadWS() {
	const name = uploadWSName.value;
	const files = Array.from(fileInput.files ?? []);
	if (!name) {
		errorPopUp("You need to provide a name for the workspace you're uploading.", uploadWSBox);
	} else if (!files) {
		errorPopUp('You need to select a folder from your local machine to upload the workspace.', uploadWSBox);
	} else {
		const fd = new FormData();
		files.forEach((file) => fd.append('file', file, file.webkitRelativePath));
		pendingReq = true;
		fetch('/upload/' + name, {
			method: 'POST',
			body: fd,
		})
			.then((res) => res.json())
			.then((res) => newWSResHandler(res, uploadWSBox));
	}
}

function createWS() {
	const name = createWSName.value;
	if (!name) {
		errorPopUp("You need to provide a name for the new workspace you're creating", createWSBox);
	} else {
		pendingReq = true;
		fetch('/create/' + name + '/' + langSelect.value, {
			method: 'POST',
		})
			.then((res) => res.json() as Promise<ResCreateWorkspace>)
			.then((res) => newWSResHandler(res, createWSBox));
	}
}

function newWSResHandler(res: ResCreateWorkspace, parentEl: HTMLDivElement) {
	pendingReq = false;
	if (!res.success) {
		console.log(parentEl);
		errorPopUp([res.err!, 'Reload the page and try again'], parentEl);
	} else {
		const workspaceId = res.workspaceId;
		localStorage.setItem('workspaceId', workspaceId);
		window.location.href = '/editor';
	}
}
