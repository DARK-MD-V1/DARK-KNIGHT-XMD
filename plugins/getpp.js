const { cmd } = require("../command");

cmd({
  pattern: "getdp",
  alias: ["dp"],
  use: "getpp [@user/reply/number]",
  desc: "Get profile picture of a user, mentioned user, or group.",
  category: "tools",
  react: "🖼️",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply, isGroup, quoted, text, mentions }) => {
  try {
    let targetJid;

    // 🧩 1. If reply — get replied user's JID
    if (quoted) {
      targetJid = quoted.sender;

    // 🧩 2. If @mention used — get first mentioned JID
    } else if (mentions && mentions.length > 0) {
      targetJid = mentions[0];

    // 🧩 3. If user types a number (e.g., .getpp 94761234567)
    } else if (text && /^\d{7,15}$/.test(text)) {
      targetJid = `${text}@s.whatsapp.net`;

    // 🧩 4. If in group but no reply/tag/number → group DP
    } else if (isGroup) {
      targetJid = from;

    // 🧩 5. If in DM → own DP
    } else {
      targetJid = sender;
    }

    // 🖼️ Try fetching profile picture
    let imageUrl;
    try {
      imageUrl = await conn.profilePictureUrl(targetJid, "image");
    } catch {
      imageUrl = "https://files.catbox.moe/brlkte.jpg"; // fallback
    }

    // 🧾 Fake vCard (for clean look)
    const fakeVCard = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
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

    // 📝 Caption logic
    let captionText;
    if (targetJid.endsWith("@g.us")) {
      captionText = "👥 Group Display Picture";
    } else {
      captionText = `🖼️ Profile Picture of @${targetJid.split("@")[0]}`;
    }

    // 📤 Send the image
    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: captionText,
      contextInfo: {
        mentionedJid: targetJid.endsWith("@g.us") ? [] : [targetJid],
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
      
