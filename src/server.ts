import process from 'process'; // for accessing environment variables
import path from 'path'; // for creating correct File-Descriptors on the given OS
import fs from 'fs/promises'; // for reading uploaded files from tmp dir
import { existsSync } from 'fs';
import crypto from 'crypto'; // for generating authentication tokens
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env'), override: false }); // for loading environment variables from '.env'
import mongoose from 'mongoose'; // for connecting with MongoDB
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'; // Web-Server Framework, that is being used
const app = express();
import cookieParser from 'cookie-parser'; // for parsing cookies
import bcrypt from 'bcrypt'; // for cryptographically secure password-hashing
import formidable from 'formidable'; // for uploading files
import Models, { WSDir, WSFile, WSId, Workspace, ObjectId } from './models'; // Models for MongoDB
import ws from './util/workspace'; // Utility methods for working with the workspace-directory-tree
import archiver from 'archiver'; // For archiving workspace in a single zip-file
import { RequestHandler } from 'express-serve-static-core';

import { join } from 'path';
import { Archiver } from 'archiver';
import lang, { HelloWorldFn, emptyHelloWorld } from './frontend/lang';
/**
 * @param {archiver.Archiver} Archiver The Archiver used to archive the directory
 * @param {*} dir The workspace directory to archive
 * @param {String} path The path from the workspace root to this directory
 */
function archiveDir(Archiver: Archiver, dir: WSDir, path: string = '/') {
	for (const file of dir.files) {
		// @performance
		// There must be a better way than to convert the binary blob into a string and then back into a binary buffer
		Archiver.append(Buffer.from(file.content.toString(), 'utf-8'), { name: join(path, file.name) });
	}
	for (const d of dir.dirs) {
		archiveDir(Archiver, d, join(path, dir.name));
	}
}

function utf8_to_b64(s: string): string {
	return Buffer.from(s).toString('base64');
}

interface Req extends Request {
	userId: string | ObjectId | undefined;
}

// Shortcut-constants:
const ENV = process.env;
const publicPath = path.join(__dirname, '..', 'public');
const tmpDir = path.join(__dirname, '..', 'tmp');

if (!existsSync(publicPath)) fs.mkdir(publicPath);
if (!existsSync(tmpDir)) fs.mkdir(tmpDir);

// Global Read-Only Variables
const SALT_ROUNDS = 10;
const MAX_AUTH_TIME = 1000 * 60 * 60 * 12 * 5; // 5 days (in ms)
const MAX_URL_COOKIE_TIME = 1000 * 60 * 60 * 12 * 2; // 2 days (in ms)

// Global State
const AUTH_TOKS: { [index: string]: string | ObjectId | undefined } = {};

function genRandStr(size: number = 32, encoding: BufferEncoding = 'hex') {
	return crypto.randomBytes(size).toString(encoding);
}

