/** @type {HTMLDivElement} */
const workspaceParentDiv = document.getElementById('workspaces');
/** @type {HTMLInputElement} */
const fileInput = document.getElementById('fileInput');
/** @type {HTMLInputElement} */
const createWSName = document.getElementById('newWSName');
/** @type {HTMLButtonElement} */
const createWSBtn = document.getElementById('newWSBtn');
/** @type {HTMLInputElement} */
const uploadWSName = document.getElementById('uploadWSName');
/** @type {HTMLButtonElement} */
const uploadWSBtn = document.getElementById('uploadWSBtn');
/** @type {HTMLSelectElement} */
const langSelect = document.getElementById('langMenu');

fetch('/workspaces')
	.then((res) => res.json())
	.then((res) => {
		if (res.success) {
			res.workspaces.forEach((workspace) => {
				const workspaceEl = document.createElement('div');
				workspaceEl.innerText = workspace.name;
				workspaceEl.setAttribute('data-id', workspace._id);
				workspaceEl.addEventListener('click', (ev) => openWorkspace(ev.target.getAttribute('data-id')));
				workspaceParentDiv.insertAdjacentElement('beforeend', workspaceEl);
			});
		}
	});

function openWorkspace(workspaceId) {
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
		.then((res) => res.json())
		.then(newWSResHandler);
}

function newWSResHandler(res) {
	pendingReq = false;
	// TODO: Error Handling
	if (!res.success) {
		console.log({ res });
		return;
	}
	const workspaceId = res.id;
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
