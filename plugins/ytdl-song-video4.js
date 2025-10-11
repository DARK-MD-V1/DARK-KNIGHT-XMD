const { cmd } = require('../command')
const fetch = require('node-fetch')
const yts = require('yt-search')

cmd({
  pattern: "song4",
  react: "🎵",
  desc: "Download YouTube song",
  category: "download",
  use: ".song4 <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.");

    // 🔹 Call Nekolabs API (directly supports search query or URL)
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.downloadUrl) {
      return reply("❌ Song not found or API error. Try again later.");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Thumbnail buffer
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Caption card with extra info
    const caption = `
╔═══════════════
🎵 *Title:* ${meta.title}
⏱ *Duration:* ${meta.duration}
👤 *Channel:* ${meta.channel}
🔗 *Link:* ${meta.url}
╚═══════════════

🎵 *Downloading Song:* ⏳

Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send info card
    await conn.sendMessage(from, {
      image: buffer,
      caption
    }, { quoted: mek });

    // 🔹 Send audio file
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
  pattern: 'song7',
  react: '🎵',
  desc: 'Download YouTube song',
  category: 'download',
  use: '.song4 <YouTube URL>',
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply('⚠️ Please provide a YouTube link.');

    // 🔹 Nekolabs API v1 for direct MP3 download
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(q)}&format=mp3`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.downloadUrl) {
      return reply('❌ Song not found or API error. Try again later.');
    }

    const meta = data.result;
    const dlUrl = meta.downloadUrl;

    // 🔹 Fetch thumbnail buffer
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Caption card
    const caption = `
╔═══════════════
🎵 *Title:* ${meta.title}
⏱ *Duration:* ${meta.duration}
🔗 *Link:* ${q}
╚═══════════════

🎵 *Downloading Song:* ⏳

Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send info card
    await conn.sendMessage(from, { image: buffer, caption }, { quoted: mek });

    // 🔹 Send audio
    const safeTitle = meta.title.replace(/[\\/:*?"<>|]/g, '').slice(0, 80);
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${safeTitle}.mp3`
    }, { quoted: mek });

    // 🔹 Send as document (optional)
    await conn.sendMessage(from, {
      document: { url: dlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${safeTitle}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error('song cmd error:', err);
    reply('⚠️ An error occurred while processing your request.');
  }
});


cmd({
  pattern: 'video7',
  react: '🎵',
  desc: 'Download YouTube song',
  category: 'download',
  use: '.song4 <YouTube URL>',
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply('⚠️ Please provide a YouTube link.');

    // 🔹 Nekolabs API v1 for direct MP3 download
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(q)}&format=360`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.downloadUrl) {
      return reply('❌ Song not found or API error. Try again later.');
    }

    const meta = data.result;
    const dlUrl = meta.downloadUrl;

    // 🔹 Fetch thumbnail buffer
    let buffer;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      buffer = null;
    }

    // 🔹 Caption card
    const caption = `
╔═══════════════
🎵 *Title:* ${meta.title}
⏱ *Duration:* ${meta.duration}
🔗 *Link:* ${q}
╚═══════════════

🎵 *Downloading Song:* ⏳

Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send info card
    await conn.sendMessage(from, { image: buffer, caption }, { quoted: mek });

    // 🔹 Send audio
    const safeTitle = meta.title.replace(/[\\/:*?"<>|]/g, '').slice(0, 80);
    await conn.sendMessage(from, {
      video: { url: dlUrl },
      mimetype: 'video/mp4',
      fileName: `${safeTitle}.mp4`
    }, { quoted: mek });

    // 🔹 Send as document (optional)
    await conn.sendMessage(from, {
      document: { url: dlUrl },
      mimetype: 'video/mp4',
      fileName: `${safeTitle}.mp4`
    }, { quoted: mek });

  } catch (err) {
    console.error('song cmd error:', err);
    reply('⚠️ An error occurred while processing your request.');
  }
});




cmd({
  pattern: "song9",
  react: "🎵",
  desc: "Download YouTube song using Nekolabs API",
  category: "download",
  use: ".song4 <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.\n\nUsage: `.song4 <song name>`");

    // 🔹 Nekolabs API endpoint
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data?.status || !data?.result?.downloadUrl) {
      return reply("❌ Song not found or API error. Please try again later.");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Try fetching thumbnail
    let buffer = null;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {
      console.log("⚠️ Thumbnail not found, skipping image.");
    }

    // 🔹 Caption info
    const caption = `
╔══🎶 *SONG DOWNLOADER* 🎶══
🎵 *Title:* ${meta.title}
⏱ *Duration:* ${meta.duration}
👤 *Channel:* ${meta.channel}
🔗 *Link:* ${meta.url}
╚═══════════════════════

🎧 *Downloading...* ⏳
Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send song info card
    await conn.sendMessage(from, { image: buffer, caption }, { quoted: mek });

    // 🔹 Send audio file (playable)
    await conn.sendMessage(from, {
      audio: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

    // 🔹 Send as document (downloadable)
    await conn.sendMessage(from, {
      document: { url: dlUrl },
      mimetype: "audio/mpeg",
      fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("❌ song4 command error:", err);
    reply("⚠️ Error fetching song. Please try again later.");
  }
});
