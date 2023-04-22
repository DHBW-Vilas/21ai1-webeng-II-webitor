const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const fileSchema = new Schema({
	path: String,
	file: 'Buffer',
});

const projectSchema = new Schema({
	name: String,
	files: [ObjectId],
	editors: [ObjectId],
});

const userSchema = new Schema({
	name: String,
	pass: String,
	projects: [ObjectId],
});

module.exports = { file: mongoose.model('fileModel', fileSchema), project: mongoose.model('projectModel', projectSchema), user: mongoose.model('userModel', userSchema) };
