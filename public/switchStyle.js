let styleMode = localStorage.getItem('style');
if (styleMode) switchStyle(styleMode);

function switchStyle(mode) {
	document.body.classList.remove('default', 'light', 'contrast', 'spooky');
	document.body.classList.add(mode);
	localStorage.setItem('style', mode);
}
