const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "facebook",
  alias: ["fb"], 
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Facebook video URL." }, { quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Fetching data from Aswin API
    const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data?.status || !data?.data) {
      return reply("⚠️ Failed to retrieve Facebook media. Please check the link and try again.");
    }

    const { title, thumbnail, low, high } = data.data;

    const caption = `
📺 *Facebook Downloader.* 📥

📑 *Title:* ${title || "No title"}
🔗 *Link:* ${q}

🔢 *Reply Below Number*

1️⃣ *SD Qᴜᴀʟɪᴛʏ*🪫
2️⃣ *HD Qᴜᴀʟɪᴛʏ*🔋
3️⃣ *Aᴜᴅɪᴏ (MP3)*🎶

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    // 🧠 Interactive Reply System
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: low },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: high },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3": 
            await conn.sendMessage(senderID, { 
              audio: { url: low || high }, 
              mimetype: "audio/mp4", 
              ptt: false 
          }, { quoted: receivedMsg }); 
          break;
            
           default:
            reply("❌ Invalid option! Please reply with 1, 2, or 3.");
        }
      }
    });

  } catch (error) {
    console.error("Facebook Plugin Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});


cmd({
  pattern: "facebook2",
  alias: ["fb2"], 
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Facebook video Url." }, { quoted: m });
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // ✅ Use the new universal downloader API
    const response = await axios.get(`https://lance-frank-asta.onrender.com/api/downloader?url=${q}`);
    const res = response.data;

    if (!res || !res.content || !res.content.status) {
      return reply("⚠️ Failed to retrieve video. Please check the link and try again.");
    }

    const content = res.content;
    const resultArray = content.data?.result || [];

    if (!resultArray.length) {
      return reply("❌ No downloadable media found.");
    }

    // Extract HD and SD URLs
    const hdVideo = resultArray.find(v => v.quality?.toUpperCase() === "HD")?.url;
    const sdVideo = resultArray.find(v => v.quality?.toUpperCase() === "SD")?.url;

    const thumbnail = "https://i.ibb.co/DHHqXNPK/imgbb-1761705217881.png" || "https://files.catbox.moe/36ndl3.jpg";
    
    const caption = `
📺 *Facebook Downloader.* 📥

🔗 *Link:* ${q}

🔢 *Reply Below Number*

1️⃣ *SD Quality*🪫
2️⃣ *HD Quality*🔋
3️⃣ *Aᴜᴅɪᴏ (MP3)*🎶

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    // 🧠 Handle reply-based selection
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
          case "1":
            if (!sdVideo) return reply("❌ SD video not available.");
            await conn.sendMessage(senderID, {
              video: { url: sdVideo },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            if (!hdVideo) return reply("❌ HD video not available.");
            await conn.sendMessage(senderID, {
              video: { url: hdVideo },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3": 
            await conn.sendMessage(senderID, { 
              audio: { url: sdVideo || hdVideo }, 
              mimetype: "audio/mp4", 
              ptt: false 
          }, { quoted: receivedMsg }); 
          break;          
          
          default:
            reply("❌ Invalid option! Please reply with 1, 2, or 3.");
        }
      }
    });

  } catch (error) {
    console.error("Downloader Plugin Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
