const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "song1",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${encodeURIComponent(ytUrl)}&format=mp3&apikey=sadiya`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.download) {
            return reply("❌ Unable to download the song. Please try another one!");
        }

        const result = apiRes.result;

        const caption = `
📑 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📆 *Uploaded:* ${data.ago}
📊 *Views:* ${data.views}
🔗 *Link:* ${data.url}

🔢 *Reply Below Number*

1️⃣ *Audio Type*
2️⃣ *Document Type*
3️⃣ *Voice Note*
 
> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

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
                        audio: { url: result.download },
                        mimetype: "audio/mpeg",
                        ptt: false,
                    }, { quoted: receivedMsg });
                    break;

                case "2":
                    await conn.sendMessage(senderID, {
                        document: { url: result.download },
                        mimetype: "audio/mpeg",
                        fileName: `${data.title}.mp3`
                    }, { quoted: receivedMsg });
                    break;

                case "3":
                    await conn.sendMessage(senderID, {
                        audio: { url: result.download },
                        mimetype: "audio/mpeg",
                        ptt: true,
                    }, { quoted: receivedMsg });
                    break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, or 3.");
        }
      }
    });

  } catch (error) {
    console.error("Song Command Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});


