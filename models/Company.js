const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({

    coy_id: {type: String, unique: true, trim: true},
    name: {type: String, unique: true, trim: true},
    type: {type: String, trim: true, uppercase: true},
    address: {type: String, trim: true}
});

module.exports = mongoose.model('Company', companySchema);