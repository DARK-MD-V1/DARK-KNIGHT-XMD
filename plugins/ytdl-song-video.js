const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

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

 🎵 *Downloading Song:* ⏳

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
    pattern: "video",
    desc: "Download song from YouTube",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Usage: *.video shape of you*");

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

 🎬 *Downloading Video:* ⏳

 Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
 `}, { quoted: m });

        // API link
        const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=360`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        if (!res.data || !res.data.result || !res.data.result.download) {
            return reply("⚠️ API failed to return a valid link.");
        }

        const videoData = res.data.result;

        // Send audio
        await conn.sendMessage(from, {
            video: { url: videoData.download },
            mimetype: "video/mp4",
            fileName: `${videoData.title || video.title || 'video'}.mp4`,
        }, { quoted: m });

        await conn.sendMessage(from, {
            document: { url: videoData.download },
            mimetype: "video/mp4",
            fileName: `${videoData.title || video.title || 'video'}.mp4`,
        }, { quoted: m });        

    } catch (err) {
        console.error("Video command error:", err);
        reply("❌ Failed to download video. Try again later.");
    }
});


cmd({
    pattern: "video4",
    desc: "Download video from YouTube",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Usage: *.video despacito*");

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
 🔖 *Title:* ${video.title}
 ⏱ *Duration:* ${video.timestamp}
 🧬 *Views :* ${video.views}
 📅 *Released Date :* ${video.ago}
 🖇️ *Link :* ${video.url}
 
 🎬 *Downloading Video:* ⏳
 
 Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
 `}, { quoted: m });

        // API link
        const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=720`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!res.data || !res.data.result || !res.data.result.download) {
            return reply("⚠️ API failed to return a valid video link.");
        }

        const videoData = res.data.result;

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoData.download },
            mimetype: "video/mp4",
            fileName: `${videoData.title || video.title || 'video'}.mp4`,
            caption: `✅ *Here is your video*\n📌 Title: ${videoData.title || video.title}`
        }, { quoted: m });

    } catch (err) {
        console.error("Video command error:", err);
        reply("❌ Failed to download video. Try again later.");
    }
});

module.exports = function setupYoutubeAuto(conn) {
    conn.ev.on("messages.upsert", async (msgData) => {
        try {
            const msg = msgData.messages[0];
            if (!msg?.message?.conversation) return;

            const text = msg.message.conversation;
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) return;

            const from = msg.key.remoteJid;
            const url = text.trim();

            // Inform user
            await conn.sendMessage(from, {
                text: `🎬 *YouTube Link Detected!*\n⏳ Downloading video...`
            }, { quoted: msg });

            // API call
            const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(url)}&format=720`;

            const res = await axios.get(apiUrl, {
                timeout: 30000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });

            if (!res.data || !res.data.result || !res.data.result.download) {
                return conn.sendMessage(from, { text: "⚠️ API failed to return a valid video link." }, { quoted: msg });
            }

            const videoData = res.data.result;

            // Send video
            await conn.sendMessage(from, {
                video: { url: videoData.download },
                mimetype: "video/mp4",
                fileName: `${videoData.title || 'youtube-video'}.mp4`,
                caption: `✅ *Auto Download Complete*\n📌 Title: ${videoData.title || 'Unknown'}`
            }, { quoted: msg });

        } catch (e) {
            console.error("Auto YouTube download error:", e);
        }
    });
};
