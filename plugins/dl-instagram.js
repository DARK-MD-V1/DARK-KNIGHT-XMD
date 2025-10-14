const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "instagram",
  alias: ["insta"],
  react: '📥',
  desc: "Download Instagram posts (image or video) using Sadiya API.",
  category: "download",
  use: ".insta <Instagram post URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('❌ Please provide a valid Instagram post URL.\n\nExample: `.insta https://www.instagram.com/reel/...`');
    }

    // React: processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Call Sadiya API
    const apiUrl = `https://sadiya-tech-apis.vercel.app/download/igdl?url=${encodeURIComponent(igUrl)}&apikey=sadiya`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.status || !response.data.result || !response.data.result.dl_link) {
      return reply('❌ Failed to fetch download link. Please check the URL and try again.');
    }

    const downloadUrl = response.data.result.dl_link;

    // Download file buffer
    const fileResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(fileResponse.data, 'binary');

    // Try to detect video or image from URL extension
    const isVideo = downloadUrl.includes(".mp4");

    const captionText =
      `📥 *Instagram Downloader*\n\n` +
      `🔗 *Url* Downloaded. ✅\n` +
      `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

    if (isVideo) {
      await conn.sendMessage(from, {
        video: fileBuffer,
        caption: captionText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363400240662312@newsletter',
            newsletterName: '『 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 』',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } else {
      await conn.sendMessage(from, {
        image: fileBuffer,
        caption: captionText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363400240662312@newsletter',
            newsletterName: '『 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 』',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    }

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error('❌ Error downloading Instagram media:', error);
    reply('❌ Unable to download the post. Please try again later.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


cmd({
  pattern: "igvid",
  alias: ["ig"],
  react: '📥',
  desc: "Download Instagram videos.",
  category: "download",
  use: ".igvid <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('⚠️ Please provide a valid Instagram video URL.\n\nExample:\n`.igvid https://www.instagram.com/reel/...`');
    }

    // React while processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Call the new NexOracle API
    const apiUrl = `https://api.nexoracle.com/downloader/insta?apikey=free_key@maher_apis&url=${encodeURIComponent(igUrl)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || response.data.status !== 200 || !response.data.result) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    const result = response.data.result;
    const media = result.media_details;

    if (!media || media.length === 0) {
      return reply('❌ No downloadable video found for this post.');
    }

    // Get the first video URL
    const video = media.find(x => x.type === "video") || media[0];
    const videoUrl = video.url;

    if (!videoUrl) {
      return reply('❌ Could not find video URL.');
    }

    // Get info for caption
    const info = result.post_info || {};
    const captionText =
      `📥 *Instagram Video*\n\n` +
      `👤 *User*: ${info.owner_fullname || info.owner_username || "Unknown"}\n` +
      `💬 *Caption*: ${info.caption || "No caption"}\n` +
      `❤️ *Likes*: ${info.likes || 0}\n\n` +
      `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

    await reply(`📥 *Downloading ${info.owner_username ? `from ${info.owner_username}` : "video"}...*`);

    // Download the video
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send to chat
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: captionText,
      thumbnail: { url: video.thumbnail || '' },
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400240662312@newsletter',
          newsletterName: '『 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Success reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("Instagram download error:", error);
    reply('❌ Unable to download the video. Please try again later.');
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


cmd({
  pattern: "ig2",
  alias: ["igdl"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://apis.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *Instagram Video Downloaded Successfully!*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});
