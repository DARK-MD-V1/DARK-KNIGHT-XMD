const {cmd , commands} = require('../command')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "song5",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song1 <query>",
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

        const api = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${ytUrl}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.data?.download) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.data;

        await conn.sendMessage(from, {
            image: { url: data.image },
            caption: `
ℹ️ *Title :* ${data.title}
⏱️ *Duration :* ${data.duration} 
🧬 *Views :* ${data.views}
🖇️ *Link :* ${data.url}
 
🎵 *Downloading Song:* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: title.download },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });
       
        await conn.sendMessage(from, {
            document : { url: title.download },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });        

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});



cmd({
    pattern: "song6",
    react: "🎵",
    desc: "Download YouTube MP3 via Delirius API",
    category: "download",
    use: ".song5 <song name>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ *Please type a song name!*");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ *No YouTube results found!*");

        const video = search.videos[0];
        const ytUrl = video.url;

        // --- Call Delirius API ---
        const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${ytUrl}`;
        const { data: apiRes } = await axios.get(apiUrl);

        if (!apiRes?.status || !apiRes?.data?.download) {
            return reply("❌ *Couldn't get a download link. Try another song!*");
        }

        const result = apiRes.data;

        // --- Send info first ---
        await conn.sendMessage(from, {
            image: { url: result.thumbnail || video.image },
            caption: `
🎧 *Title:* ${result.title || video.title}
📺 *Channel:* ${result.channel || video.author.name}
🕒 *Duration:* ${result.duration || video.timestamp}
📦 *Size:* ${result.size || 'Unknown'}
🔗 *Link:* ${ytUrl}

> 🎵 Downloading song...
> Powered by *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`
        }, { quoted: mek });

        // --- Send audio file ---
        await conn.sendMessage(from, {
            audio: { url: data.download },
            mimetype: "audio/mpeg",
            fileName: `${result.title || 'song'}.mp3`,
            ptt: false
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in song5 command:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});
