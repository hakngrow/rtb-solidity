const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({

    cam_id: {type: String, unique: true, trim: true},
    coy_id: {type: String},
    name: {type: String, unique: true, trim: true},
    targetGender: {type: String, trim: true, uppercase: true},
    targetAgeLower: {type: Number, min: 1, max: 10000},
    targetAgeUpper: {type: Number, min: 1, max: 10000},
    targetTags: [String],
    bidPrice: Number,
    picture: Buffer
});

module.exports = mongoose.model('Campaign', campaignSchema);