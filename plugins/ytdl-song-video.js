const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');
const config = require('../config');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

cmd({ 
    pattern: "video4",
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.video < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `
🔖 *Title:* ${yts.title}
⏱️ *Duration:* ${yts.timestamp}
🧬 *Views:* ${yts.views}
📅 *Released Date :* ${yts.ago}
🖇️ *Link:* ${yts.url}

*Choose download format:*
1 | ▶️ Normal Video 
2 | 📄 document Video

Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

        // Removed channel/newsletter info here
        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        // Send thumbnail with options
        const videoMsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const replyMsg = msgUpdate.messages[0];
            if (!replyMsg.message || !replyMsg.message.extendedTextMessage) return;

            const selected = replyMsg.message.extendedTextMessage.text.trim();

            if (
                replyMsg.message.extendedTextMessage.contextInfo &&
                replyMsg.message.extendedTextMessage.contextInfo.stanzaId === videoMsg.key.id
            ) {
                await conn.sendMessage(from, { react: { text: "⬇️", key: replyMsg.key } });

                switch (selected) {
                    case "2":
                        await conn.sendMessage(from, {
                            document: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            fileName: `${yts.title}.mp4`,
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    case "1":
                        await conn.sendMessage(from, {
                            video: { url: data.result.download_url },
                            mimetype: "video/mp4",
                            contextInfo
                        }, { quoted: replyMsg });
                        break;

                    default:
                        await conn.sendMessage(
                            from,
                            { text: "*Please Reply with ( 1 or 2 ) ❤️*" },
                            { quoted: replyMsg }
                        );
                        break;
                }
            }
        });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});


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

 📌 Song එක එනකම් පොඩ්ඩක් වෙලා ඉන්න.

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
    react: "🎥",
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

 📌 video එක එනකම් පොඩ්ඩක් වෙලා ඉන්න.

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
    pattern: "video3",
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
            🎬 *Downloading Video:*
            📌 *Title:* ${video.title}
            ⏱ *Duration:* ${video.timestamp}
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
