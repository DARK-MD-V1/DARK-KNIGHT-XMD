const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "song22",
    alias: ["ytmp3"],
    desc: "To download songs using Dark-Yasiya API.",
    react: "🎵",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, q, pushname, reply}) => {
try {
    if (!q) return reply("👉 ගීතයේ නම හෝ YouTube link එක දෙන්න.");

    reply("🔎 ගීතය සොයමින් පවතී...");

    // YouTube search
    const search = await yts(q);
    if (!search.videos || search.videos.length === 0) {
        return reply("❌ ගීතයක් සොයාගැනීමට නොහැකි විය.");
    }

    const data = search.videos[0];
    const url = data.url;

    let desc = `
🎶 *MUSIC FOUND!* 🎶

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 
`;

    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

    reply("⬇️ ගීතය download කරමින් පවතී...");

    // Dark-Yasiya API
    let apiRes = await axios.get(
        `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(url)}`
    );
    let json = apiRes.data;

    if (!json || !json.url) {
        return reply("❌ ගීතය ලබාගැනීමට නොහැකි විය. තවත් උත්සාහ කරන්න.");
    }

    let downloadUrl = json.url;

    // Send audio as voice
    await conn.sendMessage(from, { 
        audio: { url: downloadUrl }, 
        mimetype: "audio/mpeg" 
    }, { quoted: mek });

    // Send audio as document
    await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: data.title + ".mp3",
        caption: "✅ *Downloaded via Dark-Yasiya API*"
    }, { quoted: mek });

} catch (e) {
    console.log("SONG2 ERROR:", e);
    reply(`_Hi ${pushname}, system error එකක් ඇති. ටික වේලාවකට පස්සේ retry කරන්න._`);
}
})
