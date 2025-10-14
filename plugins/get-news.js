const {cmd , commands} = require('../command');
const axios = require("axios");

cmd({
    pattern: "news3",
    desc: "Get the latest Sri Lankan news headlines in one message.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const newsAPIs = [
            "https://supun-md-api-rho.vercel.app/api/news/gossiplank",
            "https://supun-md-api-rho.vercel.app/api/news/lankadeepa",
            "https://tharuzz-news-api.vercel.app/api/news/hiru",
            "https://supun-md-api-rho.vercel.app/api/news/itn",
            "https://supun-md-api-rho.vercel.app/api/news/sirasa",
            "https://supun-md-api-rho.vercel.app/api/news/adaderana"
        ];

        let allNews = [];

        for (let api of newsAPIs) {
            const response = await axios.get(api);
            const data = response.data;
            const articles = data.results ? [data.results] : data.datas || [];

            articles.forEach(article => {
                if (!article.title) return; // skip empty titles
                allNews.push({
                    title: article.title,
                    description: article.description || "No description available",
                    url: article.url,
                    date: article.date || "Date not provided",
                    image: article.image || article.urlToImage || null
                });
            });
        }

        if (!allNews.length) return reply("No news found at the moment.");

        // Prepare single message
        let message = "📰 *Latest Sri Lankan News Headlines*\n\n";
        allNews.slice(0, 10).forEach((news, index) => { // show up to 10 news items
            message += `${index + 1}. *${news.title}*\n`;
            message += `⚠️ _${news.description}_\n`;
            message += `🔗 _${news.url}_\n`;
            message += `📅 _${news.date}_\n\n`;
        });

        // Send the message
        await conn.sendMessage(from, { text: message });

    } catch (e) {
        console.error("Error fetching news:", e);
        reply("Could not fetch news. Please try again later.");
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
