const { cmd } = require("../command");
const axios = require("axios");
const NodeCache = require("node-cache");

// Cache setup
const movieCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

cmd({
  pattern: "pirate",
  alias: ["pira"],
  desc: "🏴‍☠️ Search Sinhala subbed movies from Pirate.lk",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text: "Use: .pirate <movie name>"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `pirate_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    // 🔍 Fetch Search Results if not cached
    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/pirate/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data.all?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }

    // 🎬 Build Movie List
    const movieList = data.data.all.map((m, i) => ({
      number: i + 1,
      title: m.title,
      year: m.year,
      imdb: m.imdb || "N/A",
      type: m.type,
      image: m.image,
      link: m.link,
      description: m.description
    }));

    let textList = "🏴‍☠️ *Pirate.lk Sinhala Movies*\n━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔹 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `📑 *Search Results*\n\n${textList}\n━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });

    const movieMap = new Map();

    // 👂 Listener for replies
    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      // ❌ Cancel search
      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "*Search cancelled.*" }, { quoted: msg });
      }

      // 🎥 Movie selected
      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, { text: "*Invalid movie number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        // 🛰 Fetch movie details
        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/pirate/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, { text: "*No download links available.*" }, { quoted: msg });
        }

        // 📝 Build movie info
        let info =
          `🎬 *${movie.maintitle || movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb?.value || "N/A"}\n` +
          `🎭 *Category:* ${movie.category?.join(", ") || "Unknown"}\n` +
          `🕐 *Runtime:* ${movie.runtime}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `📅 *Released:* ${movie.dateCreate}\n\n` +
          `📖 *Description:*\n${movie.description?.slice(0, 400) || "No description"}...\n\n`;

        movie.downloadUrl.forEach((d, i) => {
          info += `📥 ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });
        info += "\n💬 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage || selected.image },
          caption: `📑 *Movie Info*\n\n${info}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadUrl });
      }

      // 💾 Handle download selection
      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, { text: "*Invalid link number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📦", key: msg.key } });

        // 🧠 Convert Pixeldrain / Google Drive to direct links
        let directLink = chosen.link;
        if (directLink.includes("pixeldrain.com")) {
          const match = directLink.match(/\/([A-Za-z0-9]+)$/);
          if (match) directLink = `https://pixeldrain.com/api/file/${match[1]}`;
        } else if (directLink.includes("drive.google.com/file/d/")) {
          const match = directLink.match(/\/d\/([A-Za-z0-9_-]+)\//);
          if (match) directLink = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }

        // ✅ Check file size
        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        // ⚠️ Large file -> send link instead
        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text: `*Large File (${chosen.size})*\n🔗 Direct Link:\n${directLink}`
          }, { quoted: msg });
        }

        // ✅ Send movie file directly
        await conn.sendMessage(from, {
          document: { url: directLink },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption: `🎬 *Your Movie is Ready!*\n\n🎥 ${selected.title}\n📺 ${chosen.quality}\n💾 ${chosen.size}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek });
  }
});
