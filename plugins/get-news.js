const axios = require('axios');
const { cmd } = require('../command');
const { fetchJson } = require("../lib/functions");

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
    react: "📰",
    desc: "Get hiru latest news.",
    category: "news",
    use: ".hiru",
    filename: __filename,
    },
    async (conn, mek, { from, reply }) => {
        try {
            
            const apiUrl = `https://tharuzz-news-api.vercel.app/api/news/hiru?`;
            const hiruData = await fetchJson(apiUrl);

            
            if ( !hiruData.datas || hiruData.datas.length === 0) {
                return reply("❌ පුවත් සොයාගත නොහැකි විය.");
            }

          //  const results = hiruData.datas;
            const news = hiruData.datas;
            const caption = `
📰 *Hiru News.* 📰

📰 Title :* \`${news.title || 'N/A'}\`
⚠️ *Description :* \`${news.desciption || 'N/A'}\`
🔗 *Link :* ${news.link || 'N/A'}

> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`.trim();

                await conn.sendMessage(from, { image: { url: news.image }, caption }, { quoted: mek });
                
                
            
        } catch (e) {
            console.error("❌ News error: ", e);
            return reply(`❌ News plugin error: ${e.message}`);
        }
    }
);
