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
