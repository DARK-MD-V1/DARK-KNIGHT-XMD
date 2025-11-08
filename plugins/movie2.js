const { cmd } = require("../command");
const axios = require("axios");
const NodeCache = require("node-cache");

// Cache setup (1 minute)
const movieCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

cmd({
  pattern: "cinesubz",
  alias: ["cine"],
  desc: "🎥 Search Sinhala subbed movies from CineSubz",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text:
        "📑 *Usage*\n\n" +
        "Use: `.cinesubz <movie name>`\n" +
        "Eg: `.cinesubz black phone`" +
        "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `cinesubz_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    // API: Search call
    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/cinesubz/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data.all?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }

    // Build Movie List
    const movieList = data.data.all.map((m, i) => ({
      number: i + 1,
      title: m.title,
      year: m.year,
      imdb: m.imdb,
      type: m.type,
      image: m.image,
      link: m.link,
      description: m.description
    }));

    let textList = "🎞️ *CineSubz Sinhala Movies*\n━━━━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `📑 *Search Results*\n\n${textList}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });

    const movieMap = new Map();

    // Listener for replies
    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      // Cancel
      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, {
          text: "📑 *Cancelled*\n\nSearch cancelled.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
        }, { quoted: msg });
      }

      // Select movie
      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, {
            text: "📑 *Invalid*\n\nInvalid movie number.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        // API: Get Movie details
        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/cinesubz/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, {
            text:
              "📑 *Unavailable*\n\nNo download links available.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        // Build detailed info
        let info =
          `🎬 *${movie.maintitle || movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb.value}\n` +
          `🎭 *Category:* ${movie.category.join(", ")}\n` +
          `🕐 *Runtime:* ${movie.runtime}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `📅 *Released:* ${movie.dateCreate}\n\n` +
          `📖 *Description:*\n${movie.description.slice(0, 500)}...\n\n`;

        // Download list
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

      // Download quality selection
      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, {
            text: "📑 *Invalid*\n\nInvalid quality number.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📦", key: msg.key } });

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        // Large file protection
        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text:
              `📑 *Large File*\n\nFile too large (${chosen.size}).\n🔗 *Direct Link:*\n${chosen.link}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
          }, { quoted: msg });
        }

        // Send file
        await conn.sendMessage(from, {
          document: { url: chosen.link },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption:
            `🎬 *Your Movie is Ready!*\n\n🎥 ${selected.title}\n📺 ${chosen.quality}\n💾 ${chosen.size}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, {
      text: `📑 *Error*\n\n${err.message}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });
  }
});


