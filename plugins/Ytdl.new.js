const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "test",
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

        // Use Zenzxz API
        const api = `https://api.zenzxz.my.id/api/downloader/ytmp3v2?url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.success || !apiRes.data?.download_url) {
            return reply("❌ Unable to download the song. Please try another one!");
        }

        const result = apiRes.data;

        // Format caption
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

        // Send song info with thumbnail
        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

        // Reply listener (removed after one use)
        const handler = async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const senderID = receivedMsg.key.remoteJid;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (!isReplyToBot) return;

            // Remove listener to avoid multiple triggers
            conn.ev.off("messages.upsert", handler);

            await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

            switch (receivedText.trim()) {
                case "1":
                    await conn.sendMessage(senderID, {
                        audio: { url: result.download_url },
                        mimetype: "audio/mpeg",
                        ptt: false,
                    }, { quoted: receivedMsg });
                    break;

                case "2":
                    await conn.sendMessage(senderID, {
                        document: { url: result.download_url },
                        mimetype: "audio/mpeg",
                        fileName: `${data.title}.mp3`
                    }, { quoted: receivedMsg });
                    break;

                case "3":
                    await conn.sendMessage(senderID, {
                        audio: { url: result.download_url },
                        mimetype: "audio/mpeg",
                        ptt: true,
                    }, { quoted: receivedMsg });
                    break;

                default:
                    reply("❌ Invalid option! Please reply with 1, 2, or 3.");
            }
        };

        conn.ev.on("messages.upsert", handler);

    } catch (error) {
        console.error("Song Plugin Error:", error);
        reply("❌ An error occurred while processing your request. Please try again later.");
    }
});



cmd({
    pattern: "teset2",
    react: "🎥",
    desc: "Download YouTube video in MP4 format (720p)",
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

        // 🆕 Using Zenzxz API v2
        const api = `https://api.zenzxz.my.id/api/downloader/ytmp4v2?url=${encodeURIComponent(ytUrl)}&resolution=720`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.success || !apiRes.data?.download_url) {
            return reply("❌ Unable to download the video. Please try another one!");
        }

        const result = apiRes.data;

        // 📸 Send thumbnail + info first
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
🎬 *Title:* ${result.title}
🕒 *Duration:* ${(result.duration / 60).toFixed(2)} minutes
🎥 *Quality:* ${result.format}
📆 *Released:* ${data.ago}
📊 *Views:* ${data.views}
🔗 *Link:* ${data.url}

🎞️ *Downloading video...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎥 Send playable video
        await conn.sendMessage(from, {
            video: { url: result.download_url },
            mimetype: "video/mp4",
            caption: `🎬 ${result.title}`,
        }, { quoted: mek });

        // 📁 Send as document for download
        await conn.sendMessage(from, {
            document: { url: result.download_url },
            mimetype: "video/mp4",
            fileName: `${result.title}.mp4`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});



cmd({
    pattern: "test2",
    react: "🎥",
    desc: "Download YouTube MP4 video",
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

        // 🆕 Using Sadiya-Tech API for MP4 download
        const api = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${encodeURIComponent(ytUrl)}&format=360&apikey=sadiya`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.download) {
            return reply("❌ වීඩියෝව බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.result;

        // 🖼️ Send info message with thumbnail
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
🎬 *Title:* ${result.title}
🕒 *Duration:* ${(result.duration / 60).toFixed(2)} minutes
🎥 *Quality:* ${result.quality || result.format}p
📆 *Released:* ${data.ago}
📊 *Views:* ${data.views}
🔗 *Link:* ${data.url}

🎞️ *Downloading video...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎥 Send playable video
        await conn.sendMessage(from, {
            video: { url: result.download },
            mimetype: "video/mp4",
            caption: `🎬 ${result.title}`,
        }, { quoted: mek });

        // 📁 Send as downloadable MP4 document
        await conn.sendMessage(from, {
            document: { url: result.download },
            mimetype: "video/mp4",
            fileName: `${result.title}.mp4`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
