const { cmd } = require('../command')
const fetch = require('node-fetch')
const yts = require('yt-search')

cmd({
  pattern: "song3",
  react: "🎶",
  desc: "Download YouTube song",
  category: "download",
  use: ".song3 <query>",
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
👤 *Channel:* ${meta.channel}
⏱ *Duration:* ${meta.duration}
🔗 *Link:* ${meta.url}
╚═══════════════
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
