import mongoose, { ObjectId } from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

export type WSId = ObjectId | string;

export type WSFile = {
	_id: WSId;
	name: string;
	isTextfile: boolean;
	content: Buffer | string;
};

export type WSDir = {
	_id: WSId;
	name: string;
	dirs: WSDir[];
	files: WSFile[];
};

export interface Workspace extends WSDir {
	editors: ObjectId[];
	idCounter: number;
}

// File contents are stored as buffers instead of strings, because we might receive a binary file (that can't be stored as a valid string) in an upload

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

export default {
	workspace: mongoose.model('workspaceModel', workspaceSchema),
	user: mongoose.model('userModel', userSchema),
};
