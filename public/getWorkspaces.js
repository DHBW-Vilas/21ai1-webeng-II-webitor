const workspaceParentDiv = document.getElementById('workspaces');

fetch('/workspaces')
	.then((res) => res.json())
	.then((res) => {
		if (res.success) {
			res.workspaces.forEach((workspace) => {
				const workspaceEl = document.createElement('div');
				workspaceEl.innerText = workspace.name;
				workspaceEl.setAttribute('data-id', workspace._id);
				workspaceEl.addEventListener('click', (ev) => openWorkspace(ev.target.getAttribute('data-id')));
				workspaceParentDiv.insertAdjacentElement('beforeend', workspaceEl);
			});
		}
	});

function openWorkspace(workspaceId) {
	localStorage.setItem('workspaceId', workspaceId);
	window.location.href = '/editor';
}
