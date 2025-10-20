const {cmd , commands} = require('../command')
const fetch = require('node-fetch')
const yts = require('yt-search')
const axios = require("axios");

cmd({
    pattern: "song",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        const yts = require('yt-search');
        const search = await yts(q);
        
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;
        const ago = data.ago;

        const api = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${ytUrl}&format=mp3&apikey=sadiya`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.download) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.result;

        await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: `
📑 *Title :* ${data.title}
⏱️ *Duration :* ${data.timestamp} 
📊 *Views :* ${data.views}
📆 *Released :* ${data.ago}
🔗 *Link :* ${data.url}
 
🎵 *Downloading Song..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: result.download },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });
       
        await conn.sendMessage(from, {
            document : { url: result.download },
            mimetype: "audio/mpeg",
            fileName: `${data.title}.mp3`
        }, { quoted: mek });        

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});


cmd({
    pattern: "song1",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song1 <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        // Search song on YouTube
        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        // Fetch from Aswin Sparky API
        const api = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.data?.url) {
            return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
        }

        const result = apiRes.data;

        // Send video details
        await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: `
📑 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📊 *Views:* ${data.views}
📆 *Released:* ${data.ago}
🔗 *Link:* ${data.url}

🎵 *Downloading Song..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: mek });

        // Send as audio
        await conn.sendMessage(from, {
            audio: { url: result.url },
            mimetype: "audio/mpeg",
            ptt: false,
        }, { quoted: mek });

        // Also send as document
        await conn.sendMessage(from, {
            document: { url: result.url },
            mimetype: "audio/mpeg",
            fileName: `${result.title || data.title}.mp3`
        }, { quoted: mek });

    } catch (error) {
        reply(`❌ An error occurred: ${error.message}`);
    }
});

// new song commands

cmd({
  pattern: "play",
  react: "🎵",
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  use: ".play <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.");

    // 🔹 API Call
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // 🔹 Validate response
    if (!data?.success || !data?.result?.downloadUrl) {
      return reply("❌ Song not found or API error. Try again later.");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Try to fetch thumbnail
    let buffer = null;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {}

    // 🔹 Caption design
    const caption = `
📑 *Title :* ${meta.title}
⏱ *Duration :* ${meta.duration}
⏰ *ResponseTime :* ${data.responseTime}
📡 *Channel :* ${meta.channel}
🔗 *Link :* ${meta.url}

🎵 *Downloading Song..* ⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send thumbnail & details
    await conn.sendMessage(from, {
      image: buffer,
      caption
    }, { quoted: mek });

    // 🔹 Send audio
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

    await conn.sendMessage(from, {
      document: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek }); 
  
  } catch (err) {
    console.error("song cmd error:", err);
    reply("⚠️ An error occurred while processing your request.");
  }
});


cmd({
  pattern: "ytmp3",
  react: "🎵",
  desc: "Download YouTube song (Audio) via Nekolabs API (v1 Direct)",
  category: "download",
  use: ".ytmp3 <YouTube link>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a valid YouTube link.");

    // ✅ Validate YouTube URL
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
    if (!ytRegex.test(q)) return reply("⚠️ Please provide a valid YouTube URL.");

    reply("🎧 Fetching song info... Please wait!");

    // 🔹 API Request
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(q)}&format=mp3`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // 🔹 Validate response
    if (!data?.success || !data?.result?.downloadUrl) {
      return reply("❌ Failed to fetch song details or invalid API response.");
    }

    const meta = data.result;
    const dlUrl = meta.downloadUrl;

    // 🔹 Fetch thumbnail
    let buffer = null;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {}

    // 🔹 Caption
    const caption = `
📑 *Title :* ${meta.title}
⏱ *Duration :* ${meta.duration}
⏰ *ResponseTime :* ${data.responseTime}
📝 *Format :* ${meta.format} (${meta.quality}kbps)

🎵 *Downloading Song..*⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send thumbnail
    await conn.sendMessage(from, { image: buffer, caption }, { quoted: mek });

    // 🔹 Send audio
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

    // (Optional) Send as document
    await conn.sendMessage(from, {
      document: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("song cmd error:", err);
    reply("⚠️ An error occurred while processing your request.");
  }
});
