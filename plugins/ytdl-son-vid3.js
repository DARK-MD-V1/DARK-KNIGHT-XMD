const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video3",
    react: "🎬",
    desc: "Download YouTube mp4",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What video do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // GiftedTech API
        const api = `https://api.giftedtech.co.ke/api/download/dlmp4?apikey=gifted&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.success || !apiRes.result?.download_url) {
            return reply("❌ Unable to download the video. Please try another one!");
        }

        const result = apiRes.result;

        const caption = `
📑 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📆 *Uploaded:* ${data.ago}
📊 *Views:* ${data.views}
🔗 *Link:* ${data.url}

🔢 *Reply Below Number*

1️⃣ *Video Type*
2️⃣ *Document Type*

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail || data.thumbnail },
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
                            video: { url: result.download_url },
                            mimetype: "video/mp4",
                        }, { quoted: receivedMsg });
                        break;

                    case "2":
                        await conn.sendMessage(senderID, {
                            document: { url: result.download_url },
                            mimetype: "video/mp4",
                            fileName: `${result.title}.mp4`
                        }, { quoted: receivedMsg });
                        break;

                    default:
                        reply("❌ Invalid option! Reply with 1, or 2.");
                }
            }
        });

    } catch (error) {
        console.error("Video Command Error:", error);
        reply("❌ An error occurred while processing your request.");
    }
});
