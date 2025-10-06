const config = require('../config');
const { cmd } = require('../command');
const fetch = require("node-fetch");
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 

// 🎬 YouTube Video Downloader (song) 
cmd({
    pattern: "song4",
    alias: ["video2", "ytv2"],
    react: "🎬",
    desc: "Download YouTube video",
    category: "downloader",
    use: ".song <query/url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("🎬 Please provide video name/URL");
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
        
        const yt = await ytsearch(q);
        if (!yt?.results?.length) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("No results found");
        }
        
        const vid = yt.results[0];
        const apiKey = config.API_KEY || "58b3609c238b2b6bb6";
        const api = `https://api.nexoracle.com/downloader/yt-video2?apikey=${apiKey}&url=${encodeURIComponent(vid.url)}`;
        
        const res = await fetch(api);
        const json = await res.json();
        
        if (!json?.status || !json.result?.url) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("Download failed");
        }
        
        const caption = `
╭─〔*𝙱𝙾𝚈𝚇𝙰-𝚇𝙳 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁*〕
├─▸ *📌 ᴛɪᴛʟᴇ:* ${vid.title}
├─▸ *⏳ ᴅᴜʀᴀᴛɪᴏɴ:* ${vid.timestamp}
├─▸ *👀 ᴠɪᴇᴡs:* ${vid.views}
├─▸ *👤 ᴀᴜᴛʜᴏʀ:* ${vid.author.name}
╰──➤ *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙱𝙾𝚈𝙺𝙰-𝙼𝚇𝙳*`;

        await conn.sendMessage(from, {
            video: { url: json.result.url },
            caption: caption
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
        
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("Error occurred");
    }
});

// 🎥 YouTube Video Downloader 
