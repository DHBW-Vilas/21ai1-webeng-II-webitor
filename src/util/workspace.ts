import { WSDir, WSFile, WSId } from '../models';
import mongoose from 'mongoose';

export function idEquals(id1: WSId, id2: WSId): boolean {
	if (id1 instanceof mongoose.Types.ObjectId) id1 = id1.toString();
	if (id2 instanceof mongoose.Types.ObjectId) id2 = id2.toString();
	return id1 === id2;
}

export function checkIfTextFile(buf: Buffer): boolean {
	try {
		let s = new String(buf);
		return true;
	} catch (e) {
		return false;
	}
}

export function findFileById(root: WSDir, id: WSId): WSFile | null {
	let res: WSFile | null | undefined = root.files.find((f) => idEquals(f._id, id));
	if (res) return res;

	for (const subdir of root.dirs) {
		res = findFileById(subdir, id);
		if (res) return res;
	}
	return null;
}

export function findDirById(root: WSDir, id: WSId): WSDir | null {
	if (idEquals(root._id, id)) return root;

	for (const subdir of root.dirs) {
		let res = findDirById(subdir, id);
		if (res !== null) return res;
	}
	return null;
}

export function deleteFileById(root: WSDir, id: WSId): boolean {
	let idx = root.files.findIndex((f) => idEquals(f._id, id));
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
	let idx = root.dirs.findIndex((d) => idEquals(d._id, id));
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

export function isValidName(dir: WSDir, name: string): boolean {
	for (const f of dir.files) {
		if (f.name == name) return false;
	}
	for (const d of dir.dirs) {
		if (d.name == name) return false;
	}
	return true;
}

export default {
	idEquals,
	checkIfTextFile,
	findFileById,
	findDirById,
	deleteFileById,
	deleteDirById,
	deleteById,
	isValidName,
};
