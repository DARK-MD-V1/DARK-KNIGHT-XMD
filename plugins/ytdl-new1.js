const { cmd, commands } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "song8",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song1 <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        // Search song on YouTube
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // Fetch from Aswin Sparky API
        const api = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.data?.url) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.data;

        // Send video details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: `
🎶 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
👁️ *Views:* ${data.views}
📅 *Released:* ${data.ago}
🔗 *Link:* ${data.url}

🎵 *Downloading Song...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // Send as audio
        await conn.sendMessage(from, {
            audio: { url: result.url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // Also send as document
        await conn.sendMessage(from, {
            document: { url: result.url },
            mimetype: "audio/mpeg",
            fileName: `${result.title || data.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});




cmd({
    pattern: "video8",
    react: "🎬",
    desc: "Download YouTube Video (MP4)",
    category: "download",
    use: ".song1 <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What video do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // 🔗 Aswin Sparky YouTube Video API
        const api = `https://api-aswin-sparky.koyeb.app/api/downloader/ytv?url=${ytUrl}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes?.data?.url) {
            return reply("❌ Couldn't download the video. Try another one!");
        }

        const result = apiRes.data;

        // 🎥 Send thumbnail & details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: `
🎬 *Title:* ${result.title}
⏱️ *Duration:* ${data.timestamp}
👁️ *Views:* ${data.views}
📅 *Uploaded:* ${data.ago}
🔗 *YouTube Link:* ${data.url}

> 📥 Downloading video... Please wait.
> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
            `
        }, { quoted: mek });

        // 🎞️ Send video as MP4
        await conn.sendMessage(from, {
            video: { url: result.url },
            mimetype: "video/mp4",
            fileName: `${result.title}.mp4`,
            caption: `🎧 *${result.title}*\n> Video downloaded successfully!`
        }, { quoted: mek });

        // 📁 Optional: send as document for easier saving
        await conn.sendMessage(from, {
            document: { url: result.url },
            mimetype: "video/mp4",
            fileName: `${result.title}.mp4`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});
