const { cmd } = require('../command')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "song5",
    react: "🎶",
    desc: "Download YouTube song as MP3 (Starlight API)",
    category: "download",
    use: ".song2 <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ Please enter a song name or YouTube link!");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const video = search.videos[0];
        const ytUrl = video.url;

        // 🎧 Fetch from Starlight API
        const api = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp3?url=${ytUrl}&format=mp3`;
        const { data } = await axios.get(api);

        if (!data || !data.dl_url) {
            return reply("❌ Failed to download song! Try again later.");
        }

        // 🎵 Send details first
        await conn.sendMessage(from, {
            image: { url: data.thumbnail || video.thumbnail },
            caption: `
🎶 *Title:* ${data.title}
👤 *Artist:* ${data.author}
📺 *YouTube:* ${data.url}
🎧 *Quality:* ${data.quality?.toUpperCase() || 'MP3'}

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ⚡
`
        }, { quoted: mek });

        // 🎧 Send audio file
        await conn.sendMessage(from, {
            audio: { url: data.dl_url },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`,
            ptt: false
        }, { quoted: mek });

        // 📁 Optional: send as document too
        await conn.sendMessage(from, {
            document: { url: data.dl_url },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});



cmd({
    pattern: "song11",
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

        const api = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${ytUrl}&format=mp3&apikey=sadiya`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.download) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.result;

        // Ask user to choose format
        await reply(`Choose format for download:\n1️⃣ Audio\n2️⃣ Document`);

        // Wait for user's reply
        const filter = (response) => response.from === from && ['1', '2'].includes(response.text);
        const collected = await conn.waitMessage(filter, { timeout: 60000 }); // 60 sec timeout

        if (!collected) return reply("❌ Time out. Please try again.");

        const choice = collected.text;

        // Send song info
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
ℹ️ *Title :* ${data.title}
⏱️ *Duration :* ${data.timestamp} 
🧬 *Views :* ${data.views}
📅 *Released Date :* ${data.ago}
🖇️ *Link :* ${data.url}
`
        }, { quoted: mek });

        if (choice === '1') {
            // Send as audio
            await conn.sendMessage(from, {
                audio: { url: result.download },
                mimetype: "audio/mpeg",
                ptt: false,
            }, { quoted: mek });
        } else if (choice === '2') {
            // Send as document
            await conn.sendMessage(from, {
                document: { url: result.download },
                mimetype: "audio/mpeg",
                fileName: `${data.title}.mp3`
            }, { quoted: mek });
        }

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});

