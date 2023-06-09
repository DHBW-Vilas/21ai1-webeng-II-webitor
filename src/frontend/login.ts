import { insertStyleSelector, loadStyleFromCache, errorPopUp } from './common';

loadStyleFromCache();
insertStyleSelector('beforeend', document.querySelector('header') as HTMLElement);

const nameInput = document.getElementById('name-input') as HTMLInputElement;
const passInput = document.getElementById('pass-input') as HTMLInputElement;
const registerBtn = document.getElementById('register-btn') as HTMLButtonElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const loginContainer = document.getElementById('login-container') as HTMLDivElement;

nameInput.focus();

registerBtn.addEventListener('click', () => authenticate(false));
loginBtn.addEventListener('click', () => authenticate(true));

function authenticate(isLogin: boolean) {
	let name = nameInput.value;
	let pass = passInput.value;

	let path = isLogin ? '/login' : '/register';

	if (name && pass) {
		fetch(path, {
			method: 'POST',
			body: JSON.stringify({ name, pass }),
			mode: 'cors',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) document.location.href = res.url;
				else errorPopUp(res.err, loginContainer);
			});
	} else {
		errorPopUp('You need to enter your ' + (!name ? 'username' : 'password') + ' to ' + (isLogin ? 'login' : 'register'));
	}
}
