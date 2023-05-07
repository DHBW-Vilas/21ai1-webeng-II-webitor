function switchStyle(mode) {
	var body = document.body;
	body.classList.remove("default", "light", "contrast", "spooky");
	body.classList.add(mode);
  }