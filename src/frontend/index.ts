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
				const workspaceEl = document.createElement('div');
				workspaceEl.innerText = workspace.name;
				workspaceEl.addEventListener('click', (ev) => openWorkspace(workspace._id as string));
				workspaceParentDiv.insertAdjacentElement('beforeend', workspaceEl);
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

// const dropArea = document.getElementById('drop-area');

// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
// 	dropArea.addEventListener(eventName, preventDefaults, false);
// });

// function preventDefaults(e) {
// 	e.preventDefault();
// 	e.stopPropagation();
// }

// ['dragenter', 'dragover'].forEach((eventName) => {
// 	dropArea.addEventListener(eventName, highlight, false);
// });

// ['dragleave', 'drop'].forEach((eventName) => {
// 	dropArea.addEventListener(eventName, unhighlight, false);
// });

// function highlight(e) {
// 	dropArea.classList.add('highlight');
// }

// function unhighlight(e) {
// 	dropArea.classList.remove('highlight');
// }

// dropArea.addEventListener('drop', handleDrop, false);

// function handleDrop(e) {
// 	const dt = e.dataTransfer;
// 	const files = dt.files;
// 	console.log({ files });
// 	document.getElementById('fileInput').files = files;
// 	const formData = new FormData();
// 	for (let i = 0; i < files.length; i++) {
// 		formData.append('files[]', files[i]);
// 	}
// 	const xhr = new XMLHttpRequest();
// 	xhr.open('POST', '/upload');
// 	xhr.send(formData);
// }
