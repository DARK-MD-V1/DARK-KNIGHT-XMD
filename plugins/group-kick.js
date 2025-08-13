const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove"],
    react: "⚠️",
    desc: "Remove a mentioned user from the group.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("⚠️ This command can only be used in a group!");
        if (!isAdmins) return reply("⚠️ Only group admins can use this command!");
        if (!isBotAdmins) return reply("⚠️ I need to be an admin to execute this command!");
        if (!m.quoted) return reply("⚠️ Please reply to the user's message you want to kick!");

        const target = m.quoted.sender;
        const groupMetadata = await robin.groupMetadata(from);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

        if (groupAdmins.includes(target)) return reply("⚠️ I cannot remove another admin from the group!");

        await robin.groupParticipantsUpdate(from, [target], "remove");
        return reply(`✅ Successfully removed: @${target.split('@')[0]}`);
    } catch (e) {
        console.error("Kick Error:", e);
        reply(`❌ Failed to remove the user. Error: ${e.message}`);
    }
});
