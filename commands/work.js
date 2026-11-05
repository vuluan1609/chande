const User = require('../models/User');

module.exports = {
    name: 'work',
    async execute(message, args) {
        const userId = message.author.id;
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId, balance: 0, lastWork: 0 });
        }

        const cooldownTime = 60 * 60 * 1000; // 1 giờ
        const timeLeft = cooldownTime - (Date.now() - (user.lastWork || 0));

        if (timeLeft > 0) {
            const minutesLeft = Math.ceil(timeLeft / (60 * 1000));
            return message.reply(`⏳ Bạn vừa đi làm rồi! Vui lòng đợi thêm **${minutesLeft} phút** nữa mới được đi làm tiếp nhé.`);
        }

        const earnings = 50000;
        user.balance += earnings;
        user.lastWork = Date.now();
        await user.save();

        return message.reply(`🛠️ Bạn đã đi làm chăm chỉ và kiếm được **${earnings.toLocaleString()} xu**! Tổng số dư ví hiện tại: **${user.balance.toLocaleString()} xu**.`);
    }
};