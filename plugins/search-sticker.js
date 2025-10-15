const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "searchsti",
    alias: ["stickers"],
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

        // Filter only PNG stickers
        const pngResults = response.data.results.filter(pack => pack.thumbnailUrl?.endsWith(".webp"));

        if (!pngResults.length) {
            return reply("❌ No webp stickers found. Try different keywords.");
        }

        await reply(`✅ Found *${pngResults.length}* webp results for *"${query}"*. Sending top 10...`);

        const selected = pngResults
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
                console.warn(`⚠️ Failed to send Sticker: ${pack.thumbnailUrl}`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Sticker Search Error:', error);
        reply(`❌ Error: ${error.message || "Failed to fetch sticker"}`);
    }
});
