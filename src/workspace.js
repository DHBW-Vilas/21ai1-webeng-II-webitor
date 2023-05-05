function findFileById(root, id) {
	let res = root.files.find((f) => f._id === id);
	if (id !== null) return res;

	for (const subdir of root.dirs) {
		res = findFileById(subdir, id);
		if (res !== null) return res;
	}
	return null;
}
module.exports.findFileById = findFileById;

function findDirById(root, id) {
	if (root._id === id) return root;

	for (const subdir of root.dirs) {
		res = findDirById(subdir, id);
		if (res !== null) return res;
	}
	return null;
}
module.exports.findDirById = findDirById;

function deleteFileById(root, id) {
	let idx = root.files.findIndex((f) => f._id === id);
	if (idx >= 0) {
		root.files.splice(idx, 1);
		return true;
	}

	for (const subdir of root.dirs) {
		res = deleteFileById(subdir, id);
		if (res) return res;
	}
	return false;
}
module.exports.deleteFileById = deleteFileById;

function deleteDirById(root, id) {
	let idx = root.dirs.findIndex((d) => d._id === id);
	if (idx >= 0) {
		root.dirs.splice(idx, 1);
		return true;
	}

	for (const subdir of root.dirs) {
		res = deleteDirById(subdir, id);
		if (res) return res;
	}
	return false;
}
module.exports.deleteDirById = deleteDirById;

function deleteById(root, id) {
	if (deleteFileById(root, id)) return true;
	else return deleteDirById(root, id);
}
module.exports.deleteById = deleteById;
