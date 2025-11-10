const { cmd } = require("../command");
const axios = require("axios");
const NodeCache = require("node-cache");

// Cache setup (TTL: 100 seconds)
const movieCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

cmd({
  pattern: "baiscope",
  alias: ["bais"],
  desc: "🎥 Search Sinhala subbed movies from Baiscope",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text: "Use: .baiscope <movie name>"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `baiscope_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

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
      title: m.title,
      link: m.link
    }));

    let textList = "*🔍 𝐁𝐀𝐈𝐒𝐂𝐎𝐏𝐄 𝑪𝑰𝑵𝑬𝑴𝑨 𝑺𝑬𝑨𝑹𝑪𝑯 🎥*\n\n*🔢 Reply Below Number*\n━━━━━━━━━━━━━━━\n\n";
    movieList.forEach(m => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳";

    const sentMsg = await conn.sendMessage(from, { text: textList }, { quoted: mek });

    const movieMap = new Map();

    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "✅ *Cancelled.*" }, { quoted: msg });
      }

      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, { text: "*Invalid movie number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/baiscope/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, { text: "*No download links available.*" }, { quoted: msg });
        }

        let info =
          `🎬 *${movie.title}*\n\n` +
          `⭐ *IMDB:* ${movie.imdb?.value}\n` +
          `🕐 *Duration:* ${movie.duration}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `📅 *Release:* ${movie.releaseDate}\n` +
          `🎭 *Category:* ${movie.category.join(", ")}\n` +
          `🕵️ *Director:* ${movie.director?.name}\n` +
          `👷‍♂️ *Cast:* ${movie.cast?.map(c => c.actor.name).slice(0, 20).join(", ")}\n\n` +
          `🎥 *Download Links:* 📥\n\n`;

        movie.downloadUrl.forEach((d, i) => {
          info += `♦️ ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });

        info += "\n🔢 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage },
          caption: info
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadUrl });
      }

      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, { text: "*Invalid download number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📥", key: msg.key } });

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        if (sizeGB > 2) {
          return conn.sendMessage(from, { text: `⚠️ *Large File (${chosen.size})*` }, { quoted: msg });
        }

        await conn.sendMessage(from, {
          document: { url: chosen.link },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption:
            `🎬 ${selected.title}\n📺 ${chosen.quality}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek });
  }
});


