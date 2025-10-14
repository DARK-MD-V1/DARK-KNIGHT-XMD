const {cmd , commands} = require('../command');
const axios = require("axios");

cmd({
    pattern: "news3",
    desc: "Get the latest Sri Lankan news headlines.",
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
            let available = Object.keys(sources).map(s => `🔹 *${s}*`).join("\n");
            return reply(`⚙️ Please specify a valid news source.\n\nAvailable sources:\n${available}\n\n📌 Example: *.news2 hiru*`);
        }

        const response = await axios.get(sources[source]);
        // Each API has slightly different JSON structure, normalize it
        let articles = [];
        if (response.data.datas) {
            articles = response.data.datas; // Hiru / Tharuzz
        } else if (response.data.results) {
            articles = [response.data.results]; // Supun APIs return single object
        }

        if (!articles.length) return reply("⚠️ No news articles found.");

        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            const title = article.title || "No Title";
            const description = article.description || "No Description";
            const link = article.url || article.link || "No Link";
            const image = article.image;

            const message = `
📰 *${title}*

🧾 _${description}_

🔗 ${link}

© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
            `;

            if (image) {
                await conn.sendMessage(from, { image: { url: image }, caption: message });
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
