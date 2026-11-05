const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },         // Số tiền trong ví
    bank: { type: Number, default: 0 },            // Tiền gửi ngân hàng
    streak: { type: Number, default: 0 },          // Chuỗi điểm danh liên tiếp
    lastDaily: { type: Number, default: null },    // Mốc thời gian điểm danh lần cuối
    lastWork: { type: Number, default: 0 },        // Mốc thời gian đi làm (!work) lần cuối
    lastInterestTime: { type: Number, default: null }, // Mốc thời gian tính lãi ngân hàng
    inventory: { type: [String], default: [] },    // Túi đồ (chứa mã nhẫn đã mua)
    marriedTo: { type: String, default: null },    // ID người đang kết hôn cùng
    debts: [                                       // Sổ nợ P2P giữa các người chơi
        {
            lenderId: String,
            borrowerId: String,
            amount: Number
        }
    ]
});

module.exports = mongoose.model('User', userSchema);