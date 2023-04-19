const mongoose = require('mongoose');
const { Schema } = mongoose;

const user = new Schema({
	name: String,
	pass: String,
});

module.exports = mongoose.model('userModel', user);
