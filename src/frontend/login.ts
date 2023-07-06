import { insertStyleSelector, loadStyleFromCache } from './switchStyle';

loadStyleFromCache();
insertStyleSelector('beforeend', document.querySelector('nav') as HTMLElement);

const nameInput = document.getElementById('name-input') as HTMLInputElement;
const passInput = document.getElementById('pass-input') as HTMLInputElement;
const registerBtn = document.getElementById('register-btn') as HTMLButtonElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;

registerBtn.addEventListener('click', () => authenticate(false));
loginBtn.addEventListener('click', () => authenticate(true));

function authenticate(isLogin: boolean) {
	let name = nameInput.value;
	let pass = passInput.value;

	let path = isLogin ? '/login' : '/register';
	// TODO: Check that password is good enough
	// TODO: Check that password is at most 72 bytes long (bc of hashing algorithm used)

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
				else {
					// TODO: Error Handling
					console.log(res);
				}
			});
	} else {
		// TODO: Error Handling
	}
}
