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

        // Vajira API Link
        const api = `https://vajira-api.vercel.app/search/sticker?q=${encodeURIComponent(query)}`;
        const response = await axios.get(api);

        // Validate JSON structure
        if (!response.data?.status || !response.data.result?.sticker_url?.length) {
            return reply("❌ No stickers found. Try different keywords.");
        }

        const stickerList = response.data.result.sticker_url;

        await reply(
            `✨ *${response.data.result.title}* Pack Found!\n` +
            `📦 Total Stickers: *${stickerList.length}*\n\n` +
            `🧚‍♀️ Sending top 10 stickers...`
        );

        // Randomize & Slice first 10
        const selected = stickerList
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        for (const url of selected) {
            try {
                await conn.sendMessage(
                    from,
                    {
                        sticker: { url: url }
                    },
                    { quoted: mek }
                );
            } catch (error) {
                console.warn("⚠️ Failed to send sticker:", url);
            }

            await new Promise(resolve => setTimeout(resolve, 800));
        }

    } catch (error) {
        console.error("Sticker Search Error:", error);
        reply(`❌ Error: ${error.message || "Something went wrong."}`);
    }
});
