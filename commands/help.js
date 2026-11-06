module.exports = {
    name: 'help',
    aliases: ['giup', 'h'],
    async execute(message, args) {
        const subCommand = args[0]?.toLowerCase();

        if (subCommand === 'kinhte' || subCommand === 'money' || subCommand === 'shop') {
            return message.reply(
                `💰 **HƯỚNG DẪN: KINH TẾ, TÀI CHÍNH & SHOP** 💰\n` +
                `• \`!work\` - Đi làm kiếm xu (hồi chiêu 1 tiếng).\n` +
                `• \`!me\` (hoặc \`!profile\`, \`!tt\`) - Xem hồ sơ, ví, ngân hàng.\n` +
                `• \`!vi\` - Xem nhanh số dư ví.\n` +
                `• \`!bank\` - Xem nhanh số dư ngân hàng.\n` +
                `• \`!top\` - Bảng xếp hạng đại gia.\n` +
                `• \`!shop\` - Mở cửa hàng vật phẩm.\n` +
                `• \`!buy <id>\` - Mua vật phẩm từ shop.`
            );
        }

        if (subCommand === 'game' || subCommand === 'taixiu') {
            return message.reply(
                `🎲 **HƯỚNG DẪN: MINIGAME TÀI XỈU** 🎲\n` +
                `• \`!taixiu tai <số_tiền>\` (hoặc \`!tx\`) - Cược Tài (Tối thiểu 10k, có thể gõ \`all\`).\n` +
                `• \`!taixiu xiu <số_tiền>\` - Cược Xỉu.\n` +
                `• \`!soicau\` - Soi cầu lịch sử 20 ván gần nhất.`
            );
        }

        return message.reply(
            `📖 **HỆ THỐNG TRỢ GIÚP BOT CHAN ĐÊ** 📖\n` +
            `Gõ \`!help <danh_mục>\` để xem chi tiết:\n\n` +
            `🔹 \`!help kinhte\` - Kinh tế, công việc, ví, ngân hàng, top, shop.\n` +
            `🔹 \`!help game\` - Minigame Tài Xỉu & Soi cầu.`
        );
    }
};