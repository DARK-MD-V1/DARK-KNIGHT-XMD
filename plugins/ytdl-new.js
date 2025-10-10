const { cmd, commands } = require('../command');
const yts = require('yt-search');
const axios = require("axios");

cmd({
    pattern: "song1",
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

        // 🔄 NEW API
        const api = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp3?url=${encodeURIComponent(ytUrl)}&format=mp3`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.dl_url) {
            return reply("❌ Unable to download the song. Try another one!");
        }

        const result = apiRes.result;

        // 📸 Send song info
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
🎶 *Title:* ${data.title}
🔗 *Link:* ${data.url}

🎧 *Downloading your song...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎵 Send MP3 audio
        await conn.sendMessage(from, {
            audio: { url: result.dl_url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // 📄 Send MP3 as document too
        await conn.sendMessage(from, {
            document: { url: result.dl_url },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});

