const archiver = require('archiver');
const { join } = require('path');

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

/**
 * @param {archiver.Archiver} Archiver The Archiver used to archive the directory
 * @param {*} dir The workspace directory to archive
 * @param {String} path The path from the workspace root to this directory
 */
function archiveDir(Archiver, dir, path = '/') {
	for (const file of dir.files) {
		// @performance
		// There must be a better way than to convert the binary blob into a string and then back into a binary buffer
		Archiver.append(Buffer.from(file.content.toString(), 'utf-8'), { name: join(path, file.name) });
	}
	for (const d of dir.dirs) {
		archiveDir(Archiver, d, join(path, dir.name));
	}
}
module.exports.archiveDir = archiveDir;
