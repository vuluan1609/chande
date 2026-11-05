require('dotenv').config();
const http = require('http');

// Khởi tạo HTTP server ngay lập tức để Render nhận diện port
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is alive and running 24/7!');
});

server.listen(PORT, () => {
    console.log(`🌐 HTTP Server đang lắng nghe trên cổng ${PORT}`);
});

// --- Phần code Discord Bot và MongoDB giữ nguyên bên dưới ---
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { startBankInterestCron } = require('./services/bankService');

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('✅ Đã kết nối MongoDB Atlas thành công!');
    startBankInterestCron();
})
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();
const PREFIX = '!';

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    if (command.aliases) {
        command.aliases.forEach(alias => client.commands.set(alias, command));
    }
}

client.once('ready', () => {
    console.log(`🤖 Bot [ ${client.user.tag} ] đã sẵn sàng hoạt động 24/7!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args, commandName);
    } catch (error) {
        console.error(`❌ Lỗi khi chạy lệnh ${commandName}:`, error);
        return message.reply('❌ Đã xảy ra lỗi khi thực thi lệnh này, vui lòng thử lại sau!').catch(() => {});
    }
});

client.login(process.env.DISCORD_TOKEN);