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
