const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    serverKey: { type: String, default: 'global', unique: true },
    results: { type: [String], default: [] } // Lưu lịch sử tài xỉu
});

module.exports = mongoose.model('History', historySchema);