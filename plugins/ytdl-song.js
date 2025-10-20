const {cmd , commands} = require('../command')
const yts = require('yt-search')
const axios = require("axios");


cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        const yts = require('yt-search');
        const search = await yts(q);
        
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;
        const ago = data.ago;

        const api = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${ytUrl}&format=mp3&apikey=sadiya`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.download) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.result;

        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
📑 *Title :* ${data.title}
⏱️ *Duration :* ${data.timestamp} 
📊 *Views :* ${data.views}
📆 *Released :* ${data.ago}
🔗 *Link :* ${data.url}
 
🎵 *Downloading Song..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: result.download },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });
       
        await conn.sendMessage(from, {
            document : { url: result.download },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });        

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});


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
📑 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📊 *Views:* ${data.views}
📆 *Released:* ${data.ago}
🔗 *Link:* ${data.url}

🎵 *Downloading Song..* ⏳

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
