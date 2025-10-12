const { cmd, commands } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "songq",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // 🆕 Updated GTech API
        const api = `https://gtech-api-xtp1.onrender.com/api/audio/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes.status || !apiRes.result?.media?.audio_url) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.result.media;

        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
📑 *Title:* ${result.title}
🎤 *Channel:* ${result.channel}
📜 *Description:* ${result.description}
📺 *Platform:* ${result.platform}
🔗 *Link:* ${ytUrl}

🎵 *Downloading Song...* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
            `
        }, { quoted: mek });

        // 🎶 Send as Audio
        await conn.sendMessage(from, {
            audio: { url: result.audio_url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // 📄 Send as Document
        await conn.sendMessage(from, {
            document: { url: result.audio_url },
            mimetype: "audio/mpeg",
            fileName: `${result.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});




cmd({
    pattern: "videoq",
    react: "🎬",
    desc: "Download YouTube MP4 video (HD/SD)",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What video do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // ✅ Use your provided API
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${ytUrl}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes.status || !apiRes.result?.media?.video_url) {
            return reply("❌ වීඩියෝව බාගත කළ නොහැක. වෙනත් එකක් උත්සාහ කරන්න!");
        }

        const result = apiRes.result.media;

        // 🖼️ Send video info
        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
🎬 *Title:* ${result.title}
📺 *Channel:* ${result.channel || "Not Available"}
⏱️ *Quality:* ${result.quality}
📊 *Platform:* ${result.platform}
📝 *Description:* ${result.description || "No description available"}
🔗 *YouTube Link:* ${ytUrl}

🎞️ Choose your preferred quality below 👇

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // 🎥 Send HD version if available, else fallback
        const videoUrl = result.video_url || result.video_url_sd;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: "video/mp4",
            caption: `🎬 *${result.title}* (${result.quality})`
        }, { quoted: mek });

        // 🎧 Optionally also send MP3 version
            await conn.sendMessage(from, {
                document: { url: videoUrl },
                mimetype: "video/mp4",
                fileName: `${result.title}.mp4`
            }, { quoted: mek });
        }

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});

