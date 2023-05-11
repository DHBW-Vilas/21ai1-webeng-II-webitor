const process = require('process'); // for accessing environment variables
const path = require('path'); // for creating correct File-Descriptors on the given OS
const fs = require('fs/promises'); // for reading uploaded files from tmp dir
const { existsSync, createReadStream } = require('fs');
const crypto = require('crypto'); // for generating authentication tokens
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env'), override: false }); // for loading environment variables from '.env'
const mongoose = require('mongoose'); // for connecting with MongoDB
const express = require('express'); // Web-Server Framework, that is being used
const app = express();
const cookieParser = require('cookie-parser'); // for parsing cookies
const bcrypt = require('bcrypt'); // for cryptographically secure password-hashing
const formidable = require('formidable'); // for uploading files
const Models = require('./models.js'); // Models for MongoDB
const ws = require('./workspace.js'); // Utility methods for working with the workspace-directory-tree
const archiver = require('archiver'); // For archiving workspace in a single zip-file

// Shortcut-constants:
const ENV = process.env;
const publicPath = path.join(__dirname, '..', 'public');
const tmpDir = path.join(__dirname, '..', 'tmp');

if (!existsSync(publicPath)) fs.mkdir(publicPath);
if (!existsSync(tmpDir)) fs.mkdir(tmpDir);

// Global Read-Only Variables
const SALT_ROUNDS = 10;
const MAX_AUTH_TIME = 1000 * 60 * 60 * 12 * 5; // 5 days (in ms)

// Global State
const AUTH_TOKS = {};

