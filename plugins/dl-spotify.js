const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "spotify",
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
