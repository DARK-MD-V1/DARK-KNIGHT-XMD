const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

cmd({
    pattern: "play",
    react: "🎵",
    desc: "Download YouTube MP3 using NekoLabs API",
    category: "download",
    use: ".play <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ Please provide a song name or keywords.\nExample: `.song Lelena`");

        // Search on YouTube (for extra metadata)
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const info = search.videos[0];

        // NekoLabs API request
        const api = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes.success || !apiRes.result?.downloadUrl) {
            return reply("❌ Unable to fetch download link. Please try again later.");
        }

        const meta = apiRes.result.metadata;
        const downloadUrl = apiRes.result.downloadUrl;

        // Send song info card
        await conn.sendMessage(from, {
            image: { url: meta.cover },
            caption: `
📑 *Title :* ${meta.title}
⏱ *Duration :* ${meta.duration}
⏰ *ResponseTime :* ${data.responseTime}
📡 *Channel :* ${meta.channel}
🔗 *Link :* ${meta.url}

🎵 *Downloading Song..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`
        }, { quoted: mek });

        // Send audio (mp3)
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${meta.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        // Also send as document (optional)
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${meta.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
