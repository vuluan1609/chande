require('dotenv').config();

const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is alive!');
});
server.listen(process.env.PORT || 3000);

process.on('unhandledRejection', error => {
    console.error('Lỗi chưa được bắt (Unhandled promise rejection):', error);
});


const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { startBankInterestCron } = require('./services/bankService');

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://dungluanly_db_user:VuLuan.1609@chandebot.n01ywd2.mongodb.net/chandebot_db?retryWrites=true&w=majority")
.then(() => {
    console.log('✅ Đã kết nối MongoDB Atlas thành công!');
    // Kích hoạt tiến trình chạy ngầm tính lãi suất ngân hàng
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

// Tự động load tất cả các file lệnh trong thư mục commands
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
        // Thực thi lệnh và bọc try-catch cô lập lỗi tuyệt đối không sập bot
        await command.execute(message, args, commandName);
    } catch (error) {
        console.error(`❌ Lỗi khi chạy lệnh ${commandName}:`, error);
        return message.reply('❌ Đã xảy ra lỗi khi thực thi lệnh này, vui lòng thử lại sau!').catch(() => {});
    }
});

client.login(process.env.DISCORD_TOKEN);

