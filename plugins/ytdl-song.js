const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require("axios");

cmd({
    pattern: "song2",
    alias: ["ytmp3"],
    desc: "To download songs.",
    react: "🎵",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from, q, pushname, reply
}) => {
    try {
        if (!q) return reply("Please provide a YouTube title or URL 🎶");

        // 🔍 Search on YouTube
        const search = await yts(q);
        const data = search.videos[0];
        if (!data) return reply("No results found.");

        const url = data.url;

        let desc = `
*⫷ DARK-KNIGHT-XMD ⫸*

🎵 *MUSIC FOUND!* 

➥ *Title:* ${data.title}
➥ *Duration:* ${data.timestamp}
➥ *Views:* ${data.views}
➥ *Uploaded On:* ${data.ago}
➥ *Link:* ${data.url}

🎧 *Downloading...*
        `;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // 🌍 API request
        let { data: json } = await axios.get(`https://api.giftedtech.web.id/api/download/ytmp3`, {
            params: {
                apikey: "gifted",
                url
            }
        });

        if (!json || !json.success) {
            return reply("⚠️ Failed to fetch audio from API. Try again later.");
        }

        let downloadUrl = json.result.download_url;

        // 🎧 Send as audio
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });

        // 📂 Send as document (optional)
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: json.result.title + ".mp3",
            caption: "*© DARK-KNIGHT-XMD*"
        }, { quoted: mek });

    } catch (e) {
        console.error("Song2 Command Error:", e);
        reply(`_Hi ${pushname}, something went wrong. Please try again later._`);
    }
});
