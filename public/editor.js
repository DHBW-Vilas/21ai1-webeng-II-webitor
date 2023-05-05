const fileExplorerEl = document.getElementById('fileExplorer');

const myEditor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'javascript',
	//theme: "monokai"
});

saveBtn.addEventListener('click', saveFile);

document.addEventListener('keyup', (e) => {
	if (e.key === 's' && e.ctrlKey) {
		saveFile();
	}
});

function saveFile() {
	fetch('/');
}

const workspaceId = localStorage.getItem('workspaceId');
if (workspaceId === null) {
	// TODO: Error Handling
}
fetch('/workspace/' + workspaceId)
	.then((res) => res.json())
	.then((res) => {
		const root = res.root;
		createDirEl(fileExplorerEl, root);
	})
	.catch((err) => {
		// TODO: Error Handling
	});

function openFile(file) {
	tabName = file.name;
	myEditor.content = file.content;
}

function createFileEl(parent, file) {
	const div = document.createElement('div');
	div.classList.add('file-explorer-el', 'file-el');
	div.innerText = file.name;
	div.addEventListener('click', (e) => openFile(file));
	parent.insertAdjacentElement('beforeend', div);
}

function toggleDirEl(dirEl) {
	// TODO: isOpen is not implemented
	if (isOpen) {
		dirEl.childNodes.forEach((c) => c.remove());
	} else {
		dirEl.dirs.forEach((dir) => createDirEl(dirEl, dir));
		dirEl.files.forEach((file) => createFileEl(dirEl, file));
	}
}

function createDirEl(parent, dir) {
	const div = document.createElement('div');
	div.innerText = dir.name;
	dir.addEventListener('click', (e) => toggleDirEl(div));
	parent.insertAdjacentElement('beforeend', div);
}

const fileExplorer = document.getElementById('file-explorer');
fileExplorer.addEventListener('click', function (e) {
	if (e.target.nodeName === 'LI') {
		let fileName = e.target.textContent;
		let fileContents = getFileContents(fileName);
		myEditor.setValue(fileContents);
	}
});

function getFileContents(fileName) {
	// make an AJAX call or fetch request to the server to load the file contents
}
