const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "spotify",
    desc: "Search and download Spotify music as MP3",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a song name to search on Spotify.*");

        reply("🔍 *Searching Spotify... Please wait!*");

        // call Sadiya API
        const { data } = await axios.get(`https://sadiya-tech-apis.vercel.app/search/spotify`, {
            params: {
                q: q,
                apikey: "sadiya"
            }
        });

        // check API response
        if (!data.status || !data.result || data.result.length === 0)
            return reply("*No results found for your query. Try another song name.*");

        // pick the first song result
        const song = data.result[0];

        const {
            title,
            artists,
            album,
            duration,
            preview_url,
            external_url,
            image
        } = song;

        const durationSec = Math.floor(duration / 1000);
        const minutes = Math.floor(durationSec / 60).toString().padStart(2, '0');
        const seconds = (durationSec % 60).toString().padStart(2, '0');
        const formattedDuration = `${minutes}:${seconds}`;

        const caption = `
*⫷⦁ SPOTIFY SEARCH & DOWNLOADER ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artists}
💿 *Album:* ${album}
⏱️ *Duration:* ${formattedDuration}

🔗 *Spotify:* ${external_url}

> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`.trim();

        // send cover image + info
        await conn.sendMessage(from, {
            image: { url: image },
            caption: caption
        }, { quoted: mek });

        // If preview available
        if (preview_url) {
            await conn.sendMessage(from, {
                audio: { url: preview_url },
                mimetype: "audio/mpeg",
                ptt: false
            }, { quoted: mek });
        } else {
            reply("*⚠️ Sorry, this track has no MP3 preview available.*");
        }

    } catch (e) {
        console.error("Spotify Search Error:", e);
        reply("*⚠️ Oops! Something went wrong while fetching the Spotify track.*");
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
