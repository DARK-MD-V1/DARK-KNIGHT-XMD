const { cmd } = require('../command');
const { File } = require('megajs');
const tharuzz_footer = "> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳";

cmd({
    pattern: "mega",
    desc: "Download mwga files",
    react: "☁️",
    category: "download",
    use: '.mega < mega file link >',
    filename: __filename
}, async (conn, mek, m, {from, reply, q}) => {
    
    if (!q || !q.includes('mega.nz')) {
        await reply("Please enter mega.nz file url !!")
    }
    try {
        await reply('☁️ start downloading mega.nz file...')
        
        const file = File.fromURL(megaUrl);
        await file.loadAttributes();
        const fileName = file.name || 'dark-knight-xmd_mega_download';
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        const buffer = await file.downloadBuffer();
        
        await conn.sendMessage(from, {
            document: buffer,
            caption: `*📥 \`MEGA file Download Successfull:\`*\n\n*📌 Name:* ${fileName}\n*📂 Size:* ${fileSizeMB} MB\n\n${tharuzz_footer}`,
            mimetype: 'application/octet-stream',
            fileName: fileName 
        }, {quoted: mek});

    } catch (e) {
        console.log("❌ Mega download Error: " + e);
        await reply("❌ Mega download Error: " + e);
    }
});
