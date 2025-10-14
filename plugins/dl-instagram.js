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
  desc: "Download Instagram videos and reels.",
  category: "download",
  use: ".igvid <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Validate URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('⚠️ Please provide a valid Instagram video URL.\n\nExample: `.igvid https://www.instagram.com/reel/...`');
    }

    // React while processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // API URL
    const apiUrl = `https://api.nexoracle.com/downloader/insta?apikey=free_key@maher_apis&url=${encodeURIComponent(igUrl)}`;

    // Fetch from API
    const { data } = await axios.get(apiUrl);

    if (!data || data.status !== 200 || !data.result) {
      return reply('❌ Unable to fetch Instagram video. Please check the URL and try again.');
    }

    const result = data.result;
    const post = result.post_info || {};
    const media = result.media_details?.[0] || {};
    const videoUrl = media.url || result.url_list?.[0];

    if (!videoUrl) {
      return reply('⚠️ No downloadable video found for this post.');
    }

    // Basic info
    const username = post.owner_username || "Unknown User";
    const fullname = post.owner_fullname || "";
    const caption = post.caption || "";
    const likes = post.likes ? post.likes.toLocaleString() : "0";
    const views = media.video_view_count ? media.video_view_count.toLocaleString() : "0";
    const thumbnail = media.thumbnail || null;

    // Notify user
    await reply(`📥 *Downloading Instagram Reel by @${username}... Please wait.*`);

    // Download the video
    const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
    const videoBuffer = Buffer.from(videoResponse.data, "binary");

    // Prepare caption
    const captionText = 
      `🎬 *Instagram Reel Downloader*\n\n` +
      `👤 *User*: ${fullname ? `${fullname} (@${username})` : `@${username}`}\n` +
      `❤️ *Likes*: ${likes}\n👁️ *Views*: ${views}\n\n` +
      (caption ? `📝 *Caption*: ${caption}\n\n` : "") +
      `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

    // Send the video
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: captionText,
      jpegThumbnail: thumbnail ? await (await axios.get(thumbnail, { responseType: "arraybuffer" })).data : null,
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

    // React success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("Instagram download error:", error);
    reply('❌ Failed to download the Instagram video. Please try again later.');
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
