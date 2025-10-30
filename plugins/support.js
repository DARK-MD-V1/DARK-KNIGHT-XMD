const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "support",
    alias : "version",
    desc: " allmenu",
    category: "allmenu",
    react: "🫅",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {

let dec = `    
⟣───────────────⟢
▧ *ᴄʀᴇᴀᴛᴏʀ* : *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
▧ *ᴍᴏᴅᴇ* : *${config.MODE}*
▧ *ᴘʀᴇғɪx* : *${config.PREFIX}*
▧ *ʀᴀᴍ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
▧ *ᴠᴇʀsɪᴏɴ* : *V.2* ⚡
▧ *ᴜᴘᴛɪᴍᴇ* : ${runtime(process.uptime())}

⟣───────────────⟢

> ☣️ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ☣️ 

⟣───────────────⟢

*CHANNEL 🛠️*
https://whatsapp.com/channel/0029VbAM4eo3AzNQZ1WleW3e

*GROUP 👥*
https://chat.whatsapp.com/IGgPW6pTrH14oAWCJALYR5

*𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-owner🧑‍💻*
https://wa.me/+94771825192?text=Support!

⟣───────────────⟢

`;

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
        
        await conn.sendMessage(
            from,
            {
                image: { url: `https://files.catbox.moe/brlkte.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400240662312@newsletter',
                        newsletterName: '𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: FakeVCard });
        
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
    
