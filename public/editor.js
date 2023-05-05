const fileExplorerEl = document.getElementById('file-explorer');

const myEditor = CodeMirror.fromTextArea(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'javascript',
	//theme: "monokai"
});

// saveBtn.addEventListener('click', saveFile);

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
		console.log({ root });
		addDirEl(fileExplorerEl, root);
	})
	.catch((err) => {
		// TODO: Error Handling
	});

function openFile(file) {
	tabName = file.name;
	myEditor.content = file.content;
}

function addFileEl(parent, file) {
	const div = document.createElement('div');
	div.classList.add('file-explorer-el', 'file-el');
	div.innerText = file.name;
	// div.addEventListener('click', (e) => openFile(file));
	parent.insertAdjacentElement('beforeend', div);
}

function toggleDirEl(dirEl) {
	// TODO: isOpen is not implemented
	if (isOpen) {
		dirEl.childNodes.forEach((c) => c.remove());
	} else {
		dirEl.dirs.forEach((dir) => addDirEl(dirEl, dir));
		dirEl.files.forEach((file) => addFileEl(dirEl, file));
	}
}

function addDirEl(parent, dir) {
	const div = document.createElement('div');
	div.innerText = dir.name;
	// div.addEventListener('click', (e) => toggleDirEl(div));
	dir.dirs.forEach((d) => addDirEl(div, d));
	dir.files.forEach((f) => addFileEl(div, f));
	parent.insertAdjacentElement('beforeend', div);
}
