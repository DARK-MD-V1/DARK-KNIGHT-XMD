const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "play",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        // NekoLabs play API
        const api = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.success || !apiRes.result?.downloadUrl) {
            return reply("❌ No results found for your query.");
        }

        const { metadata } = apiRes.result;
        const downloadUrl = apiRes.result.downloadUrl;

        const caption = `
📑 *Title :* ${metadata.title}
⏱ *Duration :* ${metadata.duration}
⏰ *ResponseTime :* ${datadata.responseTime}
📡 *Channel :* ${metadata.channel}
🔗 *Link :* ${metadata.url}

🔢 *Reply Below Number*

1️⃣ *Audio Type*
2️⃣ *Document Type*
3️⃣ *Voice Note*

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: metadata.cover },
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
                            audio: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            ptt: false
                        }, { quoted: receivedMsg });
                        break;

                    case "2":
                        await conn.sendMessage(senderID, {
                            document: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${metadata.title}.mp3`
                        }, { quoted: receivedMsg });
                        break;

                    case "3":
                        await conn.sendMessage(senderID, {
                            audio: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            ptt: true
                        }, { quoted: receivedMsg });
                        break;

                    default:
                        reply("❌ Invalid option! Reply with 1, 2, or 3.");
                }
            }
        });

    } catch (error) {
        console.error("Song Command Error:", error);
        reply("❌ An error occurred while processing your request.");
    }
});
