const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "getimage",
    desc: "Convert image URL to WhatsApp image",
    alias: ["imagefromurl", "fetchimage"],
    category: "media",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) return reply('Please provide an image URL\nExample: !getimage https://example.com/image.jpg');

        const imageUrl = text.trim();

        // Validate URL
        if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
            return reply('❌ Invalid image URL! Must be direct link to image (jpg/png/gif/webp)');
        }

        // Verify the image exists
        try {
            const response = await axios.head(imageUrl);
            if (!response.headers['content-type']?.startsWith('image/')) {
                return reply('❌ URL does not point to a valid image');
            }
        } catch (e) {
            return reply('❌ Could not access image URL. Please check the link');
        }

        // Send the image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: 'Here is your image from the URL'
        }, { quoted: mek });

    } catch (error) {
        console.error('GetImage Error:', error);
        reply('❌ Failed to process image. Error: ' + error.message);
    }
});


cmd({
  pattern: "videonote",
  alias: ["videon"],
  desc: "Send video note from URL",
  category: "media",
  use: '.videonote',
  filename: __filename
},
async (conn, m, mdata, { from, reply }) => {
  try {
    const videoUrl = 'https://files.catbox.moe/h6d32b.mp4'; // 🟢 Replace with your video URL

    reply("📥 Downloading video...");

    const response = await axios.get(videoUrl, {
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data);

    await conn.sendMessage(from, {
      video: buffer,
      mimetype: 'video/mp4',
      caption: '🎥 *Here is your video note!*',
    }, {
      quoted: m,
      contextInfo: {
        isVideoNote: true // 🎯 Make it appear as a round video
      }
    });

  } catch (err) {
    console.error(err);
    reply("❌ Error sending video note.");
  }
});
