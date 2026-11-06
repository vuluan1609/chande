const User = require('../models/User'); // Import model User của bạn

module.exports = {
    name: 'buy',
    description: 'Mua vật phẩm từ shop',
    async execute(message, args) {
        const itemID = args[0];
        if (!itemID) {
            return message.reply('❌ Vui lòng nhập ID vật phẩm muốn mua (Ví dụ: `!buy 1`).');
        }

        // Logic kiểm tra tiền và cộng vật phẩm vào MongoDB Atlas
        // ...
        return message.reply(`✅ Bạn đã mua thành công vật phẩm số ${itemID}!`);
    }
};