const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pindl",
    alias: ["pinterestdl"],
    desc: "Download media from Pinterest (supports multiple pins)",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
        if (!args[0]) {
            return reply('❎ Please provide a Pinterest URL.\n\nExample: `.pindl https://pin.it/example`');
        }

        const pinterestUrl = args[0];
        const apiUrl = `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(pinterestUrl)}`;

        const { data } = await axios.get(apiUrl);

        // ✅ Check if valid response
        if (!data?.status || !Array.isArray(data?.data) || data.data.length === 0) {
            return reply('❎ Could not fetch Pinterest media. Please check the URL or try again later.');
        }

        const pins = data.data;

        // 🔄 Loop through each pin
        for (const pin of pins) {
            const title = pin.grid_title || 'No title';
            const desc = pin.description?.trim() || 'No description';
            const pinner = pin.pinner?.full_name || pin.pinner?.username || 'Unknown';
            const mediaType = pin.type || 'unknown';

            // Choose media URL
            const mediaUrl = pin.video_url || pin.gif_url || pin.image_url;
            if (!mediaUrl) continue;

            // Format caption
            const caption = `
╭━━━〔 *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳* 〕━┈⊷
┃▸ *Pinterest Downloader*
┃▸───────────────
┃▸ *Title:* ${title}
┃▸ *Type:* ${mediaType}
┃▸ *Author:* ${pinner}
┃▸ *Uploaded:* ${pin.created_at || 'Unknown'}
╰──────────────────⊷
> *© Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ♡*
`;

            // 🖼️ or 🎥 Send media depending on type
            if (pin.video_url) {
                await conn.sendMessage(from, { video: { url: mediaUrl }, caption }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { image: { url: mediaUrl }, caption }, { quoted: mek });
            }
        }

        await reply(`✅ Sent ${pins.length} Pinterest media file${pins.length > 1 ? 's' : ''}.`);

    } catch (e) {
        console.error('PinterestDL Error:', e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while processing your request. Try again later.');
    }
});



cmd({
    pattern: "pindl2",
    alias: ["pinterestdl2"],
    desc: "Download media from Pinterest",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
        // Make sure the user provided the Pinterest URL
        if (args.length < 1) {
            return reply('❎ Please provide the Pinterest URL to download from.');
        }

        // Extract Pinterest URL from the arguments
        const pinterestUrl = args[0];

        // Call your Pinterest download API
        const response = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.success) {
            return reply('❎ Failed to fetch data from Pinterest.');
        }

        const media = response.data.result.media;
        const description = response.data.result.description || 'No description available'; // Check if description exists
        const title = response.data.result.title || 'No title available';

        // Select the best video quality or you can choose based on size or type
        const videoUrl = media.find(item => item.type.includes('720p'))?.download_url || media[0].download_url;

        // Prepare the new message with the updated caption
        const desc = `╭━━━〔 *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *PINS DOWNLOADER*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━❐━⪼
┇๏ *Title* - ${title}
┇๏ *Media Type* - ${media[0].type}
╰━━❑━⪼
> *© Pᴏᴡᴇʀᴇᴅ Bʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ♡*`;

        // Send the media (video or image) to the user
        if (videoUrl) {
            // If it's a video, send the video
            await conn.sendMessage(from, { video: { url: videoUrl }, caption: desc }, { quoted: mek });
        } else {
            // If it's an image, send the image
            const imageUrl = media.find(item => item.type === 'Thumbnail')?.download_url;
            await conn.sendMessage(from, { image: { url: imageUrl }, caption: desc }, { quoted: mek });
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while processing your request.');
    }
});