function genRandStr(size = 32, encoding = 'hex') {
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

async function checkAuth(req, res, authAsAnon = true) {
	let authTok = req.signedCookies['auth'];
	req.userId = AUTH_TOKS[authTok] ?? null;
	if (!AUTH_TOKS[authTok]) {
		if (!authAsAnon) return false;
		authTok = await createUser();
	}
	req.userId = AUTH_TOKS[authTok];
	res.cookie('url', '');
	return true;
}

async function isAnon(userId) {
	return Models.user
		.findById(userId)
		.then((user) => user.anon)
		.catch((e) => false);
}

const ANON_USER_LIFETIME = 1000 * 60 * 60 * 12 * 4; // 4 days
const ANON_RM_INTERVAL = 1000 * 60 * 60 * 6; // 6 hours
async function rmAnonUsers(before = Date.now() - ANON_USER_LIFETIME) {
	return Models.user.deleteMany({ anon: true, updatedAt: { $lte: before } });
}

// req.userId holds the user ID or an error is raised
async function forceAuth(req, res, next) {
	if (await checkAuth(req, res, false)) next();
	else next(new Error('Unauthenticated'));
}

function authErrRedirect(err, req, res, next) {
	if (req.userId === null) {
		res.cookie('url', req.originalUrl).redirect('/login');
	} else {
		next(err);
	}
}

function authErrJSON(obj = {}) {
	return (err, req, res, next) => {
		if (req.userId === null) {
			res.json({ ...obj, ...{ success: false, err: 'Not Authenticated' } });
		} else {
			next(err);
		}
	};
}

/**
 *
 * @param {String} fileOnAuth The File to respond with if the user is authenticated
 * @param {String} fileOnErr The File to respond with if the user isn't authenticated
 * @param {Boolean} inPublicDir Whether the files are assumed to be in the public directory.
 * @returns
 */
function simpleAuthCheck(fileOnAuth, fileOnErr, inPublicDir = true) {
	if (inPublicDir) {
		fileOnAuth = path.join(publicPath, fileOnAuth);
		fileOnErr = path.join(publicPath, fileOnErr);
	}
	return async (req, res) => {
		if (await checkAuth(req, res)) res.sendFile(fileOnAuth);
		else res.sendFile(fileOnErr);
	};
}

async function createUser(name = null, pass = null, anon = name === null || pass === null) {
	if (!name) name = genRandStr(24, 'utf-8');
	if (!pass) pass = genRandStr(24, 'utf-8');
	const hashedPass = await bcrypt.hash(pass, SALT_ROUNDS);
	const newUser = await Models.user.create({ name, pass: hashedPass, anon, workspaces: [] });

	const authTok = genRandStr(32, 'hex');
	AUTH_TOKS[authTok] = newUser._id;
	return authTok;
}

// Set up Routing
app.get('/', (req, res) => {
	res.sendFile(path.join(publicPath, 'Frontend', 'HomeLayout', 'StartPage.html'));
})
	.get('/editor', (req, res) => {
		res.sendFile(path.join(publicPath, 'Frontend', 'EditorLayout', 'CodeMirror.html'));
	})
	.get('/login', (req, res) => {
		res.sendFile(path.join(publicPath, 'login.html'));
	})
	.post('/register', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		const newURL = req.cookies['url'] || '/';
		res.clearCookie('url');

		if (!name || !pass) {
			return res.status(418).json({ success: false, err: 'Invalid Username or Password.' });
		}
		if (Buffer.from(pass).byteLength > 72) {
			return res.status(418).json({ success: false, err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' });
		}
		if ((await Models.user.exists({ name })) != null) {
			return res.status(418).json({ success: false, err: 'Username is already taken' });
		}

		const authTok = await createUser(name, pass, false);
		return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'lax', httpOnly: true }).status(200).json({ success: true, url: newURL });
	})
	.post('/login', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		const newURL = req.cookies['url'] || '/';
		res.clearCookie('url');

		if (!name || !pass) {
			return res.status(418).json({ success: false, err: 'Invalid Username or Password.', url: null });
		}
		if (Buffer.from(pass).byteLength > 72) {
			return res.status(418).json({ success: false, err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).', url: null });
		}

		const user = await Models.user.findOne({ name });
		if (!user) {
			return res.status(418).json({ err: 'Wrong username.', success: false, url: null });
		}
		const cmpRes = await bcrypt.compare(pass, user.pass);
		if (!cmpRes) {
			return res.status(418).json({ err: 'Wrong password.', success: false, url: null });
		}

		const authTok = genRandStr(32, 'hex');
		AUTH_TOKS[authTok] = user._id;
		return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'strict', httpOnly: true }).status(200).json({ success: true, url: newURL });
	})
	.get('/workspaces', async (req, res) => {
		if (!(await checkAuth(req, res, true))) return res.json({ success: false, err: 'Not authenticated' });
		const user = await Models.user.findById(req.userId);
		const workspaces = [];
		for await (const workspaceId of user.workspaces) workspaces.push(await Models.workspace.findById(workspaceId));
		const anon = await isAnon(req.userId);
		return res.json({ success: true, workspaces, anon });
	})
	.post('/create/:workspaceName/:language', [forceAuth, authErrJSON()], async (req, res) => {
		// TODO: Create hello world workspace for the given language
	})
	.post('/new/:workspaceName', [forceAuth, authErrJSON()], async (req, res) => {
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
			const root = { name: workspaceName, files: [], dirs: {} };
			for await (const f of files.file) {
				const pathParts = f.originalFilename.split('/');
				const file = { name: pathParts.pop(), file: await fs.readFile(f.filepath), _id: idCounter++ };
				fs.rm(f.filepath); // Doesn't need to be awaited bc it doesn't matter when the deletion is done

				let parentDir = root;
				for (const dname of pathParts) {
					if (!parentDir.dirs[dname]) parentDir.dirs[dname] = { name: dname, files: [], dirs: {}, _id: idCounter++ };
					parentDir = parentDir.dirs[dname];
				}
				parentDir.files.push(file);
			}

			const flattenDir = (dir) => {
				let subdirIds = Object.values(dir.dirs).map((d) => flattenDir(d));
				dir.dirs = subdirIds;
				return dir;
			};
			flattenDir(root);

			const workspaceDoc = await Models.workspace.create({ name: workspaceName, dirs: root.dirs, files: root.files, editors: [req.userId], idCounter });
			await Models.user.updateOne({ _id: req.userId }, { $push: { workspaces: workspaceDoc._id } });
			const user = await Models.user.findById(req.userId);
			console.log({ user });
			res.json({ success: true, id: workspaceDoc._id });
		});
	})
	.get('/download/:workspaceId', async (req, res) => {
		if (!(await checkAuth(req, res))) return res.status(401).end();
		const workspace = await Models.workspace.findById(req.params.workspaceId);
		if (!workspace.editors.includes(req.userId)) return res.status(401).end();

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
		ws.archiveDir(Zipper, workspace);
		Zipper.finalize();
	})
	.get('/workspace/:workspaceId', [forceAuth, authErrJSON({ root: {} })], async (req, res) => {
		const workspace = await Models.workspace.findById(req.params.workspaceId);
		res.json({ success: true, root: workspace });
	})
	.put('/workspace/file/:workspaceId/:fileId', [forceAuth, authErrJSON()], async (req, res) => {
		// New File Content should be the body
		// TODO: Error Handling
		try {
			const workspace = await Models.workspace.findById(req.params.workspaceId);
			const file = ws.findFileById(workspace, req.params.fileId);
			file.content = Buffer.from(req.body);
			await workspace.save();
			res.json({ success: true });
		} catch (e) {
			console.error(e);
			res.json({ success: false, err: 'Internal Error' });
		}
	})
	.delete('/workspace/:workspaceId/:fileOrDirId', [forceAuth, authErrJSON()], async (req, res) => {
		// Delete file / dir with _id == fileOrDirId
		try {
			const workspace = await Models.workspace.findById(req.params.workspaceId);
			const res = ws.deleteById(workspace, req.params.fileOrDirId);
			if (!res) {
				return res.json({ success: false, err: 'File or Directory with ID ' + req.params.fileOrDirId + " doesn't exist" });
			}
			await workspace.save();
			res.json({ success: true });
		} catch (e) {
			console.error(e);
			res.json({ success: false, err: 'Internal Error' });
		}
	})
	// TODO: Decide which API is better to work with for the frontend
	// 1. /:workspaceId/:parentDirId with body == filename
	// 2. /:workspaceId with body == path for new file (including filename)
	.post('/workspace/file/:workspaceId', [forceAuth, authErrJSON()], async (req, res) => {})
	.post('/workspace/dir/:workspaceId', [forceAuth, authErrJSON()], async (req, res) => {}); // Body contains path for new directory

// Start Server
app.listen(ENV.PORT, () => console.log(`Server listening on port ${ENV.PORT}...`));

rmAnonUsers(Date.now()).then(() => setInterval(rmAnonUsers, ANON_RM_INTERVAL));
