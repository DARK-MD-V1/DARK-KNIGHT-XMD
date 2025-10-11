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

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // 🆕 Use Delirius API
        const api = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${ytUrl}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.data?.download?.url) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.data;

        // Send song details
        await conn.sendMessage(from, {
            image: { url: result.image_max_resolution || result.image },
            caption: `
🎵 *Title:* ${result.title}
👤 *Artist:* ${result.author}
📅 *Category:* ${result.category}
👁️ *Views:* ${result.views}
👍 *Likes:* ${result.likes}
💬 *Comments:* ${result.comments}
🕒 *Duration:* ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}
📦 *File Size:* ${result.download.size}
🎧 *Quality:* ${result.download.quality}

🔗 *YouTube:* ${ytUrl}

> 🎶 *Downloading... Please wait* ⏳
> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`
        }, { quoted: mek });

        // Send MP3 audio
        await conn.sendMessage(from, {
            audio: { url: result.download.url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // Optional: Send as document for file download
        await conn.sendMessage(from, {
            document: { url: result.download.url },
            mimetype: "audio/mpeg",
            fileName: result.download.filename
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ Error: ${error.message}`);
    }
});
