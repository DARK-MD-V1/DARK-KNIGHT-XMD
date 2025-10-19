const axios = require("axios");
const config = require('../settings');
const { cmd } = require('../command');

cmd({
  pattern: "sss",
  react: "💫",
  desc: "Capture a full-page screenshot of a website.",
  category: "utility",
  use: ".sss <url>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const url = args[0];
    if (!url) {
      return reply("❌ Please provide a valid URL. Example: `.screenshot https://github.com`");
    }

    // Validate the URL
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return reply("❌ Invalid URL. Please include 'http://' or 'https://'.");
    }

    // Generate the screenshot URL using Thum.io API
    const screenshotUrl = `https://image.thum.io/get/fullpage/${url}`;

    // Send the screenshot as an image message
    await conn.sendMessage(from, {
      image: { url: screenshotUrl },
      caption: `*WEB SS DOWNLOADER*\n\n> *© Powered By 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*`,
      contextInfo: {
        mentionedJid: [msg.sender], // Fix: Use `msg.sender` instead of `m.sender`
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400240662312@newsletter',
          newsletterName: "𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳",
          serverMessageId: 143,
        },
      },
    }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    reply("❌ Failed to capture the screenshot. Please try again.");
  }
});
