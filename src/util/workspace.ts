import { WSDir, WSFile, WSId, Workspace } from '../models';
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

// len is only accurate if idx === 0
// TODO: use DisplayedWSDir and take isOpen into account
function idxOfDirHelper(root: WSDir, id: WSId): { len: number; idx: number } {
	let len = 0;
	if (idEquals(root._id, id)) return { len, idx: 0 };

	for (let d of root.dirs) {
		let x = idxOfDirHelper(d, id);
		if (x.idx >= 0) return { len, idx: len + x.idx + 1 };
		len += x.len;
	}

	for (let i = 0; i < root.files.length; i++, len++) {
		if (idEquals(root.files[i]._id, id)) return { len, idx: len + i };
	}
	return { len, idx: -1 };
}

export function idxOfDir(root: WSDir, id: WSId): number {
	return idxOfDirHelper(root, id).idx;
}

export function strCmp(s1: string, s2: string): number {
	for (let i = 0; i < s1.length && i < s2.length; i++) {
		if (s1.charCodeAt(i) < s2.charCodeAt(i)) return -1;
		else if (s1.charCodeAt(i) > s2.charCodeAt(i)) return 1;
	}
	return s1.length == s2.length ? 0 : s1.length < s2.length ? -1 : 1;
}

export function sortWS(root: WSDir): WSDir {
	root.files = root.files.sort((a, b) => strCmp(a.name, b.name));
	root.dirs = root.dirs.sort((a, b) => strCmp(a.name, b.name)).map((d) => sortWS(d));
	return root;
}

export function addFile(parent: WSDir, file: WSFile): number {
	for (let i = 0; i < parent.files.length; i++) {
		if (strCmp(file.name, parent.files[i].name)) {
			parent.files.splice(i, 0, file);
			return i;
		}
	}
	parent.files.push(file);
	return parent.files.length - 1;
}

export function addDir(parent: WSDir, dir: WSDir): number {
	for (let i = 0; i < parent.dirs.length; i++) {
		if (strCmp(dir.name, parent.dirs[i].name)) {
			parent.dirs.splice(i, 0, dir);
			return i;
		}
	}
	parent.dirs.push(dir);
	return parent.dirs.length - 1;
}

export function isValidName(parent: WSDir | null, name: string): boolean {
	if (!name) return false;
	// TODO: What are some rules for invalid file/folder names
	if (parent) {
		for (const f of parent.files) {
			if (f.name == name) return false;
		}
		for (const d of parent.dirs) {
			if (d.name == name) return false;
		}
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
	sortWS,
	addFile,
	addDir,
	idxOfDir,
	isValidName,
};
