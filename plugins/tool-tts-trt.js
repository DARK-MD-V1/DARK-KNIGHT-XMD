const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const googleTTS = require('google-tts-api');


cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "⚡",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) {
            return reply("❗ Please provide a language code and text.\n\n📝 Usage: *.trt [lang code] [text]*\n\nExample: *.trt ml Hello bro*");
        }

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        // ✅ Aswin Sparky Translate API
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/search/translate?text=${encodeURIComponent(textToTranslate)}&lang=${targetLang}`;

        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result) {
            return reply("⚠️ Unable to fetch translation. Please check your input or try again later.");
        }

        const translation = data.result;

        const msg = `> *🌍 DARK-KNIGHT-XMD TRANSLATION*\n\n` +
                    `> 🔤 *Original*: ${textToTranslate}\n\n` +
                    `> 🔠 *Translated*: ${translation}\n\n` +
                    `> 🌐 *Language*: ${targetLang.toUpperCase()}`;

        await reply(msg);

        // 🗣 Optional: Add TTS voice output
        try {
            const ttsUrl = googleTTS.getAudioUrl(translation, {
                lang: targetLang,
                slow: false,
                host: 'https://translate.google.com',
            });

            await conn.sendMessage(
                from,
                { audio: { url: ttsUrl }, mimetype: 'audio/mpeg', ptt: true },
                { quoted: mek }
            );
        } catch (ttsErr) {
            console.log("TTS Error:", ttsErr.message);
        }

    } catch (e) {
        console.error(e);
        reply("⚠️ An error occurred while translating your text. Please try again later 🤕");
    }
});


cmd({
    pattern: "trt2",
    alias: ["translate2"],
    desc: "🌍 Translate text between languages",
    react: "⚡",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) return reply("❗ Please provide a language code and text. Usage: .translate [language code] [text]");

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;

        const response = await axios.get(url);
        const translation = response.data.responseData.translatedText;

        const translationMessage = `> *𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳 TRANSLATION*

> 🔤 *Original*: ${textToTranslate}

> 🔠 *Translated*: ${translation}

> 🌐 *Language*: ${targetLang.toUpperCase()}`;

        return reply(translationMessage);
    } catch (e) {
        console.log(e);
        return reply("⚠️ An error occurred data while translating the your text. Please try again later🤕");
    }
});

//____________________________TTS___________________________
cmd({
    pattern: "tts",
    desc: "download songs",
    category: "download",
    react: "👧",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if(!q) return reply("Need some text.")
    const url = googleTTS.getAudioUrl(q, {
  lang: 'hi-IN',
  slow: false,
  host: 'https://translate.google.com',
})
await conn.sendMessage(from, { audio: { url: url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek })
    }catch(a){
reply(`${a}`)
}
})
