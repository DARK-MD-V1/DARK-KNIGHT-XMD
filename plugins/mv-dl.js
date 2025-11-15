const { cmd } = require("../command");
const axios = require("axios");
const config = require('../config');
const NodeCache = require("node-cache");

const movieCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });


cmd({
  pattern: "movie",
  alias: ["mv", "film"],
  desc: "Search Sinhala movies",
  category: "Search",
  react: "🔍",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    let caption = `🔍 .movie <movie name>`;

    await conn.sendMessage(from, { text: caption }, { quoted: mek });
    return;
  }

  let caption = `
🔍 𝐀𝐋𝐋 𝐂𝐈𝐍𝐄𝐌𝐀 𝐒𝐄𝐀𝐑𝐂𝐇 🎬

✏️ 𝐘𝐎𝐔𝐑 𝐒𝐄𝐀𝐑𝐂𝐇 : ${q}

📝 𝐔𝐒𝐄 𝑪𝑴𝑫 & <𝑁𝐴𝑀𝐸>

✏️ .𝑩𝑨𝑰𝑺𝑬𝑪𝑶𝑷𝑬  𝑆𝐸𝐴𝐑𝐶𝐻  
✏️ .𝑪𝑰𝑵𝑬𝑺𝑼𝑩𝒁  𝑆𝐸𝐴𝐑𝐶𝐻  
✏️ .𝑺𝑰𝑵𝑯𝑨𝑳𝑨𝑺𝑼𝑩 𝑆𝐸𝐴𝐑𝐶𝐻  
✏️ .𝑺𝑰𝑵𝑯𝑨𝑳𝑨𝑺𝑼𝑩𝑺 𝑆𝐸𝐴𝐑𝐶𝐻  
✏️ .𝑺𝑼𝑩𝑳𝑲  𝑆𝐸𝐴𝐑𝐶𝐻  
✏️ .𝑷𝑰𝑹𝑨𝑻𝑬  𝑆𝐸𝐴𝐑𝐶𝐻

📌 EX: .cmd & <query> 

> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`;

  await conn.sendMessage(from, { text: caption }, { quoted: mek });

});


