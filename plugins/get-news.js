const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "news3",
    desc: "Get the latest Sri Lankan news headlines from multiple sources.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // All news sources
        const sources = [
            { name: "Gossip Lanka News", url: "https://supun-md-api-rho.vercel.app/api/news/gossiplank" },
            { name: "Lankadeepa News", url: "https://supun-md-api-rho.vercel.app/api/news/lankadeepa" },
            { name: "ITN News", url: "https://supun-md-api-rho.vercel.app/api/news/itn" },
            { name: "Sirasa News", url: "https://supun-md-api-rho.vercel.app/api/news/sirasa" },
            { name: "Ada Derana News", url: "https://supun-md-api-rho.vercel.app/api/news/adaderana" },
            { name: "Hiru News", url: "https://tharuzz-news-api.vercel.app/api/news/hiru" }
        ];

        reply("📡 *Fetching latest news from all sources...*");

        for (const src of sources) {
            try {
                const res = await axios.get(src.url);
                const data = res.data;

                // Handle both 'results' and 'datas' formats
                let result = data.results || (data.datas ? data.datas[0] : null);

                if (!result) {
                    await conn.sendMessage(from, { text: `❌ No news found for *${src.name}*.` });
                    continue;
                }

                // Build message
                let msg = `
📰 *${src.name} - Latest*

━━━━━━━━━━━━━━━

🗞️ *${result.title || "No Title"}*

📆 _${result.date || "No Date"}_

📝 _${result.description || "No Description"}_

🔗 _${result.url || "No Url"}_

━━━━━━━━━━━━━━━
© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
                `;

                // If image available, send image + caption
                const image = result.image || result.thumbnail || null;
                if (image) {
                    await conn.sendMessage(from, { image: { url: image }, caption: msg });
                } else {
                    await conn.sendMessage(from, { text: msg });
                }

                // Small delay between messages to avoid spam blocking
                await new Promise(res => setTimeout(res, 1500));

            } catch (err) {
                console.error(`Error fetching from ${src.name}:`, err.message);
                await conn.sendMessage(from, { text: `⚠️ Error loading news from *${src.name}*.` });
            }
        }

        reply("✅ *All news sources updated successfully!*");
        
    } catch (e) {
        console.error("Global Error:", e);
        reply("⚠️ Could not fetch news. Please try again later.");
    }
});

cmd({
    pattern: "news",
    desc: "Get the latest Sri Lankan news from all major sources at once.",
    category: "news",
     react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const sources = {
            gossiplanka: "https://supun-md-api-rho.vercel.app/api/news/gossiplank",
            lankadeepa: "https://supun-md-api-rho.vercel.app/api/news/lankadeepa",
            itn: "https://supun-md-api-rho.vercel.app/api/news/itn",
            sirasa: "https://supun-md-api-rho.vercel.app/api/news/sirasa",
            adaderana: "https://supun-md-api-rho.vercel.app/api/news/adaderana",
            hiru: "https://tharuzz-news-api.vercel.app/api/news/hiru"
        };

        reply("📰 *Fetching latest news from all major Sri Lankan sources...*");

        // Loop through all sources
        for (const [name, url] of Object.entries(sources)) {
            try {
                const res = await axios.get(url);
                const data = res.data;

                // Normalize API data
                let articles = [];
                if (Array.isArray(data.datas)) articles = data.datas;
                else if (data.results) articles = [data.results];
                else if (Array.isArray(data.result)) articles = data.result;

                if (!articles.length) continue;

                // Send only top 1 news from each source
                const a = articles[0];
                const title = a.title || a.heading || "No title";
                const description = a.description || a.desc || "";
                const image = a.image || a.img || a.thumbnail || null;
                const urlLink = a.url || a.link || "No link available";
                const date = a.date ? `🗓️ ${a.date}` : "";

                const message = `
📢 *${name.toUpperCase()} NEWS*
─────────────────────
🗞️ *${title}*
${date}

📝 ${description}

🔗 ${urlLink}

© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙆-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳
                `;

                if (image) {
                    await conn.sendMessage(from, { image: { url: image }, caption: message });
                } else {
                    await conn.sendMessage(from, { text: message });
                }

            } catch (err) {
                console.error(`Error fetching from ${name}:`, err.message);
            }
        }

        reply("✅ *All news sources updated successfully!*");

    } catch (e) {
        console.error("Error fetching Lanka news:", e);
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
