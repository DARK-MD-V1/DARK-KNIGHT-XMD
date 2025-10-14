const {cmd , commands} = require('../command');
const axios = require("axios");

cmd({
    pattern: "news4",
    desc: "Get the latest Sri Lankan news headlines via buttons.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Button list
        const buttons = [
            { buttonId: "news_hiru", buttonText: { displayText: "Hiru News" }, type: 1 },
            { buttonId: "news_adaderana", buttonText: { displayText: "Ada Derana" }, type: 1 },
            { buttonId: "news_sirasa", buttonText: { displayText: "Sirasa" }, type: 1 },
            { buttonId: "news_lankadeepa", buttonText: { displayText: "Lankadeepa" }, type: 1 },
            { buttonId: "news_gossiplank", buttonText: { displayText: "Gossip Lanka" }, type: 1 },
            { buttonId: "news_itn", buttonText: { displayText: "ITN" }, type: 1 },
            { buttonId: "news3", buttonText: { displayText: "All Sources" }, type: 1 },
        ];

        const buttonMessage = {
            text: "🗞️ *Select a news source to get latest headlines:*",
            buttons: buttons,
            headerType: 1
        };

        await conn.sendMessage(from, buttonMessage);

    } catch (e) {
        console.error("Error sending buttons:", e);
        reply("❌ Could not load news buttons. Please try again later.");
    }
});



cmd({
    pattern: "news3",
    desc: "Get the latest Sri Lankan news headlines (stylish paththata view).",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const source = (args[0] || "").toLowerCase();
        const sources = {
            hiru: "https://tharuzz-news-api.vercel.app/api/news/hiru",
            gossiplanka: "https://supun-md-api-rho.vercel.app/api/news/gossiplank",
            lankadeepa: "https://supun-md-api-rho.vercel.app/api/news/lankadeepa",
            itn: "https://supun-md-api-rho.vercel.app/api/news/itn",
            sirasa: "https://supun-md-api-rho.vercel.app/api/news/sirasa",
            adaderana: "https://supun-md-api-rho.vercel.app/api/news/adaderana"
        };

        if (!source || !sources[source]) {
            const available = Object.keys(sources)
                .map(s => `🔹 *${s}*`)
                .join("\n");
            return reply(
                `⚙️ Please specify a valid news source.\n\nAvailable sources:\n${available}\n\n📌 Example: *.news6 hiru*`
            );
        }

        const response = await axios.get(sources[source]);
        let articles = [];
        if (response.data.datas) {
            articles = response.data.datas;
        } else if (response.data.results) {
            articles = [response.data.results];
        }

        if (!articles.length) return reply("⚠️ No news articles found.");

        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            const title = article.title?.trim() || "No Title";
            const description = article.description?.trim() || "No Description";
            const link = article.url || article.link || "No Link";
            const date = article.date?.trim() || "";
            const image = article.image;

            // Paththata / stylish newspaper-style layout
            const message = `
╔═══════════════❖
║ 📰 *${title}*
╠═══════════════❖
${date ? `║ 🗓 _${date}_\n` : ""}║ 📝 _${description}_
║
║ 🔗 ${link}
╚═══════════════❖
© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
            `.trim();

            if (image) {
                await conn.sendMessage(from, {
                    image: { url: image },
                    caption: message
                });
            } else {
                await conn.sendMessage(from, { text: message });
            }
        }
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("❌ Could not fetch news. Please try again later.");
    }
});



cmd({
    pattern: "news",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const apiKey="0f2c43ab11324578a7b1709651736382";
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles;

        if (!articles.length) return reply("No news articles found.");

        // Send each article as a separate message with image and title
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            let message = `
📰 *${article.title}*
⚠️ _${article.description}_
🔗 _${article.url}_

  ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
            `;

            console.log('Article URL:', article.urlToImage); // Log image URL for debugging

            if (article.urlToImage) {
                // Send image with caption
                await conn.sendMessage(from, { image: { url: article.urlToImage }, caption: message });
            } else {
                // Send text message if no image is available
                await conn.sendMessage(from, { text: message });
            }
        };
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.");
    }
});


cmd({
    pattern: "news2",
    desc: "Get the latest Hiru News headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch from Tharuzz News API
        const response = await axios.get('https://tharuzz-news-api.vercel.app/api/news/hiru');
        const articles = response.data?.datas || [];

        if (!articles.length) return reply("⚠️ No news articles found.");

        // Send each article (limit to 5)
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            const message = `
📰 *${article.title || "No Title"}*

🧾 _${article.description || "No Description"}_

🔗 ${article.link || "No Link"}

© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
            `;

            if (article.image) {
                await conn.sendMessage(from, {
                    image: { url: article.image },
                    caption: message
                });
            } else {
                await conn.sendMessage(from, { text: message });
            }
        };
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("❌ Could not fetch news. Please try again later.");
    }
});
