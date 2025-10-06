const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

// 📌 SONG DOWNLOAD COMMAND

cmd({
    pattern: "song",
    desc: "Download song from YouTube",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Usage: *.song shape of you*");

        let video;
        if (q.includes("youtube.com") || q.includes("youtu.be")) {
            video = { url: q };
        } else {
            const search = await yts(q);
            if (!search || !search.videos.length) return reply("❌ No results found.");
            video = search.videos[0];
        }

        // Inform user
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `
 🔖 *Title :* ${video.title}
 ⏱️ *Duration :* ${video.timestamp} 
 🧬 *Views :* ${video.views}
 📅 *Released Date :* ${video.ago}
 🖇️ *Link :* ${video.url}

 📌 පොඩ්ඩක් වෙලා ඉන්න song එක එනකම්.

 Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
 `}, { quoted: m });

        // API link
        const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=mp3`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        if (!res.data || !res.data.result || !res.data.result.download) {
            return reply("⚠️ API failed to return a valid link.");
        }

        const audioData = res.data.result;

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: audioData.download },
            mimetype: "audio/mpeg",
            fileName: `${audioData.title || video.title || 'song'}.mp3`,
            ptt: false
        }, { quoted: m });

        await conn.sendMessage(from, {
            document: { url: audioData.download },
            mimetype: "audio/mpeg",
            fileName: `${audioData.title || video.title || 'song'}.mp3`,
            ptt: false
        }, { quoted: m });        

    } catch (err) {
        console.error("Song command error:", err);
        reply("❌ Failed to download song. Try again later.");
    }
});

cmd({
    pattern: "song3",
    desc: "Download songs via YouTube.",
    react: "🎵",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, q, pushname, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a song title or YouTube link!");

        const search = await yts(q);
        const song = search.videos[0];

        const caption = `
┌──⭓ *DARK-KNIGHT XMD*
│
├ 🎵 *Title:* ${song.title}
├ ⏱️ *Duration:* ${song.timestamp}
├ 👀 *Views:* ${song.views}
├ 📅 *Uploaded:* ${song.ago}
├ 🔗 *Link:* ${song.url}
│
└──⭓ *Enjoy your music!*
`;

        await conn.sendMessage(from, { image: { url: song.thumbnail }, caption }, { quoted: mek });

        const res = await fetch(`https://api.bwmxmd.online/api/download/ytmp3?apikey=ibraah-help&url=${encodeURIComponent(song.url)}`);
        const json = await res.json();

        if (!json.success) return reply("❌ Failed to download audio. Try again later.");

        const { download_url, title } = json.result;

        await conn.sendMessage(from, { audio: { url: download_url }, mimetype: "audio/mpeg" }, { quoted: mek });
        
        await conn.sendMessage(from, {
            document: { url: download_url },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            caption: "© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳"
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ Hi ${pushname}, something went wrong. Please try again later.`);
    }
});
