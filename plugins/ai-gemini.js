const config = require('../config')
const {cmd , commands} = require('../command')
const { fetchJson } = require('../lib/functions')

const GEMINI_API_KEY = "AIzaSyC8pSIvRTtYS-ZghDZWWPUY360gEFB37hM";

cmd(
  {
    pattern: "gemini2",
    react: "🤖",
    desc: "Ask Gemini AI anything",
    category: "ai",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    try {
      if (!q)
        return reply("❓ Please provide a question.\n\n*Example:* `.ask What is the capital of France?`");

      await reply("🤖 Gemini is thinking...");

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: q }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const aiReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!aiReply) return reply("❌ Gemini did not return a valid response.");

      await robin.sendMessage(from, { text: `🤖 *Gemini says:*\n\n${aiReply}` }, { quoted: mek });
    } catch (e) {
      const errMsg = e?.response?.data?.error?.message || e.message || "Unknown error occurred.";
      console.error("Gemini API Error:", errMsg);
      reply(`❌ Error from Gemini API:\n\n${errMsg}`);
    }
  }
);


cmd({
    pattern: "gemini",
    react: "📑",
    desc: "ai chat.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let data = await fetchJson(`https://api-aswin-sparky.koyeb.app/api/search/gpt3?search=${q}`)
return reply(`${data.data}

> ㋛︎ ᴘᴏᴡᴇʀᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`)
}catch(e){
console.log(e)
reply(`${e}`)
}
})
