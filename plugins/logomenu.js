const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "logo",
    alias: ["logomenu"],
    desc: "menu the bot",
    category: "menu",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `
╭━━〔 🎨 *Logo Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • 3dcomic
┃★│ • 3dpaper
┃★│ • america
┃★│ • angelwings
┃★│ • bear
┃★│ • bulb
┃★│ • boom
┃★│ • birthday
┃★│ • blackpink
┃★│ • cat
┃★│ • clouds
┃★│ • castle
┃★│ • deadpool
┃★│ • dragonball
┃★│ • devilwings
┃★│ • eraser
┃★│ • frozen
┃★│ • futuristic
┃★│ • galaxy
┃★│ • hacker
┃★│ • leaf
┃★│ • luxury
┃★│ • naruto
┃★│ • nigeria
┃★│ • neonlight
┃★│ • paint
┃★│ • pornhub
┃★│ • sans
┃★│ • sunset
┃★│ • sadgirl
┃★│ • thor
┃★│ • tatoo
┃★│ • typography
┃★│ • valorant
┃★│ • zodiac
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷‎`;

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
                        newsletterName: "𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: FakeVCard }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
