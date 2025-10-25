const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd, commands } = require("../command");

cmd({
  'pattern': "tourl",
  'alias': ["imgtourl", "imgurl", "url", "geturl", "upload"],
  'react': '🖇',
  'desc': "Convert media to Catbox URL",
  'category': "utility",
  'use': ".tourl [reply to media]",
  'filename': __filename
}, async (client, message, args, { reply }) => {
  try {
    // Check if quoted message exists and has media
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType) {
      throw "Please reply to an image, video, or audio file";
    }

    // Download the media
    const mediaBuffer = await quotedMsg.download();
    const tempFilePath = path.join(os.tmpdir(), `catbox_upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Get file extension based on mime type
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';
    
    const fileName = `file${extension}`;

    // Prepare form data for Catbox
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
    form.append('reqtype', 'fileupload');

    // Upload to Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!response.data) {
      throw "Error uploading to Catbox";
    }

    const mediaUrl = response.data;
    fs.unlinkSync(tempFilePath);

    // Determine media type for response
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = 'Image';
    else if (mimeType.includes('video')) mediaType = 'Video';
    else if (mimeType.includes('audio')) mediaType = 'Audio';

    // Send response
    await reply(
      `*${mediaType} Uploaded Successfully*\n\n` +
      `*Size:* ${formatBytes(mediaBuffer.length)}\n` +
      `*URL:* ${mediaUrl}\n\n` +
      `> © Uploaded by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ☣️`
    );

  } catch (error) {
    console.error(error);
    await reply(`Error: ${error.message || error}`);
  }
});

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}



cmd({
  pattern: "img2url",
  alias: ["imgurl2", "url2", "geturl2"],
  react: "🖇",
  desc: "Upload images to ImgBB and get direct link",
  category: "utility",
  use: ".img2url [reply to image]",
  filename: __filename,
}, async (client, message, args, { reply }) => {
  try {
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || "";

    if (!mimeType || !mimeType.startsWith("image/")) {
      throw "⚠️ Please reply to an image (JPG, PNG, or GIF)";
    }

    // Download image to temp file
    const mediaBuffer = await quotedMsg.download();
    const tempFilePath = path.join(os.tmpdir(), `imgbb_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Create form data as multipart/form-data
    const form = new FormData();
    form.append("image", fs.createReadStream(tempFilePath));
    // Optional expiration in seconds (here: 10 minutes)
    const expiration = 600;

    const imgbbApiKey = "eb6ec8d812ae32e7a1a765740fd1b497";

    // POST to ImgBB API
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?expiration=${expiration}&key=${imgbbApiKey}`,
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(tempFilePath); // delete temp file after upload

    const data = response.data.data;
    if (!data || !data.url) throw "❌ Upload failed.";

    // Reply with formatted info
    await reply(
      `✅ *Image Uploaded Successfully!*\n\n` +
      `🖼 *Filename:* ${data.image.filename}\n` +
      `📏 *Size:* ${formatBytes(mediaBuffer.length)}\n` +
      `🔗 *Direct URL:* ${data.url}\n` +

      `> © Uploaded by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 ☣️`
    );

  } catch (error) {
    console.error(error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});

// Helper function
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
