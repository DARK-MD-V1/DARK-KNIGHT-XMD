const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q,
    isGroup, sender, senderNumber, botNumber, pushname,
    isMe, isOwner, groupMetadata, groupName, participants,
    groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {

    // 🧩 Group check
    if (!isGroup)
        return reply("❌ This command can only be used in groups.");

    // 🔐 Admin check (user)
    if (!isAdmins)
        return reply("❌ Only group admins can use this command.");

    // 🤖 Bot admin check
    if (!isBotAdmins)
        return reply("❌ I need to be an admin to perform this action.");

    let number;

    // 🧍 Identify target number
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else if (q && /^\d+$/.test(q)) {
        number = q.trim();
    } else {
        return reply("❌ Please reply to a message or tag/provide a number to promote.");
    }

    // 🧱 Prevent promoting the bot itself
    if (number === botNumber)
        return reply("❌ I cannot promote myself.");

    const jid = number + "@s.whatsapp.net";

    // 🧾 Check if target is already an admin
    const isTargetAdmin = groupAdmins.includes(jid);
    if (isTargetAdmin)
        return reply(`ℹ️ @${number} is already an admin.`, { mentions: [jid] });

    // 🚀 Attempt promotion
    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        reply(`✅ Successfully promoted @${number} to admin.`, { mentions: [jid] });
    } catch (error) {
        console.error("Promote command error:", error);

        if (String(error).includes("not-authorized")) {
            reply("⚠️ I don't have enough permissions to promote this user.");
        } else if (String(error).includes("not-admin")) {
            reply("⚠️ I need to be an admin to manage members.");
        } else {
            reply("❌ Something went wrong while trying to promote the member.");
        }
    }
});
