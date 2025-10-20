const {cmd , commands} = require('../command')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "song2",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song2 <query>",
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
    pattern: "video4",
    react: "🎬",
    desc: "Download YouTube video as MP4 (360p)",
    category: "download",
    use: ".video4 <query or YouTube link>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ Please provide a YouTube link or search query!");

        // 🔍 YouTube Search (if not a direct link)
        let ytUrl;
        if (q.includes('youtube.com') || q.includes('youtu.be')) {
            ytUrl = q;
        } else {
            const search = await yts(q);
            if (!search.videos.length) return reply("❌ No videos found for your query.");
            ytUrl = search.videos[0].url;
        }

        reply("🔎 Fetching video info... Please wait!");

        // 🧩 Fetch data from Zenzxz API
        const api = `https://api.zenzxz.my.id/api/downloader/ytmp4?url=${encodeURIComponent(ytUrl)}&resolution=360p`;
        const { data: apiRes } = await axios.get(api);

        // ⚠️ Validate response
        if (!apiRes?.success || !apiRes?.data?.download_url) {
            return reply("❌ Failed to fetch download link. Try again later!");
        }

        const vid = apiRes.data;

        // 🖼️ Send video info card
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: `
🎬 *${vid.title}*

📀 *Quality:* ${vid.format || "360p"}
⏱️ *Duration:* ${vid.duration ? `${Math.floor(vid.duration / 60)}m ${vid.duration % 60}s` : "N/A"}
🔗 *Link:* ${ytUrl}

> 🎥 *Downloading your video...* ⏳
> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ⚡
`
        }, { quoted: mek });

        // 🎞️ Send video
        await conn.sendMessage(from, {
            video: { url: vid.download_url },
            mimetype: "video/mp4",
            caption: `✅ *Here is your video!* 🎬\n🎵 ${vid.title}`
        }, { quoted: mek });

        // 💾 Also send as document (optional)
        await conn.sendMessage(from, {
            document: { url: vid.download_url },
            mimetype: "video/mp4",
            fileName: `${vid.title.replace(/[^\w\s]/gi, '')}.mp4`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
