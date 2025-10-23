const { cmd, commands } = require('../command');
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

        // 🔗 Use Zenzxz API
        const api = `https://api.zenzxz.my.id/api/downloader/ytmp3v2?url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.success || !apiRes.data?.download_url) {
            return reply("❌ Unable to download the song. Please try another one!");
        }

        const result = apiRes.data;

        // 🎵 Send info message with thumbnail
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
📑 *Title:* ${result.title}
⏱️ *Duration:* ${(result.duration / 60).toFixed(2)} minutes
🎧 *Format:* ${result.format.toUpperCase()}
📆 *Uploaded:* ${data.ago}
📊 *Views:* ${data.views}
🔗 *Link:* ${data.url}

🎵 *Downloading your song...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎧 Send as audio
        await conn.sendMessage(from, {
            audio: { url: result.download_url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // 📁 Send as downloadable MP3 file
        await conn.sendMessage(from, {
            document: { url: result.download_url },
            mimetype: "audio/mpeg",
            fileName: `${result.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});



cmd({
    pattern: "test2",
    react: "🎥",
    desc: "Download YouTube video as MP4",
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

        // 🆕 Use Zenzxz API for MP4
        const api = `https://api.zenzxz.my.id/api/downloader/ytmp4?url=${encodeURIComponent(ytUrl)}&resolution=720p`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.success || !apiRes.data?.download_url) {
            return reply("❌ Unable to download the video. Please try another one!");
        }

        const result = apiRes.data;

        // 🎬 Send video info with thumbnail first
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
🎬 *Title:* ${result.title}
🕒 *Duration:* ${(result.duration / 60).toFixed(2)} minutes
📊 *Views:* ${data.views}
📆 *Released:* ${data.ago}
🎥 *Quality:* ${result.format}
🔗 *Link:* ${data.url}

🎞️ *Downloading video...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎥 Send as playable video
        await conn.sendMessage(from, {
            video: { url: result.download_url },
            mimetype: "video/mp4",
            caption: `🎬 ${result.title}`,
        }, { quoted: mek });

        // 📁 Also send as downloadable file
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

