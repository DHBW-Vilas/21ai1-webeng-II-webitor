const process = require('process'); // for accessing environment variables
const path = require('path'); // for creating correct File-Descriptors on the given OS
const crypto = require('crypto'); // for generating authentication tokens
require('dotenv').config({ path: path.join(__dirname, '.env'), override: false }); // for loading environment variables from '.env'
const mongoose = require('mongoose'); // for connecting with MongoDB
const express = require('express'); // Web-Server Framework, that is being used
const app = express();
const cookieParser = require('cookie-parser'); // for parsing cookies
const bcrypt = require('bcrypt'); // for cryptographically secure password-hashing

// Shortcut-constants:
const ENV = process.env;
const publicPath = path.join(__dirname, 'public');

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
	const db = await mongoose.connect(`mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.91saw3c.mongodb.net/?retryWrites=true&w=majority`);
	console.log(`MongoDB connected: ${db.connection.host}`);
}
connectDB();
const userModel = require('./models/User.js');

// Load middleware for Express Framework
app.use('/public', express.static(publicPath));
app.use(express.json());
app.use(cookieParser(ENV.SECRET));

// req.user holds the user object or null if the request is not authenticated
function checkAuth(req, res, next) {
	const authTok = req.signedCookies['auth'];
	req.user = AUTH_TOKS[authTok] ?? null;
	next();
}

// Set up Routing
app.get('/', (req, res) => {
	res.send('Test');
})
	.get('/test', (req, res) => {
		res.sendFile(path.join(publicPath, 'uploadTest.html'));
	})
	.get('/register', (req, res) => {
		res.sendFile(path.join(publicPath, 'register.html'));
	})
	.post('/register', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		if (!name || !pass) return res.status(418).json({ err: 'Invalid Username or Password.' });
		if (Buffer.from(pass).byteLength > 72) return res.status(418).json({ err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' });
		if ((await userModel.exists({ name })) != null) return res.status(418).json({ err: 'Username is already taken' });

		const hashedPass = await bcrypt.hash(pass, SALT_ROUNDS);
		const newUser = await userModel.create({ name, pass: hashedPass });
		const authTok = genAuthTok();
		AUTH_TOKS[authTok] = newUser.toObject();
		return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'lax' }).redirect('/protected');
	})
	.post('/login', async (req, res) => {
		let name = req.body.name || null;
		let pass = req.body.pass || null;

		if (!name || !pass) return res.status(418).json({ err: 'Invalid Username or Password.' });
		if (Buffer.from(pass).byteLength > 72) return res.status(418).json({ err: 'Password is not allowed to be more than 72 bytes long (Note: some characters take more than 1 byte).' });

		const user = await userModel.findOne({ name });
		if (!user) res.status(418).json({ err: 'Wrong username.' });
		const cmpRes = await bcrypt.compare(pass, user.pass);
		if (!cmpRes) res.status(418).json({ err: 'Wrong password.' });

		const authTok = genAuthTok();
		AUTH_TOKS[authTok] = user.toObject();
		return res.cookie('auth', authTok, { signed: true, maxAge: MAX_AUTH_TIME, sameSite: 'lax' }).redirect('/protected');
	})
	.get('/protected', [checkAuth], (req, res) => {
		if (!req.user) return res.redirect('/register');
		else return res.sendFile(path.join(publicPath, 'protected.html'));
	})
	.get('/protected/name', [checkAuth], (req, res) => {
		if (!req.user) return res.status(405).json({ err: 'Not authenticated' });
		else return res.status(200).json({ name: req.user.name });
	});

// Start Server
app.listen(ENV.PORT, () => console.log(`Server listening on port ${ENV.PORT}...`));
