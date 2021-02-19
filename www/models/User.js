const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    user_id: {type: String, unique: true, lowercase: true},
    name: {type: String, unique: true, trim: true},
    age: {type: Number, min: 1, max: 10000},
    gender: {type: String, trim: true, uppercase: true},
    tags: [String],
    picture: String
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
