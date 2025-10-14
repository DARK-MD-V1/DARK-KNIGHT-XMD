const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "spotify",
    desc: "Search and download Spotify songs with a list menu",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a song name to search on Spotify.*");

        reply("🔍 *Searching Spotify... Please wait!*");

        // Fetch data from API
        const { data } = await axios.get(`https://sadiya-tech-apis.vercel.app/search/spotify`, {
            params: {
                q: q,
                apikey: "sadiya"
            }
        });

        if (!data.status || !data.result || data.result.length === 0)
            return reply("*No results found. Try another song name!*");

        // Limit results to top 10
        const results = data.result.slice(0, 10);

        // Map results to list items
        const sections = [
            {
                title: "🎧 Spotify Search Results",
                rows: results.map((song, index) => ({
                    title: `${index + 1}. ${song.title}`,
                    description: `${song.artists} • ${song.album}`,
                    id: `.spotifydl ${song.external_url}` // command to trigger download
                }))
            }
        ];

        // Send list message
        const listMessage = {
            text: `🎵 *Search Results for:* ${q}`,
            footer: "Select a song to download 🎶",
            title: "🎧 Spotify Music Downloader",
            buttonText: "📀 Choose Song",
            sections
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });

    } catch (e) {
        console.error("Spotify Search Error:", e);
        reply("*⚠️ Oops! Something went wrong while searching Spotify.*");
    }
});


// ─────────────────────────────
// 🎵 Second command for downloading selected song
// ─────────────────────────────
cmd({
    pattern: "spotifydl",
    desc: "Download Spotify song by URL",
    category: "downloader",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a valid Spotify track link.*");
        if (!q.includes("spotify.com")) return reply("*Invalid Spotify link provided.*");

        reply("⏳ *Fetching track info... Please wait!*");

        // Use Aswin Sparky API for download
        const { data } = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/spotify`, {
            params: { url: q }
        });

        if (!data.status || !data.data)
            return reply("*Failed to fetch Spotify track. Try again later.*");

        const { title, artis, durasi, image, download } = data.data;

        const durationSec = Math.floor(durasi / 1000);
        const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
        const seconds = (durationSec % 60).toString().padStart(2, '0');
        const duration = `${minutes}:${seconds}`;

        const caption = `
*⫷⦁ SPOTIFY DOWNLOADER ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artis}
⏱️ *Duration:* ${duration}

> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 x SADIYA-TECH*
`.trim();

        await conn.sendMessage(from, {
            image: { url: image },
            caption
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: download },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        console.error("Spotify Download Error:", e);
        reply("*⚠️ Error occurred while downloading the track.*");
    }
});


cmd({
    pattern: "spotify2",
    desc: "Download Spotify music as MP3",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, pushname }) => {
    try {
        if (!q) return reply("*Please provide a Spotify link.*");
        if (!q.includes("spotify.com")) return reply("*Invalid Spotify link provided.*");

        reply("⏳ *Fetching Spotify track... Please wait!*");

        // Call the Aswin Sparky API
        const { data } = await axios.get(`https://api-aswin-sparky.koyeb.app/api/downloader/spotify`, {
            params: { url: q }
        });

        if (!data.status || !data.data) {
            return reply("*Failed to fetch Spotify track. Please try again later.*");
        }

        const {
            title,
            type,
            artis,
            durasi,
            image,
            download
        } = data.data;

        // Convert duration (ms) → mm:ss
        const totalSec = Math.floor(durasi / 1000);
        const minutes = Math.floor(totalSec / 60).toString().padStart(2, '0');
        const seconds = (totalSec % 60).toString().padStart(2, '0');
        const formattedDuration = `${minutes}:${seconds}`;

        const caption = `
*⫷⦁ SPOTIFY DOWNLOADER ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artis}
🎶 *Type:* ${type}
⏱️ *Duration:* ${formattedDuration}

> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`.trim();

        // Send image with info
        await conn.sendMessage(from, {
            image: { url: image },
            caption: caption
        }, { quoted: mek });

        // Send MP3 file
        await conn.sendMessage(from, {
            audio: { url: download },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        console.error("Spotify Download Error:", e);
        reply("*⚠️ Oops! An error occurred while downloading the Spotify track.*");
    }
});
