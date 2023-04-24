const process = require('process'); // for accessing environment variables
const path = require('path'); // for creating correct File-Descriptors on the given OS
const fs = require('fs/promises'); // for reading uploaded files from tmp dir
const { existsSync } = require('fs');
const crypto = require('crypto'); // for generating authentication tokens
require('dotenv').config({ path: path.join(__dirname, '..', 'config.env'), override: false }); // for loading environment variables from '.env'
const mongoose = require('mongoose'); // for connecting with MongoDB
const express = require('express'); // Web-Server Framework, that is being used
const app = express();
const cookieParser = require('cookie-parser'); // for parsing cookies
const bcrypt = require('bcrypt'); // for cryptographically secure password-hashing
const formidable = require('formidable'); // for uploading files

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

function genAuthTok(size = 30) {
	return crypto.randomBytes(size).toString('hex');
}

// Connect to MongoDB && load required Mongo-Schemas
async function connectDB() {
	const mongoURI = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.91saw3c.mongodb.net/?retryWrites=true&w=majority`;
	const db = await mongoose.connect(mongoURI);
	console.log(`MongoDB connected: ${db.connection.host}`);
}
connectDB();
const Models = require('./models.js');

// Load middleware for Express Framework
app.use('/public', express.static(publicPath));
app.use(express.json());
app.use(cookieParser(ENV.SECRET));

// req.userId holds the user ID or an error is raised
function forceAuth(req, res, next) {
	const authTok = req.signedCookies['auth'];
	req.userId = AUTH_TOKS[authTok] ?? null;
	if (!AUTH_TOKS[authTok]) next(new Error('Unauthenticated'));
	else {
		res.cookie('url', '');
		next();
	}
}

// If
function authErr(err, req, res, next) {
	console.log({ id: req.userId });
	if (req.userId === null) {
		res.cookie('url', req.originalUrl).redirect('/login');
	} else {
		next(err);
	}
}

// Set up Routing
app.get('/', (req, res) => {
	res.send('Test');
})
	.get('/login', (req, res) => {
		res.sendFile(path.join(publicPath, 'login.html'));
	})
	.post('/register', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		if (!name || !pass) return res.status(418).json({ err: 'Invalid Username or Password.' });
		if (Buffer.from(pass).byteLength > 72) return res.status(418).json({ err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' });
		if ((await Models.user.exists({ name })) != null) return res.status(418).json({ err: 'Username is already taken' });

		const hashedPass = await bcrypt.hash(pass, SALT_ROUNDS);
		const newUser = await Models.user.create({ name, pass: hashedPass, projects: [] });
		const authTok = genAuthTok();
		AUTH_TOKS[authTok] = newUser._id;
		const newURL = req.cookies['url'] || '/';
		return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'lax' }).redirect(newURL);
	})
	.post('/login', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		if (!name || !pass) return res.status(418).json({ err: 'Invalid Username or Password.' });
		if (Buffer.from(pass).byteLength > 72) return res.status(418).json({ err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' });

		const user = await Models.user.findOne({ name });
		if (!user) return res.status(418).json({ err: 'Wrong username.' });
		console.log({ user: user });
		const cmpRes = await bcrypt.compare(pass, user.pass);
		if (!cmpRes) res.status(418).json({ err: 'Wrong password.' });

		const authTok = genAuthTok();
		AUTH_TOKS[authTok] = user._id;
		const newURL = req.cookies['url'] || '/';
		return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'lax', httpOnly: true }).redirect(newURL);
	})
	.get('/projects', [forceAuth, authErr], async (req, res) => {
		const user = await Models.user.findById(req.userId);
		const projects = [];
		for await (const projectId of user.projects) projects.push(await Models.project.findById(projectId));
		return res.send({ projects });
	})
	.post('/new/:projectName', [forceAuth, authErr], async (req, res) => {
		// @performance
		// seems kinda dumb that we need to first store the files locally
		// before reading them into memory (again) and sending them to mongodb.
		// The only other way would however be to use something like GridFS,
		// which apparently allows streamed buffer-upload.
		// Our files shouldn't be bigger than 16MB though, so using GridFS seems like overkill.
		// It seems especially unimportant if we can start using the files on the client
		// before the server has responded.

		const projectName = req.params.projectName;
		const form = formidable({ keepExtensions: true, multiples: true, filter: filterFiles, uploadDir: tmpDir });
		form.parse(req, async (err, fields, files) => {
			if (err) throw err;

			let fileIDs = [];
			for await (const f of files.file) {
				const fileBuffer = await fs.readFile(f.filepath);
				const doc = await Models.file.create({ path: f.originalFilename, file: fileBuffer });
				fileIDs.push(doc._id);
				fs.rm(f.filepath);
			}

			const doc = await Models.project.create({ name: projectName, files: fileIDs, editors: [req.userId] });
			console.log(doc.toObject());
			res.json({ project: doc.toObject() });
		});
	});

function filterFiles({ name, originalFilename, mimetype }) {
	// TODO: Filter certain ignored files
	// For example: filter all files in a .git folder

	return true; // no filter yet
}

// Start Server
app.listen(ENV.PORT, () => console.log(`Server listening on port ${ENV.PORT}...`));
