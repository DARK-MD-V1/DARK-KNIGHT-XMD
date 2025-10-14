const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "spotify",
    desc: "Search and download Spotify songs",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, pushname }) => {
    try {
        if (!q) return reply("*Please provide a song name or Spotify link.*");

        // If user provides Spotify URL → directly download
        if (q.includes("open.spotify.com/track")) {
            const encodedUrl = encodeURIComponent(q.trim());
            const { data } = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/spotify?url=${encodedUrl}`);

            if (!data.status || !data.result) return reply("*❌ Failed to fetch download link.*");

            const info = data.result;
            const { title, artist, album, release_date, duration, image, download } = info;
            const mins = Math.floor(duration / 60).toString().padStart(2, '0');
            const secs = (duration % 60).toString().padStart(2, '0');
            const durationFormatted = `${mins}:${secs}`;

            const caption = `
*⫷⦁ SPOTIFY DOWNLOAD ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artist}
💿 *Album:* ${album}
📅 *Release:* ${release_date}
⏱️ *Duration:* ${durationFormatted}

> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`.trim();

            await conn.sendMessage(from, {
                image: { url: image },
                caption
            }, { quoted: mek });

            await conn.sendMessage(from, {
                audio: { url: download },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`
            }, { quoted: mek });

            return;
        }

        // Otherwise search by name
        reply("⏳ *Searching Spotify... Please wait!*");

        const { data } = await axios.get(`https://sadiya-tech-apis.vercel.app/search/spotify`, {
            params: { q, apikey: "sadiya" }
        });

        if (!data.status || !data.result || data.result.length === 0)
            return reply("*No Spotify results found. Try another query.*");

        const tracks = data.result.slice(0, 5);
        let listText = "*🎧 Top 5 Spotify Results:*\n\n";

        tracks.forEach((t, i) => {
            const durSec = Math.floor(t.duration / 1000);
            const min = Math.floor(durSec / 60).toString().padStart(2, '0');
            const sec = (durSec % 60).toString().padStart(2, '0');
            listText += `*${i + 1}.* 🎵 ${t.title}\n🧑‍🎤 ${t.artist}\n⏱️ ${min}:${sec}\n🔗 ${t.url}\n\n`;
        });

        listText += "*Reply with a number (1–5) to download that song.*";
        await conn.sendMessage(from, { text: listText }, { quoted: mek });

        // 🧠 Wait for user reply
        conn.once('message', async (msg) => {
            if (!msg.message || !msg.message.conversation) return;
            const number = parseInt(msg.message.conversation.trim());

            if (isNaN(number) || number < 1 || number > tracks.length) {
                return conn.sendMessage(from, { text: "*❌ Invalid selection. Please send 1–5.*" }, { quoted: mek });
            }

            const selectedTrack = tracks[number - 1];
            const encodedUrl = encodeURIComponent(selectedTrack.url);

            await conn.sendMessage(from, { text: `🎶 *Downloading:* ${selectedTrack.title}` }, { quoted: mek });

            const { data: dl } = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/spotify?url=${encodedUrl}`);

            if (!dl.status || !dl.result) return reply("*❌ Failed to fetch download link.*");

            const info = dl.result;
            const { title, artist, album, release_date, duration, image, download } = info;
            const mins = Math.floor(duration / 60).toString().padStart(2, '0');
            const secs = (duration % 60).toString().padStart(2, '0');
            const durationFormatted = `${mins}:${secs}`;

            const caption = `
*⫷⦁ SPOTIFY DOWNLOAD ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artist}
💿 *Album:* ${album}
📅 *Release:* ${release_date}
⏱️ *Duration:* ${durationFormatted}

> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`.trim();

            await conn.sendMessage(from, {
                image: { url: image },
                caption
            }, { quoted: mek });

            await conn.sendMessage(from, {
                audio: { url: download },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`
            }, { quoted: mek });
        });

    } catch (e) {
        console.error("Spotify Plugin Error:", e);
        reply("*❌ Error: Unable to fetch Spotify music right now.*");
    }
});


cmd({
    pattern: "spotify2",
    desc: "Search Spotify music info",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, pushname }) => {
    try {
        if (!q) return reply("*Please provide a song name to search on Spotify.*");

        reply("⏳ *Searching Spotify... Please wait!*");

        // Call Sadiya Tech Spotify API
        const { data } = await axios.get(`https://sadiya-tech-apis.vercel.app/search/spotify`, {
            params: { q, apikey: "sadiya" }
        });

        if (!data.status || !data.result || data.result.length === 0)
            return reply("*No Spotify results found. Try another query.*");

        // Pick the top result
        const track = data.result[0];
        const { title, artist, duration, popularity, preview, url } = track;

        // Convert duration from milliseconds to MM:SS
        const durationSec = Math.floor(duration / 1000);
        const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
        const seconds = (durationSec % 60).toString().padStart(2, '0');
        const durationFormatted = `${minutes}:${seconds}`;

        const caption = `
*⫷⦁ SPOTIFY SEARCH RESULT ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artist}
⏱️ *Duration:* ${durationFormatted}
🔥 *Popularity:* ${popularity}
🔗 *Spotify URL:* ${url}

> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`.trim();

        // Send details message
        await conn.sendMessage(from, { text: caption }, { quoted: mek });

        // Send preview audio if available
        if (preview) {
            await conn.sendMessage(from, {
                audio: { url: preview },
                mimetype: "audio/mpeg",
                ptt: false
            }, { quoted: mek });
        } else {
            reply("*⚠️ Preview not available for this track.*");
        }

    } catch (e) {
        console.error("Spotify Plugin Error:", e);
        reply("*❌ Error: Unable to fetch Spotify data right now.*");
    }
});
