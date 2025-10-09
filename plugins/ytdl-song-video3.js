const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

function extractUrl(text = '') {
    if (!text) return null;
    const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&%.#\/]+)|(youtube\.com\/[\w\-?=&%.#\/]+)/i;
    const match = text.match(urlRegex);
    if (!match) return null;
    return match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
}

cmd({
    pattern: 'video3',
    desc: 'Download YouTube video.',
    category: 'download',
    react: '🎬',
    filename: __filename
}, async (conn, m, mek, { from, args, reply, quoted }) => {
    try {
        const provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
        if (!provided) return reply('🧩 *Usage:* .video3 <youtube-url>\n👉 Or reply to a message containing a YouTube link.');

        await reply('⏳ Searching video...');

        let videoUrl = provided;

        // If not a direct YouTube URL, search
        if (!provided.match(/(youtube\.com|youtu\.be)/)) {
            const search = await yts(provided);
            if (!search.videos.length) return reply('❌ No results found!');
            videoUrl = search.videos[0].url;
        }

        // SD (720p) API
        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.media?.video_url) {
            return reply('❌ SD video not available!');
        }

        const media = data.result.media;
        const safeTitle = media.title.replace(/[\\/:*?"<>|]/g, '');

        // Preview card
        await conn.sendMessage(from, {
            image: { url: media.thumbnail },
            caption: `
 🎬 *Title:* ${media.title}
 🧬 *Channel:* ${media.channel}
 🖇️ *Link:* ${media.video_url}
 🧩 *Quality:* ${media.quality}  

 🎬 *Downloading Video:* ⏳
 
 Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
 }, { quoted: m });

        // Download & send as document
        const fileRes = await fetch(media.video_url);
        const fileBuffer = await fileRes.arrayBuffer();

        await conn.sendMessage(from, {
            video: Buffer.from(fileBuffer),
            fileName: `${safeTitle}.mp4`,
            mimetype: 'video/mp4',
            caption: `*✅ Downloaded.*`
        }, { quoted: m });       
      
       await conn.sendMessage(from, {
            document: Buffer.from(fileBuffer),
            fileName: `${safeTitle}.mp4`,
            mimetype: 'video/mp4',
            caption: `*© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*`
        }, { quoted: m });

    } catch (err) {
        console.error('video3 error =>', err);
        reply('🚫 Unexpected error. Try again later.');
    }
});


cmd({
    pattern: 'song3',
    desc: 'Download YouTube song.',
    category: 'download',
    react: '🎵',
    filename: __filename
}, async (conn, m, mek, { from, args, reply, quoted }) => {
    try {
        const provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
        if (!provided) return reply('🧩 *Usage:* .song3 <youtube-url>\n👉 Or reply to a message containing a YouTube link.');

        await reply('⏳ Searching song...');

        let videoUrl = provided;

        // If not a direct YouTube URL, search
        if (!provided.match(/(youtube\.com|youtu\.be)/)) {
            const search = await yts(provided);
            if (!search.videos.length) return reply('❌ No results found!');
            videoUrl = search.videos[0].url;
        }

        // SD (720p) API
        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.result?.media?.audio_url) {
            return reply('❌ Song not available!');
        }

        const media = data.result.media;
        const safeTitle = media.title.replace(/[\\/:*?"<>|]/g, '');

        // Preview card
        await conn.sendMessage(from, {
            image: { url: media.thumbnail },
            caption: `
 🎵 *Title:* ${media.title}
 🧬 *Channel:* ${media.channel}
 🖇️ *Link:* ${media.audio_url}

 🎵 *Downloading Song:* ⏳

 Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
 }, { quoted: m });

        // Download & send as document
        const fileRes = await fetch(media.audio_url);
        const fileBuffer = await fileRes.arrayBuffer();

        await conn.sendMessage(from, {
            audio: Buffer.from(fileBuffer),
            fileName: `${safeTitle}.mp3`,
            mimetype: 'audio/mpeg',
            caption: `*✅ Downloaded.*`
        }, { quoted: m });       
      
       await conn.sendMessage(from, {
            document: Buffer.from(fileBuffer),
            fileName: `${safeTitle}.mp3`,
            mimetype: 'audio/mpeg',
            caption: `*© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*`
        }, { quoted: m });

    } catch (err) {
        console.error('song3 error =>', err);
        reply('🚫 Unexpected error. Try again later.');
    }
});
