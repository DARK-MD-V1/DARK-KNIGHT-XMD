const { cmd } = require('../command');

cmd({
    pattern: "groupstates",
    alias: ["gstates"],
    desc: "Safe group analytics",
    category: "group",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { groupMetadata, reply }) => {
    try {
        if (!m.isGroup) return reply("❌ Group only command");
        if (!groupMetadata || !groupMetadata.participants)
            return reply("⚠️ Could not fetch group metadata. Try again later.");

        const members = groupMetadata.participants;
        const stats = {
            total: members.length,
            admins: members.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length,
        };
        stats.users = stats.total - stats.admins;

        const activeMembers = members.filter(
            p => p.lastSeen && (Date.now() - p.lastSeen) < 7 * 86400 * 1000
        ).length || 0;

        const analysis = [
            `👥 *Total Members:* ${stats.total}`,
            `👑 *Admins:* ${stats.admins}`,
            `👤 *Regular Users:* ${stats.users}`,
            `💬 *Recently Active:* ${activeMembers}`
        ];

        await reply(`📊 *Group States*\n\n${analysis.join('\n')}`);

    } catch (error) {
        console.error('GroupStats Error:', error);
        reply("❌ Error generating stats. Try again later.");
    }
});