cmd({
  pattern: "baiscope",
  alias: ["bais"],
  desc: "🎬 Search Sinhala subbed movies from Baiscope",
  category: "media",
  react: "🎞️",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text:
        "📑 *Usage*\n\n" +
        "Use: `.baiscope <movie name>`\n" +
        "Eg: `.baiscope barbarik`" +
        "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `baiscope_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    // API: Search
    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/baiscope/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }

    const movieList = data.data.map((m, i) => ({
      number: i + 1,
      title: m.maintitle || m.title,
      year: m.year || "N/A",
      imdb: m.imdb?.replace("IMDb", "").trim() || "N/A",
      image: m.image,
      link: m.link
    }));

    let textList = "🎞️ *Baiscope Sinhala Movies*\n━━━━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔹 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: textList
    }, { quoted: mek });

    const movieMap = new Map();

    // Reply listener
    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "✅ *Cancelled.*" }, { quoted: msg });
      }

      // When user replies to search list
      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, { text: "📑 *Invalid movie number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        // API: Movie detail
        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/baiscope/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, { text: "📑 *No download links available.*" }, { quoted: msg });
        }

        // Cast & Category
        const castList = movie.cast?.map(c => c.actor.name).slice(0, 6).join(", ") || "N/A";
        const catList = movie.category?.join(", ") || "N/A";

        // Build info
        let info =
          `🎬 *${movie.maintitle}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb?.value || "N/A"}\n` +
          `🎭 *Category:* ${catList}\n` +
          `🕐 *Duration:* ${movie.duration}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `📅 *Release:* ${movie.releaseDate}\n` +
          `🎬 *Director:* ${movie.director?.name || "N/A"}\n` +
          `🎭 *Cast:* ${castList}\n\n` +
          `📥 *Download Links:*\n`;

        movie.downloadUrl.forEach((d, i) => {
          info += `   ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });

        info += "\n💬 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage || selected.image },
          caption: info
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadUrl });
      }

      // When user selects download
      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, { text: "📑 *Invalid download number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📦", key: msg.key } });

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text: `⚠️ *Large File (${chosen.size})*\n🔗 *Direct Link:*\n${chosen.link}`
          }, { quoted: msg });
        }

        await conn.sendMessage(from, {
          document: { url: chosen.link },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption:
            `🎬 *Your Movie is Ready!*\n\n🎥 ${selected.title}\n📺 ${chosen.quality}\n💾 ${chosen.size}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, {
      text: `❌ *Error:* ${err.message}`
    }, { quoted: mek });
  }
});


cmd({
  pattern: "sublk",
  alias: ["sub"],
  desc: "🎥 Search Sinhala subbed movies from Sub.lk",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text:
        "📑 *Usage*\n\n" +
        "Use: `.sublk <movie name>`\n" +
        "Eg: `.sublk black phone 2`" +
        "\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `sublk_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    // Fetch Search Results
    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/sublk/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data?.all?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }

    // Build Movie List
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

    let textList = "🎞️ *Sub.lk Sinhala Movies*\n━━━━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `📑 *Search Results*\n\n${textList}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });

    const movieMap = new Map();

    // Listen for replies
    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      // Cancel Search
      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, {
          text: "📑 *Cancelled*\n\nSearch cancelled.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
        }, { quoted: msg });
      }

      // Movie Selected
      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, {
            text: "📑 *Invalid*\n\nInvalid movie number.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        // Fetch Movie Details
        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/sublk/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, {
            text:
              "📑 *Unavailable*\n\nNo download links available.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        // Build Info
        let info =
          `🎬 *${movie.maintitle || movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb?.value || "N/A"}\n` +
          `🎭 *Category:* ${movie.category?.join(", ") || "N/A"}\n` +
          `🕐 *Runtime:* ${movie.runtime || "N/A"}\n` +
          `🌍 *Country:* ${movie.country || "N/A"}\n` +
          `📅 *Released:* ${movie.dateCreate || "N/A"}\n\n` +
          `📖 *Description:*\n${movie.description?.slice(0, 500) || "No description."}...\n\n`;

        // Add download options
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

      // Handle download selection
      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, {
            text: "📑 *Invalid*\n\nInvalid number.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📦", key: msg.key } });

        // Check file size (simple check)
        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        // If file is too large, send link instead
        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text:
              `📑 *Large File*\n\nFile too large (${chosen.size}).\n🔗 *Direct Link:*\n${chosen.link}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
          }, { quoted: msg });
        }

        // ✅ Send file directly (your requested code)
        await conn.sendMessage(from, {
          document: { url: chosen.link },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption:
            `🎬 *Your Movie is Ready!*\n\n🎥 ${selected.title}\n📺 ${chosen.quality}\n💾 ${chosen.size}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, {
      text: `📑 *Error*\n\n${err.message}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });
  }
});


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
      text:
        "📑 *Usage*\n\n" +
        "Use: `.pirate <movie name>`\n" +
        "Eg: `.pirate black phone 2`\n" +
        "━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `pirate_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    // 🔍 API: Search call
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

    let textList = "🏴‍☠️ *Pirate.lk Sinhala Movies*\n━━━━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔹 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `📑 *Search Results*\n\n${textList}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });

    const movieMap = new Map();

    // 👂 Listener for replies
    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      // ❌ Cancel
      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, {
          text: "📑 *Cancelled*\n\nSearch cancelled.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
        }, { quoted: msg });
      }

      // 🎥 Select movie
      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, {
            text: "📑 *Invalid*\n\nInvalid movie number.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        // 🛰 API: Get Movie details
        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/pirate/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, {
            text:
              "📑 *Unavailable*\n\nNo download links available.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        // 📝 Build detailed info
        let info =
          `🎬 *${movie.maintitle || movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb?.value || "N/A"}\n` +
          `🎭 *Category:* ${movie.category?.join(", ") || "Unknown"}\n` +
          `🕐 *Runtime:* ${movie.runtime}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `📅 *Released:* ${movie.dateCreate}\n\n` +
          `📖 *Description:*\n${movie.description.slice(0, 400)}...\n\n`;

        // 📥 Download list
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

      // 💾 Download quality selection
      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, {
            text: "📑 *Invalid*\n\nInvalid link number.\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD"
          }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📦", key: msg.key } });

        // Check file size (simple check)
        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        // If file is too large, send link instead
        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text:
              `📑 *Large File*\n\nFile too large (${chosen.size}).\n🔗 *Direct Link:*\n${chosen.link}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
          }, { quoted: msg });
        }

        // ✅ Direct file send (MP4)
        await conn.sendMessage(from, {
          document: { url: chosen.link },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption:
            `🎬 *Your Movie is Ready!*\n\n🎥 ${selected.title}\n📺 ${chosen.quality}\n💾 ${chosen.size}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, {
      text: `📑 *Error*\n\n${err.message}\n━━━━━━━━━━━━━━━━━━\n⚡ Powered by Dark-Knight-XMD`
    }, { quoted: mek });
  }
});
