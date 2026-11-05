const User = require('../models/User');
const History = require('../models/History');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'taixiu',
    aliases: ['tx', 'soicau'],
    async execute(message, args, command) {
        // Xử lý lệnh !soicau
        if (command === 'soicau') {
            let history = await History.findOne({ serverKey: 'global' });
            if (!history || history.results.length === 0) {
                return message.reply('📊 Chưa có dữ liệu lịch sử tài xỉu nào! Hãy chơi vài ván `!taixiu` trước nhé.');
            }
            const recentResults = history.results.slice(-10);
            const visualResults = recentResults.map(r => r === 'tai' ? '🔴' : '🔵').join(' ');
            const taiCount = recentResults.filter(r => r === 'tai').length;
            const xiuCount = recentResults.filter(r => r === 'xiu').length;

            return message.reply(
                `📊 **BẢNG SOI CẦU TÀI XỈU (${recentResults.length} ván gần nhất)** 📊\n` +
                `├ Chuỗi cầu: ${visualResults}\n` +
                `├ Thống kê: 🔴 **Tài**: ${taiCount} | 🔵 **Xỉu**: ${xiuCount}\n` +
                `└ 💡 *Xu hướng:* Cầu đang nghiêng về **${taiCount >= xiuCount ? 'TÀI 🔴' : 'XỈU 🔵'}**!`
            );
        }

        // Xử lý lệnh !taixiu / !tx
        const choice = args[0]?.toLowerCase();
        const amountStr = args[1];
        const userId = message.author.id;

        if (!choice || (choice !== 'tai' && choice !== 'xiu')) {
            return message.reply('❌ Cú pháp không đúng! Vui lòng dùng: `!taixiu tai <số_tiền>` hoặc `!taixiu xiu <số_tiền>` (Tối thiểu 10,000 xu).');
        }

        let userData = await User.findOne({ userId });
        if (!userData) {
            userData = await User.create({ userId, balance: 0 });
        }

        const wallet = userData.balance;
        let betAmount = (amountStr === 'all' || amountStr === 'allin') ? wallet : parseInt(amountStr);

        if (isNaN(betAmount) || betAmount <= 0) {
            return message.reply('❌ Vui lòng nhập số tiền cược hợp lệ! Ví dụ: `!taixiu tai 50000` hoặc `!taixiu xiu all`');
        }

        if (betAmount < 10000 && wallet >= 10000) {
            return message.reply(`❌ Mức cược tối thiểu cho mỗi ván Tài Xỉu là **10,000 xu** nhé!`);
        }

        if (wallet < betAmount) {
            return message.reply(`❌ Ví của bạn không đủ tiền! Bạn chỉ đang có **${wallet.toLocaleString()} xu** trong ví thôi.`);
        }

        const rollMessage = await message.reply(`🎲 **Bát đang được xóc...**\nNgười chơi: **${message.author.username}** chọn **${choice.toUpperCase()}** (${betAmount.toLocaleString()} xu)\nXí ngầu đang quay: 🎲 🎲 🎲`);

        const rollingFrames = ['⚀ ⚂ ⚄', '⚁ ⚃ ⚅', '⚄ ⚀ ⚂', '⚅ ⚁ ⚃', '⚂ ⚄ ⚀'];
        for (let i = 0; i < 5; i++) {
            await sleep(600);
            const randomFrame = rollingFrames[Math.floor(Math.random() * rollingFrames.length)];
            await rollMessage.edit(`🎲 **Sòng Tài Xỉu đang mở bát...**\nNgười chơi: **${message.author.username}** chọn **${choice.toUpperCase()}** (${betAmount.toLocaleString()} xu)\nXí ngầu đang quay: [ ${randomFrame} ]`);
        }

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const dice3 = Math.floor(Math.random() * 6) + 1;
        const totalPoints = dice1 + dice2 + dice3;

        let result = (dice1 === dice2 && dice2 === dice3) ? 'bao' : (totalPoints <= 10 ? 'xiu' : 'tai');
        const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        const diceDisplay = `${diceEmojis[dice1]} ${diceEmojis[dice2]} ${diceEmojis[dice3]}`;

        let finalReply = `🎲 **KẾT QUẢ TÀI XỈU** 🎲\n- Xí ngầu: [ ${diceDisplay} ] (Tổng điểm: **${totalPoints}**)\n`;

        userData = await User.findOne({ userId });
        if (result === 'bao') {
            userData.balance -= betAmount;
            finalReply += `💥 **NỔ BÃO (${dice1}-${dice1}-${dice1})!** Nhà cái ăn hết! Bạn mất **${betAmount.toLocaleString()} xu**... 😢`;
        } else if (choice === result) {
            userData.balance += betAmount;
            finalReply += `🎉 Chúc mừng bạn chọn **${choice.toUpperCase()}** trúng kết quả **${result.toUpperCase()}**! Nhận **+${betAmount.toLocaleString()} xu** 💰`;
        } else {
            userData.balance -= betAmount;
            finalReply += `😢 Rất tiếc, kết quả là **${result.toUpperCase()}**. Bạn đã thua **${betAmount.toLocaleString()} xu**...`;
        }

        await userData.save();

        let history = await History.findOne({ serverKey: 'global' });
        if (!history) history = new History({ serverKey: 'global', results: [] });
        
        history.results.push(result === 'bao' ? 'xiu' : result);
        if (history.results.length > 20) history.results.shift();
        await history.save();

        return rollMessage.edit(finalReply);
    }
};