const User = require('../models/User');

module.exports = {
    name: 'me',
    aliases: ['profile', 'tt', 'vi', 'wallet', 'bank', 'nganhang'],
    async execute(message, args, commandName) {
        const userId = message.author.id;
        let userData = await User.findOne({ userId });
        if (!userData) {
            userData = await User.create({ userId, balance: 0, bank: 0, streak: 0, inventory: [] });
        }

        const wallet = userData.balance || 0;
        const bank = userData.bank || 0;
        const total = wallet + bank;

        // Xử lý lệnh xem nhanh ví (!vi)
        if (commandName === 'vi' || commandName === 'wallet') {
            return message.reply(`💰 Ví của bạn hiện đang có: **${wallet.toLocaleString()} xu**.`);
        }

        // Xử lý lệnh xem nhanh ngân hàng (!bank / !nganhang)
        if (commandName === 'bank' || commandName === 'nganhang') {
            return message.reply(`🏦 Ngân hàng của bạn hiện đang gửi: **${bank.toLocaleString()} xu**.`);
        }

        // Xem hồ sơ chi tiết cho !me, !profile, !tt
        let marriageStatus = 'Độc thân vui vẻ 🍃';
        if (userData.marriedTo) {
            marriageStatus = `Đã kết hôn với <@${userData.marriedTo}> 💍`;
        }

        return message.reply(
            `📊 **HỒ SƠ CÁ NHÂN CỦA ${message.author.username.toUpperCase()}**\n\n` +
            `💰 Ví: \`${wallet.toLocaleString()} xu\`\n` +
            `🏦 Ngân hàng: \`${bank.toLocaleString()} xu\`\n` +
            `💎 Tổng tài sản: **${total.toLocaleString()} xu**\n` +
            `💍 Tình trạng: ${marriageStatus}`
        );
    }
};