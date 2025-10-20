const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive2",
    desc: "Check bot is alive or not with interactive buttons",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭───〔 *🤖 ${config.BOT_NAME} STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│
│🧠 *Owner:* ${config.OWNER_NAME}
│⚡ *Version:* 2.0.0
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│💾 *RAM:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│🖥️ *Host:* ${os.hostname()}
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉
> ${config.DESCRIPTION}`;

        // Fake VCard
        const FakeVCard = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=13135550002:+13135550002\nEND:VCARD`
                }
            }
        };

        // Buttons
        const buttons = [
            { buttonId: 'alive_version', buttonText: { displayText: 'Version' }, type: 1 },
            { buttonId: 'alive_uptime', buttonText: { displayText: 'Uptime' }, type: 1 },
            { buttonId: 'alive_ping', buttonText: { displayText: 'Ping' }, type: 1 },
            { buttonId: 'alive_support', buttonText: { displayText: 'Support' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            footer: "© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃",
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                quoted: FakeVCard
            }
        };

        await conn.sendMessage(from, buttonMessage);

        // Listen for button clicks
        conn.on('message.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message) return;

            const buttonId = msg.message?.buttonsResponseMessage?.selectedButtonId;
            if (!buttonId) return;

            switch(buttonId) {
                case 'alive_version':
                    await conn.sendMessage(from, { text: `⚡ Version: 2.0.0` }, { quoted: msg });
                    break;
                case 'alive_uptime':
                    await conn.sendMessage(from, { text: `⌛ Uptime: ${runtime(process.uptime())}` }, { quoted: msg });
                    break;
                case 'alive_ping':
                    const start = Date.now();
                    await conn.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: msg });
                    const latency = Date.now() - start;
                    await conn.sendMessage(from, { text: `🏓 Pong! ${latency}ms` }, { quoted: msg });
                    break;
                case 'alive_support':
                    await conn.sendMessage(from, { text: `💬 Contact Support: wa.me/${config.OWNER_NUMBER}` }, { quoted: msg });
                    break;
            }
        });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