// Connect to MongoDB
async function connectDB() {
	const mongoURI = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.91saw3c.mongodb.net/?retryWrites=true&w=majority`;
	const db = await mongoose.connect(mongoURI);
	console.log(`MongoDB connected: ${db.connection.host}`);
}
connectDB();

// Load middleware for Express Framework
app.use('/public', express.static(publicPath));
app.use(express.json());
app.use(cookieParser(ENV.SECRET));

/**
 *
 * @param {String} fileOnAuth The File to respond with if the user is authenticated
 * @param {String} fileOnErr The File to respond with if the user isn't authenticated
 * @param {Boolean} inPublicDir Whether the files are assumed to be in the public directory.
 * @returns
 */
function simpleAuthCheck(fileOnAuth: string, fileOnErr: string, inPublicDir: boolean = true) {
	if (inPublicDir) {
		fileOnAuth = path.join(publicPath, fileOnAuth);
		fileOnErr = path.join(publicPath, fileOnErr);
	}
	return async (req: Req, res: Response) => {
		if (await checkAuth(req, res)) res.sendFile(fileOnAuth);
		else res.sendFile(fileOnErr);
	};
}

async function checkAuth(req: Req, res: Response, authAsAnon = true) {
	let authTok = req.signedCookies['auth'];
	req.userId = AUTH_TOKS[authTok];
	if (!AUTH_TOKS[authTok]) {
		if (!authAsAnon) return false;
		authTok = await createUser();
		setAuthCookie(res, authTok);
	}
	req.userId = AUTH_TOKS[authTok];
	res.cookie('redirectUrl', '');
	return true;
}

async function isAnon(userId: string | ObjectId) {
	return Models.user
		.findById(userId)
		.then((user) => user?.anon ?? false)
		.catch((e) => false);
}

const ANON_USER_LIFETIME = 1000 * 60 * 60 * 12 * 4; // 4 days
const ANON_RM_INTERVAL = 1000 * 60 * 60 * 6; // 6 hours
async function rmAnonUsers(before = Date.now() - ANON_USER_LIFETIME) {
	return Models.user.deleteMany({ anon: true, updatedAt: { $lte: before } });
}

// req.userId holds the user ID or an error is raised
async function forceAuth(req: Req, res: Response, next: NextFunction) {
	if (await checkAuth(req, res, false)) next();
	else next(new Error('Unauthenticated'));
}

function authErrRedirect(err: ErrorRequestHandler, req: Req, res: Response, next: NextFunction) {
	if (req.userId === null) {
		res.cookie('redirectUrl', req.originalUrl, { maxAge: MAX_URL_COOKIE_TIME }).redirect('/login');
	} else {
		next(err);
	}
}

function authErrJSON(obj = {}) {
	return (err: ErrorRequestHandler, req: Req, res: Response, next: NextFunction) => {
		if (req.userId === null) {
			res.json({ ...obj, ...{ success: false, err: 'Not Authenticated' } });
		} else {
			next(err);
		}
	};
}

async function createUser(name: string | null = null, pass: string | null = null, anon: boolean = name === null || pass === null) {
	if (!name) name = genRandStr(24, 'utf-8');
	if (!pass) pass = genRandStr(24, 'utf-8');
	const hashedPass = await bcrypt.hash(pass, SALT_ROUNDS);
	const newUser = await Models.user.create({ name, pass: hashedPass, anon, workspaces: [] });

	const authTok = genRandStr(32, 'hex');
	AUTH_TOKS[authTok] = newUser._id;
	return authTok;
}

function setAuthCookie(res: Response, authTok: string) {
	return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'strict', httpOnly: true });
}

async function transferAnonWorkspaces(req: Req, newAuthTok: string) {
	const oldAuthTok = req.signedCookies['auth'];
	const oldUserId = AUTH_TOKS[oldAuthTok];
	if (!oldUserId) return;
	const oldUser = await Models.user.findById(oldUserId);
	if (!oldUser?.anon) return;
	const newUserId = AUTH_TOKS[newAuthTok];
	const newUser = await Models.user.findById(newUserId);
	for (const wsId of oldUser.workspaces) {
		Models.workspace.findByIdAndUpdate(wsId, { editors: [newUserId] });
		newUser?.workspaces.push(wsId);
	}
	newUser?.save();
}

// Set up Routing
app.get('/', (req, res) => {
	res.sendFile(path.join(publicPath, 'index.html'));
})
	.get('/favicon.ico', (req, res) => {
		res.sendFile(path.join(publicPath, 'logo3.ico'));
	})
	.get('/editor', (req, res) => {
		res.sendFile(path.join(publicPath, 'editor.html'));
	})
	.get('/login', (req, res) => {
		res.sendFile(path.join(publicPath, 'login.html'));
	})
	.post('/register', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		const newURL = req.cookies['redirectUrl'] || '/';
		res.clearCookie('redirectUrl');

		if (!name || !pass) {
			return res.status(418).json({ success: false, err: 'Invalid Username or Password.' });
		}
		if (Buffer.from(pass, 'utf-8').byteLength > 72) {
			return res.status(418).json({ success: false, err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' });
		}
		if ((await Models.user.exists({ name })) != null) {
			return res.status(418).json({ success: false, err: 'Username is already taken' });
		}

		const authTok = await createUser(name, pass, false);
		transferAnonWorkspaces(req as Req, authTok);
		return setAuthCookie(res, authTok).status(200).json({ success: true, url: newURL });
	})
	.post('/login', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		const newURL = req.cookies['redirectUrl'] || '/';
		res.clearCookie('redirectUrl');

		if (!name || !pass) {
			return res.status(418).json({ success: false, err: 'Invalid Username or Password.', url: null });
		}
		if (Buffer.from(pass, 'utf-8').byteLength > 72) {
			return res.status(418).json({ success: false, err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).', url: null });
		}

		const user = await Models.user.findOne({ name });
		if (!user) {
			return res.status(418).json({ err: 'Wrong username.', success: false, url: null });
		}
		const cmpRes = await bcrypt.compare(pass, user.pass as string);
		if (!cmpRes) {
			return res.status(418).json({ err: 'Wrong password.', success: false, url: null });
		}

		const authTok = genRandStr(32, 'hex');
		AUTH_TOKS[authTok] = user._id;
		transferAnonWorkspaces(req as Req, authTok);
		return setAuthCookie(res, authTok).status(200).json({ success: true, url: newURL });
	})
	.get('/workspaces', async (req, res) => {
		if (!(await checkAuth(req as Req, res, true))) return res.json({ success: false, err: 'Not authenticated' });
		const user = await Models.user.findById((req as Req).userId);
		const workspaces: Workspace[] = [];
		for await (const workspaceId of user?.workspaces ?? []) {
			const workspace = await Models.workspace.findById(workspaceId);
			if (workspace !== null) workspaces.push(workspace as unknown as Workspace);
		}
		const anon = await isAnon((req as Req).userId as string);
		return res.json({ success: true, workspaces, anon });
	})
	.post('/create/:workspaceName/:languageExt', [forceAuth, authErrJSON()] as unknown as RequestHandler, async (req, res) => {
		const userId = (req as unknown as Req).userId as ObjectId;
		const workspaceName = req.params.workspaceName;
		const ext = req.params.languageExt;
		let helloWorld: HelloWorldFn | null = null;
		if (ext === 'empty') helloWorld = emptyHelloWorld;
		else {
			helloWorld = lang.getLangHelloWorld(ext);
			if (!helloWorld) return res.json({ success: false, err: 'Unknown Language provided' });
		}

		const workspace = await Models.workspace.create(helloWorld(workspaceName, [userId], utf8_to_b64));
		await Models.user.findByIdAndUpdate(userId, { $push: { workspaces: workspace._id } });
		return res.json({ success: true, workspaceId: workspace._id });
	})
	.post('/upload/:workspaceName', [forceAuth, authErrJSON()] as unknown as RequestHandler, async (req, res) => {
		// @performance
		// seems kinda dumb that we need to first store the files locally
		// before reading them into memory (again) and sending them to mongodb.
		// The only other way would however be to use something like GridFS,
		// which apparently allows streamed buffer-upload.
		// Our files shouldn't be bigger than 16MB though, so using GridFS seems like overkill.
		const workspaceName = req.params.workspaceName;
		const form = formidable({
			keepExtensions: true,
			multiples: true,
			filter: ({ name, originalFilename, mimetype }) => {
				// TODO: Filter certain ignored files
				// For example: filter all files in a .git folder
				return true; // no filter yet
			},
			uploadDir: tmpDir,
		});
		form.parse(req, async (err, fields, files) => {
			// TODO: Better error handling
			if (err) throw err;

			let idCounter = 0;

			interface tmpWSDir {
				_id: WSId | undefined;
				name: string;
				dirs: { [index: string]: tmpWSDir | undefined };
				files: WSFile[];
			}

			const tmpRoot: tmpWSDir = { _id: undefined, name: workspaceName, files: [], dirs: {} };
			if (!Array.isArray(files.file)) files.file = [files.file];
			for await (const f of files.file) {
				if (!f) continue;
				const pathParts = (f.originalFilename ?? '').split('/');
				const content = await fs.readFile(f.filepath);
				const isTextfile = ws.checkIfTextFile(content);
				const file: WSFile = { name: pathParts.pop() as string, content, isTextfile, _id: (idCounter++).toString() };
				fs.rm(f.filepath); // Doesn't need to be awaited bc it doesn't matter when the deletion is done

				let parentDir = tmpRoot;
				for (const dname of pathParts) {
					if (!parentDir.dirs[dname]) parentDir.dirs[dname] = { name: dname, files: [], dirs: {}, _id: (idCounter++).toString() };
					parentDir = parentDir.dirs[dname] as tmpWSDir;
				}
				parentDir.files.push(file);
			}

			const flattenDir = (dir: tmpWSDir): WSDir => {
				let subdirs = Object.values(dir.dirs).map((d) => flattenDir(d as tmpWSDir));
				return {
					_id: dir._id as WSId,
					name: dir.name,
					dirs: subdirs,
					files: dir.files,
				};
			};
			const root: WSDir = ws.sortWS(flattenDir(tmpRoot));

			if (!root.files.length && !root.dirs.length) {
				return res.json({ success: false, id: null });
			}

			const workspaceDoc = await Models.workspace.create({ name: workspaceName, dirs: root.dirs, files: root.files, editors: [(req as unknown as Req).userId], idCounter });
			await Models.user.updateOne({ _id: (req as unknown as Req).userId }, { $push: { workspaces: workspaceDoc._id } });
			res.json({ success: true, id: workspaceDoc._id });
		});
	})
	.post('/empty/workspace', async (req, res) => {
		if (!(await checkAuth(req as Req, res, true))) return res.json({ success: false, err: 'Unauthenticated' });
		const workspace = await Models.workspace.create({ name: 'Unnamed', dirs: [], files: [], editors: [(req as unknown as Req).userId], idCounter: 0 });
		await Models.user.updateOne({ _id: (req as unknown as Req).userId }, { $push: { workspaces: workspace._id } });
		return res.json({ success: true, workspaceId: workspace._id });
	})
	.get('/download/:workspaceId', async (req, res) => {
		if (!(await checkAuth(req as unknown as Req, res))) return res.status(401).end();
		const workspace = await Models.workspace.findById(req.params.workspaceId);
		if (!workspace?.editors.includes((req as unknown as Req).userId as any)) return res.status(401).end();

		res.setHeader('content-type', 'application/zip, application/octet-stream');
		res.setHeader('content-disposition', `attachment;filename="${workspace.name}.zip"`);
		res.setHeader('content-description', 'File Transfer');
		res.setHeader('content-transfer-encoding', 'binary');

		const Zipper = archiver.create('zip');
		res.on('finish', () => {
			res.end();
		});
		Zipper.on('warning', (w) => console.log({ warning: w }));
		Zipper.on('error', (e) => console.log({ error: e }));
		Zipper.pipe(res);
		archiveDir(Zipper, workspace as unknown as Workspace);
		Zipper.finalize();
	})
	.get('/workspace/:workspaceId', async (req, res) => {
		if (!(await checkAuth(req as unknown as Req, res, false))) return res.json({ success: false });
		const workspace = await Models.workspace.findById(req.params.workspaceId);
		res.json({ success: true, root: workspace });
	})
	.put('/workspace/file/:workspaceId/:fileId', async (req, res) => {
		// New File Content should be the body
		// TODO: Error Handling
		if (!(await checkAuth(req as unknown as Req, res, false))) return res.json({ success: false });
		try {
			const workspace = await Models.workspace.findById(req.params.workspaceId);
			const file = ws.findFileById(workspace as unknown as Workspace, req.params.fileId as WSId);
			if (file) file.content = Buffer.from(req.body.text, 'base64');
			const mongooseRes = await workspace?.updateOne({ files: workspace.files, dirs: workspace.dirs });
			res.json({ success: mongooseRes.acknowledged });
		} catch (e) {
			console.error(e);
			res.json({ success: false, err: 'Internal Error' });
		}
	})
	.delete('/workspace/:workspaceId/:fileOrDirId', [forceAuth, authErrJSON()] as unknown as RequestHandler, async (req, res) => {
		// Delete file / dir with _id == fileOrDirId
		if (!(await checkAuth(req as unknown as Req, res, false))) return res.json({ success: false, err: 'Unauthorized' });
		try {
			const workspace = (await Models.workspace.findById(req.params.workspaceId)) as unknown as Workspace;
			const deleted = ws.deleteById(workspace, req.params.fileOrDirId as WSId);
			if (!deleted) {
				return res.json({ success: false, err: 'File or Directory with ID ' + req.params.fileOrDirId + " doesn't exist" });
			}
			await Models.workspace.findByIdAndUpdate(req.params.workspaceId, { files: workspace.files, dirs: workspace.dirs });
			res.json({ success: true });
		} catch (e) {
			console.error(e);
			res.json({ success: false, err: 'Internal Error' });
		}
	})
	.post('/workspace/file/:workspaceId/:parentDirId', [forceAuth, authErrJSON()] as unknown as RequestHandler, async (req, res) => {
		if (!(await checkAuth(req as unknown as Req, res, false))) return res.json({ success: false, err: 'Unauthorized' });
		try {
			const workspace = await Models.workspace.findById(req.params.workspaceId);
			if (!workspace || workspace.idCounter === undefined) return res.json({ success: false, err: "Workspace wasn't found" });
			const parentDir = ws.findDirById(workspace as unknown as Workspace, req.params.parentDirId);
			if (!parentDir) return res.json({ success: false, err: 'Invalid Parent-Directory ID' });
			const file = {
				_id: (workspace.idCounter++).toString(),
				name: req.body.name,
				isTextfile: true,
				content: '',
			};
			ws.addFile(parentDir, file);
			await Models.workspace.findByIdAndUpdate(workspace._id, { idCounter: workspace.idCounter, dirs: workspace.dirs, files: workspace.files });
			return res.json({ success: true, el: file });
		} catch (e) {
			res.json({ success: false, err: 'Internal Error' });
		}
	})
	.post('/workspace/dir/:workspaceId/:parentDirId', [forceAuth, authErrJSON()] as unknown as RequestHandler, async (req, res) => {
		if (!(await checkAuth(req as unknown as Req, res, false))) return res.json({ success: false, err: 'Unauthorized' });
		try {
			const workspace = await Models.workspace.findById(req.params.workspaceId);
			if (!workspace || workspace.idCounter === undefined) return res.json({ success: false, err: "Workspace wasn't found" });
			const parentDir = ws.findDirById(workspace as unknown as Workspace, req.params.parentDirId);
			if (!parentDir) return res.json({ success: false, err: 'Invalid Parent-Directory ID' });
			const dir = {
				_id: (workspace.idCounter++).toString(),
				name: req.body.name,
				files: [],
				dirs: [],
			};
			ws.addDir(parentDir, dir);
			await Models.workspace.findByIdAndUpdate(workspace._id, { idCounter: workspace.idCounter, dirs: workspace.dirs });
			return res.json({ success: true, el: dir });
		} catch (e) {
			res.json({ success: false, err: 'Internal Error' });
		}
	});

// Start Server
app.listen(ENV.PORT, () => console.log(`Server listening on port ${ENV.PORT}...`));

rmAnonUsers(Date.now()).then(() => setInterval(rmAnonUsers, ANON_RM_INTERVAL));
