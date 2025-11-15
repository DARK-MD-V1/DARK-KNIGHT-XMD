const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "searchsti",
    alias: ["stickers"],
    react: "🦋",
    desc: "Search and download stickers using Vajira API",
    category: "download",
    use: ".searchsti <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🦋 Please provide a search query\nExample: .searchsti cat");
        }

        await reply(`🔍 Searching Stickers for *"${query}"*...`);

        const api = `https://vajira-api.vercel.app/search/sticker?q=${encodeURIComponent(query)}`;
        const response = await axios.get(api);

        if (!response.data?.status || !response.data.result?.sticker_url?.length) {
            return reply("❌ No stickers found. Try different keywords.");
        }

        // Raw sticker list
        const stickerList = response.data.result.sticker_url;

        // ⭐ ADD WEBP Filter Here (requested)
        const webpResults = stickerList.filter(url => url.endsWith(".webp"));

        if (!webpResults.length) {
            return reply("❌ No .webp stickers found in this pack.");
        }

        await reply(
            `📦 Total Webp Stickers: *${webpResults.length}*\n\n` +
            `🧚‍♀️ Sending top 10 stickers...`
        );

        // Random 10
        const selected = webpResults
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        for (const url of selected) {
            try {
                await conn.sendMessage(
                    from,
                    {
                        sticker: { url }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn("⚠️ Failed to send sticker:", url);
            }

            await new Promise(resolve => setTimeout(resolve, 800));
        }

    } catch (error) {
        console.error("Sticker Search Error:", error);
        reply(`❌ Error: ${error.message || "Something went wrong."}`);
    }
});
