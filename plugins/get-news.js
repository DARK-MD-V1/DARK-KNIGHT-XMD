const {cmd , commands} = require('../command');
const axios = require("axios");

cmd({
    pattern: "news",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const urls = [
            "https://supun-md-api-rho.vercel.app/api/news/gossiplank",
            "https://supun-md-api-rho.vercel.app/api/news/lankadeepa",
            "https://tharuzz-news-api.vercel.app/api/news/hiru",
            "https://supun-md-api-rho.vercel.app/api/news/itn",
            "https://supun-md-api-rho.vercel.app/api/news/sirasa",
            "https://supun-md-api-rho.vercel.app/api/news/adaderana"
        ];

        // Fetch all news sources in parallel
        const responses = await Promise.allSettled(urls.map(url => axios.get(url)));

        // Combine all articles into one array
        let articles = [];
        for (const res of responses) {
            if (res.status === "fulfilled") {
                const data = res.value.data.results || res.value.data.datas || [];
                articles.push(...data);
            }
        }

        if (!articles.length) return reply("❌ No news articles found.");

        // Limit to 5 latest articles
        articles = articles.slice(0, 5);

        for (const article of articles) {
            const title = article.title || "No title available";
            const description = article.description || "No description available";
            const url = article.url || "No link available";
            const date = article.date || "Unknown date";
            const image = article.image || article.urlToImage || null;

            const message = `
📰 *${title}*

⚠️ _${description}_

🔗 _${url}_

📅 _${date}_

©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
`;

            if (image) {
                await conn.sendMessage(from, { image: { url: image }, caption: message });
            } else {
                await conn.sendMessage(from, { text: message });
            }
        }
    } catch (e) {
        console.error("Error fetching news:", e);
        reply("⚠️ Could not fetch news. Please try again later.");
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
