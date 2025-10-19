const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "twitter",
  desc: "Download Twitter videos and audio",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Using the Sadiya API
    const response = await axios.get(`https://sadiya-tech-apis.vercel.app/download/twitterdl?url=${q}&apikey=sadiya`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter media. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd, audio } = data.result;

    const caption = `╭━━━〔 *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ᴛᴡɪᴛᴛᴇʀ ᴅʟ* 〕━━━⊷
┃▸ *Dᴇsᴄʀɪᴘᴛɪᴏɴ:* ${desc || "No description"}
╰━━━⪼

🌐 *Download Options:*
1️⃣  *SD Qᴜᴀʟɪᴛʏ*
2️⃣  *HD Qᴜᴀʟɪᴛʏ*
3️⃣  *Aᴜᴅɪᴏ (MP3)*
4️⃣  *Aᴜᴅɪᴏ ᴀs ᴅᴏᴄᴜᴍᴇɴᴛ*
5️⃣  *Vᴏɪᴄᴇ ɴᴏᴛᴇ*

↪️ *Reply with the number to download your choice.*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    // 🧠 Reply-based selector
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⬇️', key: receivedMsg.key } });

        switch (receivedText.trim()) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              audio: { url: audio },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              document: { url: audio },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 *Audio Downloaded as Document*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: audio },
              mimetype: "audio/mp4",
              ptt: false
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.");
        }
      }
    });

  } catch (error) {
    console.error("Twitter Plugin Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});


cmd({
  pattern: "twitter2",
  alias: ["twitt2"],
  desc: "Download Twitter videos (SD & HD)",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Fetching from Aswin Sparky API
    const response = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/twiter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.data) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { thumbnail, SD, HD } = data.data;

    const caption = `╭━━━〔 *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ᴛᴡɪᴛᴛᴇʀ ᴅʟ* 〕━━━⊷
┃▸ *Tᴡɪᴛᴛᴇʀ ᴠɪᴅᴇᴏ ᴅᴇᴛᴇᴄᴛᴇᴅ!*
╰━━━⪼

🌐 *Download Options:*
1️⃣  *SD Qᴜᴀʟɪᴛʏ*
2️⃣  *HD Qᴜᴀʟɪᴛʏ*
3️⃣  *Aᴜᴅɪᴏ (MP3)*

↪️ *Reply with 1, 2 or 3 to choose your format.*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    // 🧠 Listen for user's reply
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⬇️', key: receivedMsg.key } });

        switch (receivedText.trim()) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: SD },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: HD },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: HD || SD },
              mimetype: "audio/mp4",
              ptt: false
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, or 5.");
        }
      }
    });

  } catch (error) {
    console.error("Twitter Plugin Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
