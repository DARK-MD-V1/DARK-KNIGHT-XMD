const {cmd , commands} = require('../command');
const axios = require("axios");

const newsApis = [
    { name: "📰 GOSSIPLANKA-News 📰", url: "https://supun-md-api-rho.vercel.app/api/news/gossiplank" },
    { name: "📰 LANKADEEPA-News 📰", url: "https://supun-md-api-rho.vercel.app/api/news/lankadeepa" },
    { name: "📰 ITN-News 📰", url: "https://supun-md-api-rho.vercel.app/api/news/itn" },
    { name: "📰 SIRASA-News 📰", url: "https://supun-md-api-rho.vercel.app/api/news/sirasa" },
    { name: "📰 ADADERANA-News 📰", url: "https://supun-md-api-rho.vercel.app/api/news/adaderana" },
    { name: "📰 HIRU-News 📰", url: "https://tharuzz-news-api.vercel.app/api/news/hiru" }
];

cmd({
    pattern: "news",
    desc: "Get the latest Sri Lankan news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        for (let api of newsApis) {
            const response = await axios.get(api.url);
            let articles = response.data.results || response.data.datas || response.data;

            if (!articles || !articles.length) continue;

            // Send top 3 articles from each source
            for (let i = 0; i < Math.min(articles.length, 10); i++) {
                const article = articles[i];
                let message = `
Source: *${api.name}*

📑 *${article.title || "No title"}*

⚠️ _${article.description || "No description"}_

🔗 _${article.url || "No URL"}_

📅 _${article.date || "No Date"}_

©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
                `;

                if (article.image || article.urlToImage) {
                    await conn.sendMessage(from, { image: { url: article.image || article.urlToImage }, caption: message });
                } else {
                    await conn.sendMessage(from, { text: message });
                }
            }
        }
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.");
    }
});


cmd({
    pattern: "news2",
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
