let styleMode = localStorage.getItem('style');
if (styleMode) switchStyle(styleMode);

function switchStyle(mode) {
	document.body.classList.remove('light', 'dark', 'contrast', 'spooky');
	document.body.classList.add(mode);
	localStorage.setItem('style', mode);
}
