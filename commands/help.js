module.exports = {
    name: 'help',
    aliases: ['giup', 'h'],
    async execute(message, args) {
        const subCommand = args[0]?.toLowerCase();

        if (subCommand === 'kinhte' || subCommand === 'money') {
            return message.reply(
                `💰 **HƯỚNG DẪN: KINH TẾ & TÀI CHÍNH** 💰\n` +
                `• \`!work\` - Đi làm kiếm xu (hồi chiêu 1 tiếng).\n` +
                `• \`!me\` (hoặc \`!profile\`, \`!tt\`) - Xem hồ sơ, ví, ngân hàng.\n` +
                `• \`!vi\` - Xem nhanh số dư ví.\n` +
                `• \`!bank\` - Xem nhanh số dư ngân hàng.\n` +
                `• \`!top\` - Bảng xếp hạng đại gia.`
            );
        }

        if (subCommand === 'shop') {
            return message.reply(
                `🛒 **HƯỚNG DẪN: CỬA HÀNG VẬT PHẨM** 🛒\n` +
                `• \`!shop\` - Xem danh sách vật phẩm trong cửa hàng.\n` +
                `• \`!buy <id_vật_phẩm>\` - Mua vật phẩm về túi đồ.`
            );
        }

        if (subCommand === 'cuoihoi') {
            return message.reply(
                `💍 **HƯỚNG DẪN: SHOP NHẪN & KẾT HÔN** 💍\n` +
                `• \`!shopnhan\` - Xem danh sách các loại nhẫn.\n` +
                `• \`!muanhan <mã_nhẫn>\` - Mua nhẫn cất vào túi đồ.\n` +
                `• \`!kho\` (hoặc \`!inventory\`) - Kiểm tra kho nhẫn đang sở hữu.\n` +
                `• \`!cuhon @User <mã_nhẫn>\` - Ngỏ lời cầu hôn.`
            );
        }

        if (subCommand === 'game' || subCommand === 'taixiu') {
            return message.reply(
                `🎲 **HƯỚNG DẪN: MINIGAME TÀI XỈU** 🎲\n` +
                `• \`!taixiu tai <số_tiền>\` (hoặc \`!tx\`) - Cược Tài (Tối thiểu 10k).\n` +
                `• \`!taixiu xiu <số_tiền>\` - Cược Xỉu.\n` +
                `• \`!soicau\` - Soi cầu lịch sử 20 ván gần nhất.`
            );
        }

        // Menu chính khi gõ !help
        return message.reply(
            `📖 **HỆ THỐNG TRỢ GIÚP BOT CHAN ĐÊ** 📖\n` +
            `Gõ \`!help <danh_mục>\` để xem chi tiết từng nhóm lệnh:\n\n` +
            `🔹 \`!help kinhte\` - Kinh tế, điểm danh, ví, ngân hàng, chuyển tiền, top.\n` +
            `🔹 \`!help shop\` - Cửa hàng mua sắm vật phẩm chung.\n` +
            `🔹 \`!help cuoihoi\` - Shop nhẫn, túi đồ, kết hôn.\n` +
            `🔹 \`!help vayno\` - Vay mượn tiền P2P giữa các người chơi.\n` +
            `🔹 \`!help game\` - Minigame Tài Xỉu xí ngầu.`
        );
    }
};