const mongoose = require('mongoose');

const otherSchema = new mongoose.Schema({
    frm: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const OtherIp = mongoose.model('OtherIp', otherSchema);
module.exports = OtherIp;