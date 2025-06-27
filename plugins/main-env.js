const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

function isEnabled(value) {
    // Function to check if a value represents a "true" boolean state
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "setting",
    alias: ["setting"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply, isCreator }) => {
    try {
        // Owner check
        if (!isCreator) {
            return reply("🚫 *Owner Only Command!* You're not authorized to view bot configurations.");
        }

        const isEnabled = (value) => value && value.toString().toLowerCase() === "true";

        let envSettings = `
╭───『 *${config.BOT_NAME} CONFIG* 』───❏
│
├─❏ *⚙️ SETTINGS*
│
├─∘ 🔧 *1. Mode*
│       - Current Status: ${config.MODE || "public"}
│       - Usage: ${config.PREFIX}mode private/public
│
├─∘ 🎯 *2. Auto Typing*
│       - Current Status: ${config.AUTO_TYPING || "off"}
│       - Usage: ${config.PREFIX}autotyping on/off
│
├─∘ 🌐 *3. Always Online*
│       - Current Status: ${config.ALWAYS_ONLINE || "off"}
│       - Usage: ${config.PREFIX}alwaysonline on/off
│
├─∘ 🎙️ *4. Auto Recording*
│       - Current Status: ${config.AUTO_RECORDING || "off"}
│       - Usage: ${config.PREFIX}autorecording on/off
│
├─∘ 📖 *5. Auto Read Status*
│       - Current Status: ${config.AUTO_STATUS_REACT || "off"}
│       - Usage: ${config.PREFIX}autoreadstatus on/off
│
├─∘ 🚫 *6. Anti Bad Word*
│       - Current Status: ${config.ANTI_BAD_WORD || "off"}
│       - Usage: ${config.PREFIX}antibad on/off
│
├─∘ 🗑️ *#. Anti Delete*
│       - Current Status: ${config.ANTI_BAD_WORD || "off"}
│       - Usage: ${config.PREFIX}antidelete on/off
│
├─∘ 🖼️ *7. Auto Sticker*
│       - Current Status: ${config.AUTO_STICKER || "off"}
│       - Usage: ${config.PREFIX}autosticker on/off
│
├─∘ 💬 *8. Auto Reply*
│       - Current Status: ${config.AUTO_REPLY || "off"}
│       - Usage: ${config.PREFIX}autoreply on/off
│
├─∘ ❤️ *9. Auto React*
│       - Current Status: ${config.AUTO_REACT || "off"}
│       - Usage: ${config.PREFIX}autoreact on/off
│
├─∘ 📢 *10. Status Reply*
│       - Current Status: ${config.AUTO_STATUS_REPLY || "off"}
│       - Usage: ${config.PREFIX}autostatusreply on/off
│
├─∘ 🔗 *11. Anti Link*
│        - Current Status: ${config.ANTI_LINK || "off"}
│        - Usage: ${config.PREFIX}antilink on/off
│
├─∘ 🤖 *12. Anti Bot*
│        - Current Status: ${antibotAction || "off"}
│        - Usage: ${config.PREFIX}antibot off/warn/delete/kick
│
├─∘ 💖 *13. Heart React*
│        - Current Status: ${config.HEART_REACT || "off"}
│        - Usage: ${config.PREFIX}heartreact on/off
│
├─∘ 🔧 *14. Set Prefix*
│        - Current Prefix: ${config.PREFIX || "."}
│        - Usage: ${config.PREFIX}setprefix <new_prefix>
│
├─∘ 📊 *15. Poll*
│        - Usage: ${config.PREFIX}poll question;option1,option2,...
│
├─∘ 💞 *16. Random Ship*
│        - Usage: ${config.PREFIX}randomship
│
├─∘ 👥 *17. New Group*
│        - Usage: ${config.PREFIX}newgc group_name;number1,number2,...
│
├─∘ 🚪 *18. Exit Group*
│        - Usage: ${config.PREFIX}exit
│
├─∘ 🔗 *19. Group Invite Link*
│        - Usage: ${config.PREFIX}invite2
│
├─∘ 📢 *20. Broadcast*
│        - Usage: ${config.PREFIX}broadcast <text>
│
├─∘ 🖼️ *21. Set Group Profile Picture*
│        - Usage: ${config.PREFIX}setgrouppp (reply to an image)
│
├─∘ 📌 *Note*: Replace "on/off" with the desired state to enable or disable a feature.
│
╰───『 *${config.DESCRIPTION}* 』───❏
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek });

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});
