const { cmd } = require('../lib/command');
const axios = require("axios");

cmd({
    pattern: "download",
    alias: ["downurl"],
    use: ".download <direct url>",
    react: "⬇️",
    desc: "Download any direct video or audio link.",
    category: "download",
    filename: __filename
},

async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) {
            return reply("❗ *කරුණාකර download link එකක් දෙන්න.*");
        }

        const url = q.trim();
        const regex = /^(https?:\/\/[^\s]+)/;

        if (!regex.test(url)) {
            return reply("❗ *ඔබ දීපු Link එක වැරදියි. හොඳින් බලන්න.");
        }

        let head = await axios.head(url).catch(() => null);

        if (!head || !head.headers) {
            return reply("⚠️ *File info එක check කරන්න බැරි වුණා.*");
        }

        let mime = head.headers["content-type"] || "application/octet-stream";
        let sizeBytes = head.headers["content-length"] ? parseInt(head.headers["content-length"]) : null;

        if (sizeBytes) {
            let sizeGB = sizeBytes / (1024 * 1024 * 1024);

            if (sizeGB > 2) {
                return conn.sendMessage(
                    from,
                    { text: `⚠️ *File Size Too Large (${sizeGB.toFixed(2)} GB).*  
🚫 *2GB ට වැඩි files download කරන්න බෑ.*` },
                    { quoted: mek }
                );
            }
        }

        let extension = "";
        if (mime.includes("video")) extension = ".mp4";
        else if (mime.includes("audio")) extension = ".mp3";
        else extension = ".bin";

        let filename = `Gojo-Download${extension}`;

        let info =
            `*📥 Downloaded*\n\n` +
            `🎞 MIME: ${mime}\n` +
            (sizeBytes ? `📦 Size: ${(sizeBytes / (1024 * 1024)).toFixed(2)} MB\n` : "") +
            `© Created by Sayura Mihiranga`;
 
        await conn.sendMessage(
            from,
            {
                document: { url: url },
                mimetype: mime,
                fileName: filename,
                caption: info
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("❗ Error: " + e.message);
    }
});
