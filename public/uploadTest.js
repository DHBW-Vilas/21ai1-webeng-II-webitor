const nameInput = document.getElementById('name-input');
const fileInput = document.getElementById('file-input');
const dropzone = document.getElementById('dropzone');

fileInput.addEventListener('change', handleFiles, false);

function handleFiles() {
	// TODO: Error Handling
	if (!nameInput.value) return;

	let projectName = nameInput.value;

	const fd = new FormData();
	const files = Array.from(this.files);
	files.forEach((file) => {
		const FR = new FileReader();
		FR.addEventListener('load', () => console.log(FR.result));
		FR.readAsText(file);
		fd.append('file', file, file.webkitRelativePath);
	});

	fetch('/new/' + projectName, {
		method: 'POST',
		body: fd,
	})
		.then((res) => res.json())
		.then((res) => console.log(res));
}
