import { Workspace } from '../models';
import { Res, ResCreateWorkspace, ResGetWorkspaces } from '../util/endpoints';
import { langs } from './lang';

const workspaceParentDiv = document.getElementById('workspaces') as HTMLDivElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const createWSName = document.getElementById('newWSName') as HTMLInputElement;
const createWSBtn = document.getElementById('newWSBtn') as HTMLButtonElement;
const uploadWSName = document.getElementById('uploadWSName') as HTMLInputElement;
const uploadWSBtn = document.getElementById('uploadWSBtn') as HTMLButtonElement;
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

				const workspaceNameEl = document.createElement('p');
				workspaceNameEl.innerText = workspace.name;
				workspaceNameEl.classList.add('workspace-name');
				workspaceContainerEl.appendChild(workspaceNameEl);

				const workspaceRmIcon = document.createElement('img');
				workspaceRmIcon.src = '/public/icons/delete.png';
				workspaceRmIcon.classList.add('icon', 'clickable');
				workspaceRmIcon.addEventListener('click', (ev) => {
					ev.stopPropagation();
					fetch(`/workspace/${workspace._id}`, { method: 'DELETE' })
						.then((res) => res.json() as Promise<Res>)
						.then((res) => {
							if (!res.success) {
								// TODO: Error Handling
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
	if (!name || !files) {
		// TODO: Show Error to the user
		console.log('ERROR');
		return;
	}

	const fd = new FormData();
	files.forEach((file) => fd.append('file', file, file.webkitRelativePath));
	pendingReq = true;
	fetch('/upload/' + name, {
		method: 'POST',
		body: fd,
	})
		.then((res) => res.json())
		.then(newWSResHandler);
}

function createWS() {
	const name = createWSName.value;
	if (!name) {
		// TODO: Show Error to the user
		console.log('ERROR');
		return;
	}

	pendingReq = true;
	fetch('/create/' + name + '/' + langSelect.value, {
		method: 'POST',
	})
		.then((res) => res.json() as Promise<ResCreateWorkspace>)
		.then(newWSResHandler);
}

function newWSResHandler(res: ResCreateWorkspace) {
	pendingReq = false;
	// TODO: Error Handling
	if (!res.success) {
		console.log({ res });
		return;
	}
	const workspaceId = res.workspaceId;
	localStorage.setItem('workspaceId', workspaceId);
	window.location.href = '/editor';
}
