const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "define",
    desc: "📖 Get the definition of a word",
    react: "🔍",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a word to define.\n\n📌 *Usage:* .define [word]");

        const word = q.trim();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await axios.get(url);
        const definitionData = response.data[0];

        const definition = definitionData.meanings[0].definitions[0].definition;
        const example = definitionData.meanings[0].definitions[0].example || '❌ No example available';
        const synonyms = definitionData.meanings[0].definitions[0].synonyms.join(', ') || '❌ No synonyms available';
        const phonetics = definitionData.phonetics[0]?.text || '🔇 No phonetics available';
        const audio = definitionData.phonetics[0]?.audio || null;

        const wordInfo = `
📖 *Word*: *${definitionData.word}*  
🗣️ *Pronunciation*: _${phonetics}_  
📚 *Definition*: ${definition}  
✍️ *Example*: ${example}  
📝 *Synonyms*: ${synonyms}  

🔗 *Powered By 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*`;

        if (audio) {
            await conn.sendMessage(from, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: mek });
        }

        return reply(wordInfo);
    } catch (e) {
        console.error("❌ Error:", e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 *Word not found.* Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the definition. Please try again later.");
    }
});


cmd({
  pattern: "word",
  desc: "📖 Get the definition(s) of a word with pronunciation and examples.",
  react: "🔍",
  category: "search",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("Please provide a word to define.\n\n📌 *Usage:* .define [word]");

    const word = q.trim();
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const { data } = await axios.get(url);

    const entry = data[0];
    if (!entry) return reply("🚫 Word not found.");

    // 🔊 Phonetics & Audio
    const phonetic = entry.phonetics.find(p => p.audio) || entry.phonetics[0] || {};
    const phonetics = phonetic.text || entry.phonetic || '🔇 No phonetics available';
    const audio = phonetic.audio || null;

    // 📚 Meanings (loop through all)
    let meaningText = '';
    entry.meanings.forEach((m, i) => {
      const defs = m.definitions.map((d, j) => {
        const ex = d.example ? `\n     ✍️ Example: _${d.example}_` : '';
        const syns = d.synonyms?.length ? `\n     📝 Synonyms: ${d.synonyms.join(', ')}` : '';
        return `   ${j + 1}. ${d.definition}${ex}${syns}`;
      }).join('\n');

      meaningText += `\n\n🔤 *${i + 1}. ${m.partOfSpeech.toUpperCase()}*\n${defs}`;
    });

    // 🌐 Sources
    const sources = entry.sourceUrls?.length ? entry.sourceUrls.join('\n') : 'N/A';

    // 🧾 Message format
    const wordInfo = `
📖 *Word:* ${entry.word}
🗣️ *Pronunciation:* _${phonetics}_

${meaningText}

🌐 *Source(s):* ${sources}

🔗 *Powered by 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳*
`.trim();

    // 🎧 Send pronunciation audio if available
    if (audio) {
      await conn.sendMessage(from, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: mek });
    }

    // 📨 Send definition text
    return reply(wordInfo);

  } catch (e) {
    console.error("❌ Error:", e);
    if (e.response?.status === 404) {
      return reply("🚫 *Word not found.* Please check the spelling and try again.");
    }
    return reply("⚠️ An error occurred while fetching the definition. Please try again later.");
  }
});

