const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

// Schema for each directory object in dirs:
// _id: Number
// name: String
// dirs: [dirObject]
// files: [fileObject]

// Schema for each file object in files:
// _id: Number
// name: String
// content: Buffer

const workspaceSchema = new Schema(
	{
		name: String,
		dirs: [Object],
		files: [Object],
		editors: [{ type: ObjectId, ref: 'userModel' }],
		idCounter: Number,
	},
	{ timestamps: true }
);

const userSchema = new Schema(
	{
		name: String,
		pass: String,
		anon: Boolean,
		workspaces: [{ type: ObjectId, ref: 'workspaceModel' }],
	},
	{ timestamps: true }
);

module.exports = {
	workspace: mongoose.model('workspaceModel', workspaceSchema),
	user: mongoose.model('userModel', userSchema),
};
