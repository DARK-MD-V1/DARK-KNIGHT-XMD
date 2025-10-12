const { cmd } = require('../command')
const fetch = require('node-fetch')

cmd({
  pattern: "song2",
  react: "🎵",
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  use: ".song2 <query>",
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


cmd({
  pattern: "ytmp4",
  react: "🎬",
  desc: "Download YouTube video via Nekolabs API",
  category: "download",
  use: ".video2 <YouTube link>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a valid YouTube video link.");

    // 🔹 API Call
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(q)}&format=360`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // 🔹 Validate response
    if (!data?.success || !data?.result?.downloadUrl) {
      return reply("❌ Video not found or API error. Try again later.");
    }

    const result = data.result;

    // 🔹 Try to fetch thumbnail
    let buffer = null;
    try {
      const thumbRes = await fetch(result.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {}

    // 🔹 Caption
    const caption = `
🎞 *Title:* ${result.title}
📺 *Type:* ${result.type}
📦 *Quality:* ${result.quality}p
⏱ *Duration:* ${result.duration}
⌛ *ResponseTime:* ${data.responseTime}

🔗 *Download Link:* ${result.downloadUrl}

🎥 *Downloading Video..*⏳

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

    // 🔹 Send thumbnail first
    await conn.sendMessage(from, {
      image: buffer,
      caption
    }, { quoted: mek });

    // 🔹 Send the actual video
    await conn.sendMessage(from, {
      video: { url: result.downloadUrl },
      mimetype: "video/mp4",
      fileName: `${result.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp4`
    }, { quoted: mek });

  } catch (err) {
    console.error("video2 cmd error:", err);
    reply("⚠️ An error occurred while downloading the video.");
  }
});
