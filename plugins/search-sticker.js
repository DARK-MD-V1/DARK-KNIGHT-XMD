const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "searchsti",
    react: "✨",
    desc: "Search sticker packs from Stickerly",
    category: "download",
    use: ".sticker <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("💫 Please provide a search query\nExample: .sticker baby");
        }

        await reply(`🔍 Searching sticker packs for *"${query}"*...`);

        const url = `https://supun-md-api-rho.vercel.app/api/search/sticker?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length) {
            return reply("❌ No sticker packs found. Try different keywords.");
        }

        const results = response.data.results;
        await reply(`✅ Found *${results.length}* sticker packs for *"${query}"*. Sending top 5...`);

        const selectedPacks = results.slice(0, 5);

        for (const pack of selectedPacks) {
            const caption = `
🧩 *${pack.name}*
👤 Author: ${pack.author}
🖼️ Stickers: ${pack.stickerCount}
👁️ Views: ${pack.viewCount}
📤 Downloads: ${pack.exportCount}
🎞️ Animated: ${pack.isAnimated ? "Yes" : "No"}
🔗 Link: ${pack.url}

> © Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
Requested by: @${m.sender.split('@')[0]}
`;

            try {
                await conn.sendMessage(
                    from,
                    {
                        image: { url: pack.thumbnailUrl },
                        caption,
                        contextInfo: { mentionedJid: [m.sender] }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn(`⚠️ Failed to send sticker pack: ${pack.name}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error("Sticker Search Error:", error);
        reply(`❌ Error: ${error.message || "Failed to fetch sticker packs"}`);
    }
});


cmd({
    pattern: "searchsti2",
    react: "🦋",
    desc: "Search and download Google images",
    category: "download",
    use: ".searchsti <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🦋 Please provide a search query\nExample: .searchsti cats");
        }

        await reply(`🔍 Searching Stickers for *"${query}"*...`);

        const url = `https://supun-md-api-rho.vercel.app/api/search/sticker?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length) {
            return reply("❌ No images found. Try different keywords.");
        }

        const results = response.data.results;
        await reply(`✅ Found *${results.length}* results for *"${query}"*. Sending top 10...`);

        const selected = results
            .sort(() => 0.10 - Math.random())
            .slice(0, 10);

        for (const pack of selected) {
            try {
                await conn.sendMessage(
                    from,
                    {
                        sticker: { url: pack.thumbnailUrl }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn(`⚠️ Failed to send Sticker: ${thumbnailUrl}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Sticker Search Error:', error);
        reply(`❌ Error: ${error.message || "Failed to fetch sticker"}`);
    }
});
