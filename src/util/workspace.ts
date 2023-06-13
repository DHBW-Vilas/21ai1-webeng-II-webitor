import { WSDir, WSFile, WSId } from '../models';

export function findFileById(root: WSDir, id: WSId): WSFile | null {
	console.log('findFileById: ', { root, id });

	let res: WSFile | null | undefined = root.files.find((f) => f._id === id);
	if (res) return res;

	for (const subdir of root.dirs) {
		res = findFileById(subdir, id);
		if (res) return res;
	}
	return null;
}

export function findDirById(root: WSDir, id: WSId): WSDir | null {
	if (root._id === id) return root;

	for (const subdir of root.dirs) {
		let res = findDirById(subdir, id);
		if (res !== null) return res;
	}
	return null;
}

export function deleteFileById(root: WSDir, id: WSId): boolean {
	let idx = root.files.findIndex((f) => f._id === id);
	if (idx >= 0) {
		root.files.splice(idx, 1);
		return true;
	}

	for (const subdir of root.dirs) {
		let res = deleteFileById(subdir, id);
		if (res) return res;
	}
	return false;
}

export function deleteDirById(root: WSDir, id: WSId): boolean {
	let idx = root.dirs.findIndex((d) => d._id === id);
	if (idx >= 0) {
		root.dirs.splice(idx, 1);
		return true;
	}

	for (const subdir of root.dirs) {
		let res = deleteDirById(subdir, id);
		if (res) return res;
	}
	return false;
}

export function deleteById(root: WSDir, id: WSId): boolean {
	if (deleteFileById(root, id)) return true;
	else return deleteDirById(root, id);
}

export default {
	findFileById,
	findDirById,
	deleteFileById,
	deleteDirById,
	deleteById,
};
