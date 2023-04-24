const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const fileSchema = new Schema({
	path: String,
	file: 'Buffer',
});

const projectSchema = new Schema({
	name: String,
	files: [{ type: ObjectId, ref: 'fileModel' }],
	editors: [{ type: ObjectId, ref: 'userModel' }],
});

const userSchema = new Schema({
	name: String,
	pass: String,
	projects: [{ type: ObjectId, ref: 'projectModel' }],
});

module.exports = { file: mongoose.model('fileModel', fileSchema), project: mongoose.model('projectModel', projectSchema), user: mongoose.model('userModel', userSchema) };
