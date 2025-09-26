const {cmd , commands} = require('../command')
const yts = require('yt-search')
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

        await reply("🔍 *Searching for your song, please wait...*");

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
            caption: `╸╸╸╸╸╸╸╸╸╸╸╸╸
        
*ℹ️ Title :* \`${data.title}\`
*⏱️Duration :* ${data.timestamp} 
*🧬 Views :* ${data.views}
📅 *Released Date :* ${data.ago}
 
╸╸╸╸╸╸╸╸╸╸╸╸╸

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: result.download },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});

cmd({
    pattern: "video1",
    react: "🎵",
    desc: "Download YouTube MP4",
    category: "download",
    use: ".video1 <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What video do you want to download?");

        await reply("🔍 *Searching for your video, please wait...*");

        const yts = require('yt-search');
        const search = await yts(q);
        
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;
        const ago = data.ago;

        const api = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${ytUrl}&format=360&apikey=sadiya`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.download) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.result;

        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `╸╸╸╸╸╸╸╸╸╸╸╸╸
        
*ℹ️ Title :* \`${data.title}\`
*⏱️Duration :* ${data.timestamp} 
*🧬 Views :* ${data.views}
📅 *Released Date :* ${data.ago}
 
╸╸╸╸╸╸╸╸╸╸╸╸╸

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            video: { url: result.download },
            mimetype: "video/mp4",
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});

cmd({
    pattern: "video3",
    alias: ["mp4"],
    desc: "To download videos.",
    react: "🎥",
    category: "download",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try {
    if (!q) return reply("Please give me a url or title");

    const search = await yts(q);
    const data = search.videos[0];
    const url = data.url;

    let desc = `
*⫷⦁𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 download⦁⫸*

🎥 *VⵊDEO FOUND!* 

➥ *Title:* ${data.title} 
➥ *Duration:* ${data.timestamp} 
➥ *Views:* ${data.views} 
➥ *Uploaded On:* ${data.ago} 
➥ *Link:* ${data.url} 

🎬 *VIDEO DOWNLOAD*

> *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳* 
`;

    await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

    // Use new API
    let apiRes = await fetch(`https://api.giftedtech.web.id/api/download/ytvid?apikey=gifted&quality=480p&url=${encodeURIComponent(url)}`);
    let json = await apiRes.json();

    if (!json.success) return reply("Failed to fetch video from new API");

    let downloadUrl = json.result.download_url;

    await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
    await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: "video/mp4",
        fileName: json.result.title + ".mp4",
        caption: "*© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*"
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`_Hi ${pushname}, retry later_`);
}
})
    
