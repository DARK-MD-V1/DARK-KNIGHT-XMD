const { cmd } = require('../command');
const axios = require('axios');


cmd({
    pattern: "pindl",
    alias: ["pinterest"],
    desc: "Download media from Pinterest (first 5 results)",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, from, reply }) => {
    try {
        if (args.length < 1) {
            return reply('❎ Please provide a Pinterest URL or keyword to download from.');
        }

        const pinterestUrl = args.join(" ");
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const response = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.status || !response.data.data || response.data.data.length === 0) {
            return reply('❎ No results found for that Pinterest URL or keyword.');
        }

        // Limit results to first 5
        const pins = response.data.data.slice(0, 5);

        // Loop through each of the first 5 media results
        for (const pin of pins) {
            const title = pin.grid_title || 'No title available';
            const description = pin.description?.trim() || 'No description available';
            const username = pin.pinner?.full_name || pin.pinner?.username || 'Unknown';
            const board = pin.board?.name || 'No board info';
            const likes = pin.reaction_counts?.["1"] || 0;

            // Determine the correct media URL
            const mediaUrl = pin.video_url || pin.gif_url || pin.image_url;
            const isVideo = Boolean(pin.video_url);

            const caption = `
╭━━━〔 *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳* 〕━┈⊷
┃▸╭───────────
┃▸┊๏ *ᴘɪɴᴛᴇʀᴇsᴛ ᴅʟ*
┃▸╰───────────···๏
╰────────────────┈⊷
╭━━┈┈┈┈┈┈┈┈┈━⪼
┇๏ *ᴛɪᴛʟᴇ* - ${title}
┇๏ *ᴍᴇᴅɪᴀ ᴛʏᴘᴇ* - ${mediaUrl}
┇๏ *ᴘɪɴɴᴇʀ* - ${username}
┇๏ *ʙᴏᴀʀᴅ* - ${board}
┇๏ *ʟɪᴋᴇs* - ${likes}
╰━━┈┈┈┈┈┈┈┈┈━⪼
> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ♡*`;

            if (isVideo) {
                await conn.sendMessage(from, { video: { url: mediaUrl }, caption }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { image: { url: mediaUrl }, caption }, { quoted: mek });
            }

            // Small delay between messages (prevents spam blocking)
            await new Promise(res => setTimeout(res, 1500));
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while processing your request.');
    }
});


cmd({
    pattern: "pindl2",
    alias: ["pinterest2"],
    desc: "Download media from Pinterest (via Aswin Sparky API)",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, from, reply }) => {
    try {
        if (!args[0]) return reply('❎ Please provide a Pinterest URL to download.');

        const pinterestUrl = args[0];
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/pin?url=${encodeURIComponent(pinterestUrl)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.status || !response.data.data) {
            return reply('❎ Failed to fetch data from Pinterest API.');
        }

        const result = response.data.data;
        const title = result.title && result.title.trim() !== "" ? result.title : "No title available";
        const description = result.description && result.description.trim() !== "" ? result.description : "No description";
        const mediaArray = result.media_urls;

        if (!mediaArray || mediaArray.length === 0) {
            return reply('❎ No downloadable media found.');
        }

        // Get best quality (prefer original > large > medium)
        const bestMedia = mediaArray.find(m => m.quality === "original") ||
                          mediaArray.find(m => m.quality === "large") ||
                          mediaArray[0];

        const mediaUrl = bestMedia.url;
        const type = bestMedia.type || "unknown";
        const quality = bestMedia.quality || "N/A";

        const caption = `╭━━━〔 *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *PINS DOWNLOADER*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━❐━⪼
┇๏ *Title* - ${title}
┇๏ *Type* - ${type}
┇๏ *Quality* - ${quality}
┇๏ *Description* - ${description}
╰━━❑━⪼
> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ♡*`;

        if (type.toLowerCase().includes('video')) {
            await conn.sendMessage(from, { video: { url: mediaUrl }, caption }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { image: { url: mediaUrl }, caption }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (err) {
        console.error(err);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while downloading the Pinterest media.');
    }
});