cmd({
  pattern: "sinhalasubs",
  alias: ["ssubs"],
  desc: "🎥 Search Sinhala subbed movies from Sub.lk",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return await conn.sendMessage(from, {
      text: "Use: .sinhalasub <movie name>"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `sinhalasubs_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    if (!data) {
      const url = `https://visper-md-ap-is.vercel.app/movie/sinhalasub/search?q=${encodeURIComponent(q)}`;
      const res = await axios.get(url);
      data = res.data;

      if (!data.success || !data.result?.length) {
        throw new Error("No results found for your query.");
      }

      movieCache.set(cacheKey, data);
    }
    
    const movieList = data.result.map((m, i) => ({
      number: i + 1,
      title: m.Title,
      link: m.Link
    }));

    let textList = "🔢 𝑅𝑒𝑝𝑙𝑦 𝐵𝑒𝑙𝑜𝑤 𝑁𝑢𝑚𝑏𝑒𝑟\n━━━━━━━━━━━━━━━━━\n\n";
    movieList.forEach((m) => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with movie number to view details.*";

    const sentMsg = await conn.sendMessage(from, {
      text: `*🔍 𝐒𝐈𝐍𝐇𝐀𝐋𝐀𝐒𝐔𝐁𝐒 𝑪𝑰𝑵𝑬𝑴𝑨 𝑺𝑬𝑨𝑹𝑪𝑯 🎥*\n\n${textList}\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
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

        const movieUrl = `https://visper-md-ap-is.vercel.app/movie/sinhalasub/info?q=${encodeURIComponent(selected.link)}`;
        const movieRes = await axios.get(movieUrl);
        const movie = movieRes.data.result;

        if (!movie.downloadLinks?.length) {
          return conn.sendMessage(from, { text: "*No download links available.*" }, { quoted: msg });
        }

        let info =
          `🎬 *${movie.title}*\n\n` +
          `⭐ *IMDb:* ${movie.rating}\n` +
          `📅 *Released:* ${movie.date}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `🕐 *Runtime:* ${movie.duration}\n` +
          `✍️ *Author:* ${movie.author}\n` +
          `📝 *Description:*\n${movie.description}\n\n` +
          `🎥 *𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌𝒔:* 📥\n\n`;

        movie.downloadLinks.forEach((d, i) => {
          info += `♦️ ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });
        info += "\n🔢 *Reply with number to download.*";

        const downloadMsg = await conn.sendMessage(from, {
          image: { url:  movie.images?.[0] },
          caption: info
        }, { quoted: msg });

        movieMap.set(downloadMsg.key.id, { selected, downloads: movie.downloadLinks });
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
          caption: `🎬 *${selected.title}*\n🎥 *${chosen.quality}*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek });
  }
});


cmd({
  pattern: "baiscope",
  alias: ["bais"],
  desc: "🎥 Search Sinhala subbed movies from Baiscope.lk",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  const axios = require("axios");
  const NodeCache = require("node-cache");
  const movieCache = new NodeCache({ stdTTL: 1800 }); // cache 30 min

  if (!q) {
    return conn.sendMessage(from, {
      text: "*Usage:* .baiscope <movie name>"
    }, { quoted: mek });
  }

  try {
    const cacheKey = `baiscope_${q.toLowerCase()}`;
    let data = movieCache.get(cacheKey);

    if (!data) {
      const searchUrl = `https://sadaslk-apis.vercel.app/api/v1/movie/baiscopes/search?q=${encodeURIComponent(q)}&apiKey=vispermdv4`;
      const res = await axios.get(searchUrl);
      data = res.data;
      if (!data.status || !data.data?.length) throw new Error("No results found.");
      movieCache.set(cacheKey, data);
    }

    const movies = data.data.map((m, i) => ({
      number: i + 1,
      title: m.title,
      link: m.link
    }));

    let textList = `*🔍 𝐁𝐀𝐈𝐒𝐂𝐎𝐏𝐄 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓𝐒 🎬*\n\n🔢 𝑅𝑒𝑝𝑙𝑦 𝐵𝑒𝑙𝑜𝑤 𝑁𝑢𝑚𝑏𝑒𝑟\n━━━━━━━━━━━━━━━\n\n`;
    movies.forEach(m => {
      textList += `🔸 *${m.number}. ${m.title}*\n`;
    });
    textList += "\n💬 *Reply with a number to get movie details.*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳";

    const sentMsg = await conn.sendMessage(from, { text: textList }, { quoted: mek });
    const movieMap = new Map();

    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;
      const replyText = msg.message.extendedTextMessage.text.trim();
      const repliedId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyText.toLowerCase() === "done") {
        conn.ev.off("messages.upsert", listener);
        return conn.sendMessage(from, { text: "✅ *Search cancelled.*" }, { quoted: msg });
      }

      if (repliedId === sentMsg.key.id) {
        const num = parseInt(replyText);
        const selected = movies.find(m => m.number === num);
        if (!selected) return conn.sendMessage(from, { text: "❌ Invalid movie number." }, { quoted: msg });

        await conn.sendMessage(from, { react: { text: "🎯", key: msg.key } });

        const infoUrl = `https://sadaslk-apis.vercel.app/api/v1/movie/baiscopes/infodl?q=${encodeURIComponent(selected.link)}&apiKey=vispermdv4`;
        const infoRes = await axios.get(infoUrl);
        const movieData = infoRes.data.data;
        const movie = movieData.movieInfo;
        const downloads = movieData.downloadLinks || [];

        let caption = 
          `🎬 *${movie.title}*\n\n` +
          `⭐ *IMDB:* ${movie.ratingValue}\n` +
          `🕐 *Duration:* ${movie.runtime}\n` +
          `🌍 *Country:* ${movie.country}\n` +
          `📅 *Release:* ${movie.releaseDate}\n` +
          `🎭 *Genres:* ${movie.genres?.join(", ")}\n\n` +
          `🎥 *𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌𝒔:* 📥\n\n`;

        downloads.forEach((d, i) => {
          caption += `♦️ ${i + 1}. *${d.quality}* — ${d.size}\n`;
        });

        caption += "\n🔢 *Reply with number to download.*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳";

        const infoMsg = await conn.sendMessage(from, {
          image: { url: movie.galleryImages?.[0] },
          caption
        }, { quoted: msg });

        movieMap.set(infoMsg.key.id, { selected, downloads });
      }

      else if (movieMap.has(repliedId)) {
        const { selected, downloads } = movieMap.get(repliedId);
        const num = parseInt(replyText);
        const chosen = downloads[num - 1];

        if (!chosen) return conn.sendMessage(from, { text: "❌ Invalid download number." }, { quoted: msg });

        await conn.sendMessage(from, { react: { text: "📥", key: msg.key } });

        const size = chosen.size.toLowerCase();
        const sizeGB = size.includes("gb") ? parseFloat(size) : parseFloat(size) / 1024;
        const link = chosen.directLinkUrl;

        if (sizeGB > 2) {
          return conn.sendMessage(from, {
            text: `⚠️ *File too large (${chosen.size})*\n🔗 Use link manually:\n${link}`
          }, { quoted: msg });
        }

        await conn.sendMessage(from, {
          document: { url: link },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${chosen.quality}.mp4`,
          caption: `🎬 *${selected.title}*\n🎥 *${chosen.quality}*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
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

    let textList = "🔢 𝑅𝑒𝑝𝑙𝑦 𝐵𝑒𝑙𝑜𝑤 𝑁𝑢𝑚𝑏𝑒𝑟\n━━━━━━━━━━━━━━━\n\n";
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
          `🎥 *𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌𝒔:* 📥\n\n`;

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
          caption: `🎬 *${selected.title}*\n🎥 *${chosen.quality}*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek }); 
  }
});


cmd({
  pattern: "sinhalasub",
  alias: ["ssub"],
  desc: "🎥 Search Sinhala Subbed Movies from Sub.lk",
  category: "media",
  react: "🎬",
  filename: __filename
}, async (conn, mek, m, { from, q }) => {

  if (!q) {
    return conn.sendMessage(from, { text: "Use: .sinhalasub <movie name>" }, { quoted: mek });
  }

  try {

    // =======================
    // SEARCH API
    // =======================
    const searchUrl = `https://darkyasiya-new-movie-api.vercel.app/api/movie/sinhalasub/search?q=${encodeURIComponent(q)}`;
    const res = await axios.get(searchUrl);

    if (!res.data.success || !res.data.data?.data?.length) {
      return conn.sendMessage(from, { text: "❌ No movies found." }, { quoted: mek });
    }

    const movies = res.data.data.data.map((m, i) => ({
      number: i + 1,
      title: m.title,
      year: m.year,
      lang: m.language,
      link: m.link,
      image: m.image
    }));

    let menu = `🎬 *SINHALA SUB MOVIE SEARCH*\n\n`;
    menu += `🔍 Results for: *${q}*\n\n`;
    movies.forEach(m => {
      menu += `► *${m.number}. ${m.title}*\n`;
    });
    menu += `\n💬 Reply with movie number to view details.`;

    const sent = await conn.sendMessage(from, { text: menu }, { quoted: mek });


    // Store movie list for reply listener  
    const listeners = new Map();


    // =======================
    // LISTENER
    // =======================
    const listener = async (update) => {
      const msg = update.messages?.[0];
      if (!msg?.message?.extendedTextMessage) return;

      const reply = msg.message.extendedTextMessage.text.trim();
      const replyId = msg.message.extendedTextMessage.contextInfo?.stanzaId;

      // ---------------------
      // User selected movie
      // ---------------------
      if (replyId === sent.key.id) {

        const selected = movies.find(v => v.number === parseInt(reply));
        if (!selected) {
          return conn.sendMessage(from, { text: "❌ Invalid number." }, { quoted: msg });
        }

        // =======================
        // MOVIE DETAILS API
        // =======================
        const detailUrl =
          `https://darkyasiya-new-movie-api.vercel.app/api/movie/sinhalasub/movie?url=${encodeURIComponent(selected.link)}`;

        const movieRes = await axios.get(detailUrl);
        const movie = movieRes.data.data;

        let caption =
          `🎬 *${movie.title}*\n\n` +
          `⭐ IMDb: ${movie.imdb?.value}\n` +
          `📅 Year: ${movie.date}\n` +
          `🌍 Country: ${movie.country}\n` +
          `🕒 Runtime: ${movie.runtime}\n` +
          `🎭 Genre: ${movie.category.join(", ")}\n` +
          `✍️ Subtitle: ${movie.subtitle_author}\n` +
          `🎬 Director: ${movie.director}\n` +
          `👥 Cast: ${movie.cast.slice(0, 20).join(", ")}\n\n` +
          `📥 *Download Links:*\n\n`;

        movie.downloadUrl.forEach((d, i) => {
          caption += `• *${i + 1}.* ${d.quality} — ${d.size}\n`;
        });

        caption += `\n💬 Reply with number to download.`;

        const downloadMsg = await conn.sendMessage(from, {
          image: { url: movie.mainImage },
          caption
        }, { quoted: msg });

        listeners.set(downloadMsg.key.id, {
          title: movie.title,
          downloads: movie.downloadUrl
        });
      }


      // ---------------------
      // User selected download link
      // ---------------------
      else if (listeners.has(replyId)) {
        const { title, downloads } = listeners.get(replyId);
        const choice = downloads[parseInt(reply) - 1];

        if (!choice) {
          return conn.sendMessage(from, { text: "❌ Invalid number." }, { quoted: msg });
        }

        let url = choice.link;

        // PixelDrain convert
        if (url.includes("pixeldrain.com")) {
          const id = url.split("/").pop();
          url = `https://pixeldrain.com/api/file/${id}`;
        }

        // Google Drive convert
        if (url.includes("drive.google.com/file/d/")) {
          const id = url.match(/\/d\/(.+?)\//)[1];
          url = `https://drive.google.com/uc?export=download&id=${id}`;
        }

        // Telegram / not downloadable  
        if (url.includes("telegram.me")) {
          return conn.sendMessage(from, {
            text: "⚠️ This download is via Telegram Bot. Click link manually:\n\n" + url
          }, { quoted: msg });
        }

        await conn.sendMessage(from, {
          document: { url },
          mimetype: "video/mp4",
          fileName: `${selected.title} - ${choice.quality}.mp4`,
          caption: `🎬 ${selected.title}\n📥 ${choice.quality}`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
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

    let textList = "🔢 𝑅𝑒𝑝𝑙𝑦 𝐵𝑒𝑙𝑜𝑤 𝑁𝑢𝑚𝑏𝑒𝑟\n━━━━━━━━━━━━━━━━━\n\n";
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
          `🎥 *𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌𝒔:* 📥\n\n`;

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
          caption: `🎬 *${selected.title}*\n🎥 *${chosen.quality}*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
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

    let textList = "🔢 𝑅𝑒𝑝𝑙𝑦 𝐵𝑒𝑙𝑜𝑤 𝑁𝑢𝑚𝑏𝑒𝑟\n━━━━━━━━━━━━━━━\n\n";
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
          `🎥 *𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑳𝒊𝒏𝒌𝒔:* 📥\n\n`;

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
          caption: `🎬 *${selected.title}*\n🎥 *${chosen.quality}*\n\n> Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`
        }, { quoted: msg });
      }
    };

    conn.ev.on("messages.upsert", listener);

  } catch (err) {
    await conn.sendMessage(from, { text: `*Error:* ${err.message}` }, { quoted: mek });
  }
});
