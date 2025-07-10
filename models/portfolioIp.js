const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    frm: { type: String, required: true },
    ip: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const PortfolioIp = mongoose.model('PortfolioIp', ipSchema);
module.exports = PortfolioIp;