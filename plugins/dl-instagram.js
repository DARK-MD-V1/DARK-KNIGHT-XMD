const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "igimagedl",
  alias: ["igimage"],
  react: '📥',
  desc: "Download Instagram posts (images or videos).",
  category: "download",
  use: ".igdl <Instagram post URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided an Instagram URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram post URL. Example: `.igdl https://instagram.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://api.fgmods.xyz/api/downloader/igdl?url=${encodeURIComponent(igUrl)}&apikey=E8sfLg9l`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result) {
      return reply('❌ Unable to fetch the post. Please check the URL and try again.');
    }

    // Extract the post details
    const { url, caption, username, like, comment, isVideo } = response.data.result;

    // Inform the user that the post is being downloaded
    await reply(`📥 *Downloading Instagram post by @${username}... Please wait.*`);

    // Download and send each media item
    for (const mediaUrl of url) {
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      if (!mediaResponse.data) {
        return reply('❌ Failed to download the media. Please try again later.');
      }

      const mediaBuffer = Buffer.from(mediaResponse.data, 'binary');

      if (isVideo) {
        // Send as video
        await conn.sendMessage(from, {
          video: mediaBuffer,
          caption: `📥 *Instagram Post*\n\n` +
            `👤 *Username*: @${username}\n` +
            `❤️ *Likes*: ${like}\n` +
            `💬 *Comments*: ${comment}\n` +
            `📝 *Caption*: ${caption || "No caption"}\n\n` +
            `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`,
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
        // Send as image
        await conn.sendMessage(from, {
          image: mediaBuffer,
          caption: `📥 *Instagram Post*\n\n` +
            `👤 *Username*: @${username}\n` +
            `❤️ *Likes*: ${like}\n` +
            `💬 *Comments*: ${comment}\n` +
            `📝 *Caption*: ${caption || "No caption"}\n\n` +
            `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`,
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
    }

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading Instagram post:', error);
    reply('❌ Unable to download the post. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
// VIDEO SECTION

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
  alias: ["igvid2"],
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
