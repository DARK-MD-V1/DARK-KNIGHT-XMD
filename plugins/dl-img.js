const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    react: "🦋",
    desc: "Search and download Google images",
    category: "download",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🖼️ Please provide a search query\nExample: .img cute cats");
        }

        await reply(`🔍 Searching images for *"${query}"*...`);

        const url = `https://malvin-api.vercel.app/search/gimage?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.status || !response.data.result?.length) {
            return reply("❌ No images found. Try different keywords.");
        }

        const result = response.data.result.url;
        await reply(`✅ Found *${results.length}* results for *"${query}"*. Sending top 5...`);

        const selectedImages = result
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            try {
                await conn.sendMessage(
                    from,
                    {
                        image: { url: imageUrl },
                        caption: `📷 Result for: *${query}*\n\nRequested by: @${m.sender.split('@')[0]}\n> © Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`,
                        contextInfo: { mentionedJid: [m.sender] }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn(`⚠️ Failed to send image: ${imageUrl}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        reply(`❌ Error: ${error.message || "Failed to fetch images"}`);
    }
});


cmd({
    pattern: "image",
    react: "🖼️",
    desc: "Search and download Images",
    category: "download",
    use: ".image <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🖼️ Please provide a search term!\nExample: *.image car*");
        }

        await reply(`🔍 Searching Images for *"${query}"*...`);

        const apiUrl = `https://sadiya-tech-apis.vercel.app/search/wallpaperscraft?q=${encodeURIComponent(query)}&apikey=YOU_API_KEY`;
        const response = await axios.get(apiUrl);

        if (!response.data?.status || !response.data?.result?.images?.length) {
            return reply("❌ No Images found. Try a different keyword.");
        }

        const results = response.data.result.images;
        await reply(`✅ Found *${results.length}* Images for *"${query}"*. Sending top 5...`);

        // Randomly pick 5 images
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            try {
                await conn.sendMessage(
                    from,
                    {
                        image: { url: imageUrl },
                        caption: `🖼️ Image for: *${query}*\n\nRequested by: @${m.sender.split('@')[0]}\n> © Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`,
                        contextInfo: { mentionedJid: [m.sender] }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn(`⚠️ Failed to send Image: ${imageUrl}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        reply(`❌ Error: ${error.message || "Failed to fetch wallpapers"}`);
    }
});
