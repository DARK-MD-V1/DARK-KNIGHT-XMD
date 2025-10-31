const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
  pattern: "ginfo",
  react: "🥏",
  alias: ["groupinfo"],
  desc: "Get group information.",
  category: "group",
  use: '.ginfo',
  filename: __filename
},
async (conn, mek, m, { from, participants, isGroup, isAdmins, isBotAdmins, isDev, reply }) => {
  try {
    const msr = (await fetchJson('https://raw.githubusercontent.com/bot-deploy-main/DARK-KNIGHT-XMD/refs/heads/main/MSG/mreply.json')).replyMsg;

    if (!isGroup) return reply(msr.only_gp);
    if (!isAdmins && !isDev) return reply(msr.you_adm, { quoted: mek });
    if (!isBotAdmins) return reply(msr.give_adm);

    const fallbackPp = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
    let ppUrl;
    try {
      ppUrl = await conn.profilePictureUrl(from, 'image');
    } catch {
      ppUrl = fallbackPp;
    }

    const metadata = await conn.groupMetadata(from);
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
    const owner = metadata.owner || (groupAdmins.length ? groupAdmins[0].id : 'Unknown');
    const desc = metadata.desc || 'No description';

    const gdata = `*「 Group Information 」*\n\n
*Group Name:* ${metadata.subject}\n
*Group JID:* ${metadata.id}\n
*Participants:* ${metadata.size}\n
*Creator:* @${owner.split('@')[0]}\n
*Description:* ${desc}\n
*Admins:*\n${listAdmin}`;

    await conn.sendMessage(from, {
      image: { url: ppUrl },
      caption: gdata,
      mentions: [owner, ...groupAdmins.map(v => v.id)]
    }, { quoted: mek });

  } catch (e) {
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    console.error(e);
    reply(`❌ *Error Occurred!* \n\n${e}`);
  }
});
