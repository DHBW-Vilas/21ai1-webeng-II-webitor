const workspaceParentDiv = document.getElementById('workspaces');

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

const fileInput = document.getElementById('fileInput');
const nameInput = document.getElementById('name');

fileInput.addEventListener('change', handleFiles, false);

function handleFiles() {
	const fd = new FormData();
	const files = Array.from(this.files);
	files.forEach((file) => {
		const FR = new FileReader();
		FR.addEventListener('load', () => console.log(FR.result));
		FR.readAsText(file);
		fd.append('file', file, file.webkitRelativePath);
	});

	if (!nameInput.value) {
		// TODO: Show the error to the user or maybe use some default name??
		console.log('ERROR: No Workspace name entered');
		return;
	}

	fetch('/new/' + nameInput.value, {
		method: 'POST',
		body: fd,
	})
		.then((res) => res.json())
		.then((res) => {
			// TODO: Check that response is ok && handle errors if necessary
			const workspaceId = res.id;
			localStorage.setItem('workspaceId', workspaceId);
			window.location.href = '/editor';
		});
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
