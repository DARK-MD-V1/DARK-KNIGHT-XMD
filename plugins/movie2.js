// CineSubz Sinhala Movie Plugin (Header/Footer/Box/Emojis fully inlined)

const { cmd } = require("../command");
const axios = require("axios");
const NodeCache = require("node-cache");

// Cache setup
const movieCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

cmd({
  pattern: "cinesubz",
  alias: ["cine"],
  desc: "Search Sinhala subbed movies from Cinesubz",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text:
        "📑 *Usage*\n\n" +
        "Use: `.cinesubz <movie name>`\nEg: `.cinesubz 2025`" +
        "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `cinesubz_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    // SEARCH CALL
    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/cinesubz/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data.all || data.data.all.length === 0) {
        throw new Error("No movies found!");
      }

      movieCache.set(cacheKey, data);
    }

    // BUILD MOVIE LIST
    const movieList = data.data.all.map((m, i) => ({
      number: i + 1,
      title: m.title,
      year: m.year,
      imdb: m.imdb,
      type: m.type,
      image: m.image,
      link: m.link
    }));

    let resultText =
      "🔍 *CineSubz Sinhala Movies*\n" +
      "━━━━━━━━━━━━━━━━━━\n";

    movieList.forEach(m => {
      resultText += `🔸 *${m.number}. ${m.title}*\n   🎭 ${m.type} | ⭐ ${m.imdb} | 📅 ${m.year}\n`;
    });
    resultText += `\n🔢 *Reply with movie number to continue.*`;

    const sentMsg = await conn.sendMessage(
      from,
      {
        text:
          `📑 *Search Results*\n\n${resultText}` +
          "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
      },
      { quoted: mek }
    );

    const movieMap = new Map();

    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, {
          text:
            "📑 *Cancelled*\n\nSearch cancelled." +
            "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
        }, { quoted: msg });
      }

      // SELECTED MOVIE
      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);

        if (!selected) {
          return conn.sendMessage(from, {
            text:
              "📑 *Invalid*\n\nInvalid movie number." +
              "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        const movieApi = `https://darkyasiya-new-movie-api.vercel.app/api/movie/cinesubz/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieApi);

        const movie = movieRes.data.data;
        const downloads = movie.downloadUrl || [];

        if (downloads.length === 0) {
          return conn.sendMessage(from, {
            text:
              "📑 *Unavailable*\n\nNo download links found." +
              "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        let dlText = `🎬 *${movie.title}*\n⭐ IMDB: ${movie.imdb.value}\n\n`;

        downloads.forEach((d, i) => {
          dlText += `📥 ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });
        dlText += `\nReply with quality number to download.`;

        const downloadMsg = await conn.sendMessage(
          from,
          {
            image: { url: movie.mainImage || selected.image },
            caption:
              `📑 *Download Options*\n\n${dlText}` +
              "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          },
          { quoted: msg }
        );

        movieMap.set(downloadMsg.key.id, { selected, downloads });
      }

      // QUALITY SELECT
      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];

        if (!chosen) {
          return conn.sendMessage(from, {
            text:
              "📑 *Invalid*\n\nInvalid quality number." +
              "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📦", key: msg.key } });

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text:
              `📑 *Large File*\n\nFile too large (${chosen.size})\nDirect Link:\n${chosen.link}` +
              "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(
          from,
          {
            document: { url: chosen.link },
            mimetype: "video/mp4",
            fileName: `${selected.title} - ${chosen.quality}.mp4`,
            caption:
              `📑 *Your Movie*\n\n🎥 ${selected.title}\n📺 ${chosen.quality}\n💾 ${chosen.size}` +
              "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          },
          { quoted: msg }
        );
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    return await conn.sendMessage(from, {
      text:
        `📑 *Error*\n\n${err.message}` +
        "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
    }, { quoted: mek });
  }
});
