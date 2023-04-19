const process = require('process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: false });
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const ENV = process.env;

async function connectDB() {
	const db = await mongoose.connect(`mongodb+srv://${ENV.DB_USER}:${ENV.DB_PASS}@cluster0.91saw3c.mongodb.net/?retryWrites=true&w=majority`);
	console.log(`MongoDB connected: ${db.connection.host}`);
}

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.send('Test');
}).get('/test', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'uploadTest.html'));
});

connectDB();
app.listen(ENV.PORT, () => console.log(`Server listening on port ${ENV.PORT}...`));
