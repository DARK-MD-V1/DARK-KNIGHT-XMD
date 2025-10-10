const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "song6",
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

        // Starlights API
        const api = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp3?url=${encodeURIComponent(ytUrl)}&format=mp3`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.dl_url) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const downloadUrl = apiRes.dl_url;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: `
ℹ️ *Title :* ${data.title}
⏱️ *Duration :* ${data.timestamp} 
🧬 *Views :* ${data.views}
📅 *Released Date :* ${data.ago}
🖇️ *Link :* ${data.url}
 
🎵 *Downloading Song:* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // Optional: send as document
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});


cmd({
    pattern: "video6",
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

        // Starlights API
        const api = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp4?url=${encodeURIComponent(ytUrl)}&format=360p`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.dl_url) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const downloadUrl = apiRes.dl_url;

        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: `
ℹ️ *Title :* ${data.title}
⏱️ *Duration :* ${data.timestamp} 
🧬 *Views :* ${data.views}
📅 *Released Date :* ${data.ago}
🖇️ *Link :* ${data.url}
 
🎵 *Downloading Song:* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // Send audio
        await conn.sendMessage(from, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            ptt: false,
        }, { quoted: mek });

        // Optional: send as document
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: `${data.title}.mp4`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});
