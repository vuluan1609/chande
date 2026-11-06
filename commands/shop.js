module.exports = {
    name: 'shop',
    description: 'Cửa hàng mua sắm',
    async execute(message, args) {
        // Ví dụ: hiển thị danh sách vật phẩm trong shop
        const shopEmbed = {
            color: 0x0099ff,
            title: '🛒 CỬA HÀNG VẬT PHẨM',
            description: 'Sử dụng lệnh `!buy <id_vật_phẩm>` để mua đồ.',
            fields: [
                { name: '1. Thẻ Nhân Đôi XP', value: 'Giá: 500 coin', inline: true },
                { name: '2. Thẻ Đổi Tên', value: 'Giá: 1000 coin', inline: true },
            ],
            timestamp: new Date(),
        };

        return message.reply({ embeds: [shopEmbed] });
    }
};