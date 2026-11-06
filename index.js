require('dotenv').config(); // <-- Đưa cái này lên dòng số 1 đầu tiên!

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Tạo route đơn giản để Render và UptimeRobot ping vào giữ kết nối 24/7
app.get('/', (req, res) => {
    res.send('Bot is alive and running 24/7!');
});

app.listen(PORT, () => {
    console.log(`Server đang lắng nghe trên cổng ${PORT}`);
});

// --- Phần code Discord Bot và MongoDB bên dưới ---
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