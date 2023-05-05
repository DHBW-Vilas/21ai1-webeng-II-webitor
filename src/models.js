const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

// Schema for each directory object in dirs:
// name: String
// dirs: [dirObject]
// files: [fileObject]
// Schema for each file object in files:
// name: String
// content: Buffer

const workspaceSchema = new Schema({
	name: String,
	dirs: [Object],
	files: [Object],
	editors: [{ type: ObjectId, ref: 'userModel' }],
});

const userSchema = new Schema({
	name: String,
	pass: String,
	workspaces: [{ type: ObjectId, ref: 'workspaceModel' }],
});

module.exports = {
	workspace: mongoose.model('workspaceModel', workspaceSchema),
	user: mongoose.model('userModel', userSchema),
};
