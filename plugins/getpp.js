const { cmd } = require("../command");

cmd({
  pattern: "getdp",
  desc: "Get profile picture of a user (replied, mentioned, or group)",
  category: "tools",
  react: "🖼️",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply, isGroup, participants }) => {
  try {
    const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const mentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const groupMetadata = isGroup ? await conn.groupMetadata(from) : null;
    let targetJid;

    // 🧍 If replied user
    if (quoted) {
      targetJid = mek.message.extendedTextMessage.contextInfo.participant;
    } 
    // 🧑‍🤝‍🧑 If mentioned user(s)
    else if (mentioned && mentioned.length > 0) {
      targetJid = mentioned[0];
    } 
    // ☎️ If user entered a number manually (e.g. .getpp 94771234567)
    else if (args[0]) {
      const num = args[0].replace(/[^0-9]/g, "");
      if (!num) return reply("⚠️ Invalid number format.\nExample: .getpp 94771234567");
      targetJid = `${num}@s.whatsapp.net`;
    // 👥 If group and no mention/reply, fetch group DP
    else if (isGroup) {
      targetJid = from; // Group JID
    }

    let imageUrl;
    try {
      imageUrl = await conn.profilePictureUrl(targetJid, "image");
    } catch {
      imageUrl = "https://files.catbox.moe/brlkte.jpg"; // default image
    }

    // Caption based on type
    let caption;
    if (isGroup && targetJid === from) {
      caption = `🖼️ Group Profile Picture: *${groupMetadata.subject}*`;
    } else {
      caption = `🖼️ Profile Picture of @${targetJid.split('@')[0]}`;
    }

    const fakeVCard = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃\nORG:dark;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD",
          jpegThumbnail: Buffer.from([])
        }
      }
    };

    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption,
      contextInfo: {
        mentionedJid: isGroup && targetJid !== from ? [targetJid] : [],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳",
          newsletterJid: "120363400240662312@newsletter"
        }
      }
    }, { quoted: fakeVCard });

  } catch (err) {
    console.error("Error in getpp:", err);
    reply("❌ Failed to fetch profile picture. Please try again.");
  }
});



cmd({
  pattern: "getpp",
  desc: "Get profile picture of a user (replied user in group, or DM user)",
  category: "tools",
  react: "🖼️",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply, isGroup }) => {
  try {
    const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const quotedKey = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let targetJid;

    if (isGroup) {
      if (quotedMsg && quotedKey) {
        targetJid = quotedMsg;
      } else {
        return reply("❌ Please reply to someone's message to get their profile picture.");
      }
    } else {
      targetJid = from.endsWith("@s.whatsapp.net") ? from : sender;
    }

    let imageUrl;
    try {
      imageUrl = await conn.profilePictureUrl(targetJid, 'image');
    } catch {
      imageUrl = "https://files.catbox.moe/brlkte.jpg";
    }

    const fakeVCard = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃\nORG:dark;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD",
          jpegThumbnail: Buffer.from([])
        }
      }
    };
  
    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: `🖼️ Profile Picture of @${targetJid.split('@')[0]}`,
      contextInfo: {
        mentionedJid: [targetJid],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳",
          newsletterJid: "120363400240662312@newsletter"
        }
      }
    }, { quoted: fakeVCard });

  } catch (err) {
    console.error("Error in getpp:", err);
    reply("❌ Failed to fetch profile picture.");
  }
});
      
