const styles: {
	[index: string]: string;
} = {
	light: 'Light Mode',
	dark: 'Dark Mode',
	contrast: 'High Contrast Mode',
	spooky: 'Spooky Mode',
};

// Load cached style preference
export function loadStyleFromCache() {
	let styleMode = localStorage.getItem('style');
	if (styleMode) switchStyle(styleMode);
}

export function insertStyleSelector(pos: InsertPosition, el: HTMLElement) {
	const styleSelector = document.createElement('select');
	styleSelector.addEventListener('change', (ev) => {
		switchStyle(styleSelector.value);
	});

	for (const key in styles) {
		const opt = document.createElement('option');
		opt.value = key;
		opt.innerText = styles[key];
		styleSelector.appendChild(opt);
	}

	const selected = localStorage.getItem('style');
	if (selected) styleSelector.value = selected;

	el.insertAdjacentElement(pos, styleSelector);
}

export function switchStyle(mode: string) {
	document.body.classList.remove('light', 'dark', 'contrast', 'spooky');
	document.body.classList.add(mode);
	localStorage.setItem('style', mode); // Store style preference in cache
}

export default {
	loadStyleFromCache,
	insertStyleSelector,
	switchStyle,
};