cmd({
  pattern: "cinesubz",
  alias: ["cine"],
  desc: "🎥 Search Sinhala subded movies from CineSubz",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text: "Use: .cinesubz <movie name>"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `cinesubz_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/cinesubz/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data.all?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }

    const movieList = data.data.all.map((m, i) => ({
      number: i + 1,
      title: m.title,
      link: m.link
    }));

    let textList = "*🔢 Reply Below Number*\n━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `*🔍 𝐂𝐈𝐍𝐄𝐒𝐔𝐁𝐙 𝑪𝑰𝑵𝑬𝑴𝑨 𝑺𝑬𝑨𝑹𝑪𝑯 🎥*\n\n${textList}\n\n> > Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
    }, { quoted: mek });

    const movieMap = new Map();

    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "✅ *Cancelled*" }, { quoted: msg });
      }

      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, { text: "*Invalid movie number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/cinesubz/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, { text: "*No download links available.*"}, { quoted: msg });
        }

        let info =
          `🎬 *${movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb.value}\n` +
          `📅 *Released:* ${movie.dateCreate}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `🕐 *Runtime:* ${movie.runtime}\n` +
          `🎭 *Category:* ${movie.category.join(", ")}\n` +
          `🕵️ *Director:* ${movie.director?.name}\n` +
          `👷‍♂️ *Cast:* ${movie.cast?.map(c => c.actor.name).slice(0, 20).join(", ")}\n\n` +
          `🎥 *Download Links:* 📥\n\n`;

        movie.downloadUrl.forEach((d, i) => {
          info += `♦️ ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });
        info += "\n🔢 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage },
          caption: info
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadUrl });
      }

      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, { text: "*Invalid quality number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📥", key: msg.key } });

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        if (sizeGB > 2) {
          return conn.sendMessage(from, { text: `⚠️ *Large File (${chosen.size})*` }, { quoted: msg });
        }

        const dlUrl = chosen.link.includes("cscloud") || chosen.link.includes("cine")
          ? chosen.link + (chosen.link.includes("?") ? "&download=true" : "?download=true")
          : chosen.link;

        await conn.sendMessage(from, {
          document: { url: dlUrl },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption: `🎬 ${selected.title}\n📺 ${chosen.quality}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek }); 
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
      text: "Use: .sublk <movie name>"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `sublk_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/sublk/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data?.all?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }
    
    const movieList = data.data.all.map((m, i) => ({
      number: i + 1,
      title: m.title,
      link: m.link
    }));

    let textList = "*🔢 Reply Below Number*\n━━━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `*🔍 𝐒𝐔𝐁𝐋𝐊 𝑪𝑰𝑵𝑬𝑴𝑨 𝑺𝑬𝑨𝑹𝑪𝑯 🎥*\n\n${textList}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
    }, { quoted: mek });

    const movieMap = new Map();

    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "✅ *Cancelled.*" }, { quoted: msg });
      }

      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, { text: "*Invalid Movie Number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/sublk/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, { text: "*No download links available.*" }, { quoted: msg });
        }

        let info =
          `🎬 *${movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb?.value}\n` +
          `📅 *Released:* ${movie.dateCreate}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `🕐 *Runtime:* ${movie.runtime}\n` +
          `🎭 *Category:* ${movie.category?.join(", ")}\n` +
          `🕵️ *Director:* ${movie.director?.name}\n` +
          `👷‍♂️ *Cast:* ${movie.cast?.map(c => c.actor.name).slice(0, 20).join(", ")}\n\n` +
          `🎥 *Download Links:* 📥\n\n`;

        movie.downloadUrl.forEach((d, i) => {
          info += `♦️ ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });
        info += "\n🔢 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage },
          caption: info
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadUrl });
      }

      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, { text: "*Invalid number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📥", key: msg.key } });

        let directLink = chosen.link;

        if (directLink.includes("pixeldrain.com")) {
          const match = directLink.match(/\/([A-Za-z0-9]+)$/);
          if (match) directLink = `https://pixeldrain.com/api/file/${match[1]}`;
        } else if (directLink.includes("drive.google.com/file/d/")) {
          const match = directLink.match(/\/d\/([A-Za-z0-9_-]+)\//);
          if (match) directLink = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        if (sizeGB > 2) {
          return conn.sendMessage(from, { text: `⚠️ *Large File (${chosen.size})*` }, { quoted: msg });
        }

        await conn.sendMessage(from, {
          document: { url: directLink },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption: `🎬 ${selected.title}\n📺 ${chosen.quality}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek });
  }
});


cmd({
  pattern: "pirate",
  alias: ["pira"],
  desc: "🎥 Search Sinhala subbed movies from Pirate.lk",
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

    if (!data) {
      const url = `https://darkyasiya-new-movie-api.vercel.app/api/movie/pirate/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.data.all?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }

    const movieList = data.data.all.map((m, i) => ({
      number: i + 1,
      title: m.title,
      link: m.link
    }));

    let textList = "*🔢 Reply Below Number*\n━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `*🔍 𝐏𝐈𝐑𝐀𝐓𝐄 𝑪𝑰𝑵𝑬𝑴𝑨 𝑺𝑬𝑨𝑹𝑪𝑯 🎥*\n\n${textList}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
    }, { quoted: mek });

    const movieMap = new Map();

    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "✅ *Cancelled.*" }, { quoted: msg });
      }

      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movieList.find(m => m.number === num);
        if (!selected) {
          return conn.sendMessage(from, { text: "*Invalid movie number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        const movieUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/pirate/movie?url=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.data;

        if (!movie.downloadUrl?.length) {
          return conn.sendMessage(from, { text: "*No download links available.*" }, { quoted: msg });
        }

        let info =
          `🎬 *${movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.imdb?.value}\n` +
          `📅 *Released:* ${movie.dateCreate}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `🕐 *Runtime:* ${movie.runtime}\n` +
          `🎭 *Category:* ${movie.category?.join(", ")}\n` +
          `🕵️ *Director:* ${movie.director?.name}\n` +
          `👷‍♂️ *Cast:* ${movie.cast?.map(c => c.actor.name).slice(0, 20).join(", ")}\n\n` +
          `🎥 *Download Links:* 📥\n\n`;

        movie.downloadUrl.forEach((d, i) => {
          info += `♦️ ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });
        info += "\n🔢 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage },
          caption: info
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadUrl });
      }

      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];
        if (!chosen) {
          return conn.sendMessage(from, { text: "*Invalid link number.*" }, { quoted: msg });
        }

        await conn.sendMessage(from, { react: { text: "📥", key: msg.key } });
        
        let directLink = chosen.link;
        
        if (directLink.includes("pixeldrain.com")) {
          const match = directLink.match(/\/([A-Za-z0-9]+)$/);
          if (match) directLink = `https://pixeldrain.com/api/file/${match[1]}`;
        } else if (directLink.includes("drive.google.com/file/d/")) {
          const match = directLink.match(/\/d\/([A-Za-z0-9_-]+)\//);
          if (match) directLink = `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;

        if (sizeGB > 2) {
          return conn.sendMessage(from, { text: `⚠️ *Large File (${chosen.size})*` }, { quoted: msg });
        }

        await conn.sendMessage(from, {
          document: { url: directLink },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption: `🎬 ${selected.title}\n📺 ${chosen.quality}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek });
  }
});
