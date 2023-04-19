const inputEl = document.getElementById('input');
const dropzone = document.getElementById('dropzone');

inputEl.addEventListener('change', handleFiles, false);

function handleFiles() {
	const files = Array.from(this.files);
	files.forEach((file) => {
		const FR = new FileReader();
		FR.addEventListener('load', () => console.log(FR.result));
		FR.readAsText(file);
	});
}
