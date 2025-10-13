const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require("axios")

cmd({
    pattern: "song7",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        // 🔍 Search YouTube video
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // 🧩 New API (Zenzxz)
        const api = `https://api.zenzxz.my.id/downloader/ytmp3v2?url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        // ⚠️ Validate response
        if (!apiRes?.status || !apiRes.download_url) {
            return reply("❌ Unable to download this song. Try another one!");
        }

        // 🖼️ Send song info first
        await conn.sendMessage(from, {
            image: { url: apiRes.thumbnail || data.thumbnail },
            caption: `
📑 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📊 *Views:* ${data.views}
📆 *Released:* ${data.ago}
🔗 *Link:* ${ytUrl}

🎵 *Downloading Song..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎶 Send as audio
        await conn.sendMessage(from, {
            audio: { url: apiRes.download_url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // 📄 Send also as document
        await conn.sendMessage(from, {
            document: { url: apiRes.download_url },
            mimetype: "audio/mpeg",
            fileName: `${apiRes.title || data.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});



cmd({
    pattern: "video7",
    react: "🎬",
    desc: "Download YouTube Video (MP4)",
    category: "download",
    use: ".video7 <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ Please provide a video name or YouTube link!");

        // 🔍 Search YouTube if not a direct link
        let ytUrl = q;
        if (!q.includes("youtube.com") && !q.includes("youtu.be")) {
            const search = await yts(q);
            if (!search.videos.length) return reply("❌ No results found for your query.");
            ytUrl = search.videos[0].url;
        }

        // 🧩 Fetch video info & download link
        const api = `https://api.zenzxz.my.id/downloader/ytmp4v2?url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        // ⚠️ Validate API response
        if (!apiRes?.status || !apiRes.download_url) {
            return reply("❌ Unable to download this video. Try another one!");
        }

        // 🖼️ Send info message first
        await conn.sendMessage(from, {
            image: { url: apiRes.thumbnail },
            caption: `
🎞️ *Title:* ${apiRes.title}
🕒 *Duration:* ${apiRes.duration} seconds
💾 *Quality:* ${apiRes.format}
🔗 *Link:* ${ytUrl}

🎬 *Downloading Video..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎥 Send as video file
        await conn.sendMessage(from, {
            video: { url: apiRes.download_url },
            mimetype: "video/mp4",
            caption: `${apiRes.title}`
        }, { quoted: mek });

        // 📦 Send also as document (optional)
        await conn.sendMessage(from, {
            document: { url: apiRes.download_url },
            mimetype: "video/mp4",
            fileName: `${apiRes.title}.mp4`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
