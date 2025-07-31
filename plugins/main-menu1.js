const config = require('../config')
const { cmd, commands } = require('../command');
const path = require('path'); 
const os = require("os")
const fs = require('fs');
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu2",
    alias: ["allmenu"],
    use: '.menu2',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭━〔 🚀 *${config.BOT_NAME}* 〕━┈⊷
┃★╭─────────────·๏
┃★│ • 👑 Owner : *${config.OWNER_NAME}*
┃★│ • ⚙️ Prefix : *[${config.PREFIX}]*
┃★│ • 🌐 Platform : *Heroku*
┃★│ • 📦 Version : *2.0.0*
┃★│ • ⏱️ Runtime : *${runtime(process.uptime())}*
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 *🤖 Ai Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • ai
┃★│ • deepseek
┃★│ • gemini
┃★│ • gemini2
┃★│ • openai
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🔄 *Convert Menu* 〕━━┈⊷
┃★╭────────────── 
┃★│ • attp
┃★│ • aivoice
┃★│ • convert
┃★│ • binary
┃★│ • dbinary
┃★│ • base64
┃★│ • unbase64
┃★│ • fetch
┃★│ • recolor
┃★│ • readmore
┃★│ • stake
┃★│ • sticker
┃★│ • tiny
┃★│ • tourl
┃★│ • tts
┃★│ • tts2
┃★│ • tts3
┃★│ • toptt
┃★│ • tomp3
┃★│ • topdf
┃★│ • translate
┃★│ • urlencode
┃★│ • urldecode
┃★│ • vsticker
┃★│ • Wikipedia
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 📥 *Download Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • apk
┃★│ • apk2
┃★│ • facebook
┃★│ • fb2
┃★│ • gdrive
┃★│ • gdrive2
┃★│ • gitclone
┃★│ • image
┃★│ • igimagedl
┃★│ • igvid
┃★│ • ig2
┃★│ • mediafire
┃★│ • mfire2
┃★│ • pinterestdl
┃★│ • pindl2
┃★│ • ringtone
┃★│ • spotify
┃★│ • tiktok
┃★│ • tt2
┃★│ • tiks
┃★│ • twitter
┃★│ • play
┃★│ • play1
┃★│ • play2
┃★│ • play3
┃★│ • song
┃★│ • song1
┃★│ • song2
┃★│ • video
┃★│ • video1
┃★│ • video2
┃★│ • video3
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 😄 *Fun Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • emix
┃★│ • angry
┃★│ • confused
┃★│ • hot
┃★│ • happy
┃★│ • heart
┃★│ • moon
┃★│ • sad
┃★│ • shy
┃★│ • nikal
┃★│ • hack
┃★│ • msg
┃★│ • aura
┃★│ • 8ball
┃★│ • boy
┃★│ • girl
┃★│ • coinflip
┃★│ • character
┃★│ • compliment
┃★│ • dare
┃★│ • emoji
┃★│ • fack
┃★│ • flip
┃★│ • flirt
┃★│ • friend
┃★│ • joke
┃★│ • lovetest
┃★│ • pick
┃★│ • pickup
┃★│ • quote
┃★│ • rate
┃★│ • roll
┃★│ • repeat
┃★│ • ship
┃★│ • shapar
┃★│ • turth
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 👥 *Group Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • requestlist
┃★│ • acceptall
┃★│ • rejectall
┃★│ • add
┃★│ • invite
┃★│ • admin
┃★│ • dismiss
┃★│ • promote
┃★│ • demote
┃★│ • ginfo
┃★│ • hidetag
┃★│ • tagall
┃★│ • join
┃★│ • kick
┃★│ • kickall
┃★│ • kickall1
┃★│ • kickall2
┃★│ • leave
┃★│ • glink
┃★│ • lock 
┃★│ • mute
┃★│ • newgc
┃★│ • out 
┃★│ • poll
┃★│ • resetglink
┃★│ • tagadmins
┃★│ • unlock 
┃★│ • unmute
┃★│ • upgdesc
┃★│ • upgname
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🖼️ *Imagine Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • anime
┃★│ • anime1
┃★│ • anime2
┃★│ • anime3
┃★│ • anime4
┃★│ • anime5
┃★│ • animegirl
┃★│ • animegirl1
┃★│ • animegirl2
┃★│ • animegirl3
┃★│ • animegirl4
┃★│ • animegirl5
┃★│ • imagine
┃★│ • imagine2
┃★│ • imagine3
┃★│ • imgscan
┃★│ • adedit
┃★│ • bluredit
┃★│ • greyedit
┃★│ • invertedit
┃★│ • jailedit
┃★│ • jokeedit
┃★│ • nokiaedit
┃★│ • wantededit
┃★│ • removebg
┃★│ • getimage
┃★│ • couplepp
┃★│ • awoo
┃★│ • bonk
┃★│ • bully
┃★│ • blush
┃★│ • bite
┃★│ • cry
┃★│ • cuddle
┃★│ • cringe
┃★│ • dog
┃★│ • dance
┃★│ • glomp
┃★│ • hug
┃★│ • happy
┃★│ • handhold
┃★│ • highfive
┃★│ • image
┃★│ • imgloli
┃★│ • kill
┃★│ • kiss
┃★│ • lick
┃★│ • maid
┃★│ • megumin
┃★│ • neko
┃★│ • nom
┃★│ • pat
┃★│ • poke
┃★│ • smug
┃★│ • slay
┃★│ • smile
┃★│ • wave
┃★│ • wink
┃★│ • waifu
┃★│ • yeet
┃★│ • wallpaper
┃★│ • randomwall
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🎨 *Logo Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • neonlight
┃★│ • blackpink
┃★│ • 3dcomic
┃★│ • america
┃★│ • naruto
┃★│ • sadgirl
┃★│ • clouds
┃★│ • futuristic
┃★│ • 3dpaper
┃★│ • eraser
┃★│ • sunset
┃★│ • leaf
┃★│ • galaxy
┃★│ • sans
┃★│ • boom
┃★│ • hacker
┃★│ • devilwings
┃★│ • nigeria
┃★│ • bulb
┃★│ • angelwings
┃★│ • zodiac
┃★│ • luxury
┃★│ • paint
┃★│ • frozen
┃★│ • castle
┃★│ • tatoo
┃★│ • valorant
┃★│ • bear
┃★│ • typography
┃★│ • birthday
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🏠 *Main Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • alive
┃★│ • menu
┃★│ • menu2
┃★│ • ping 
┃★│ • ping2 
┃★│ • repo
┃★│ • version
┃★│ • uptime
┃★│ • restart
┃★│ • support 
┃★│ • owner
┃★│ • pair
┃★│ • bible
┃★│ • biblelist
┃★│ • logomenu
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 📌 *Other Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • date
┃★│ • count
┃★│ • countx
┃★│ • caption
┃★│ • createapi
┃★│ • calculate
┃★│ • get
┃★│ • gpass
┃★│ • ssweb
┃★│ • person
┃★│ • timenow
┃★│ • tempnumber
┃★│ • tempmail
┃★│ • vcc
┃★│ • webinfo
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 *Owner Menu* 〕━━┈⊷
┃★╭──────────────
┃★│ • anticall
┃★│ • antilink
┃★│ • antidelete
┃★│ • block
┃★│ • unblock
┃★│ • broadcast
┃★│ • bug
┃★│ • spam
┃★│ • creact
┃★│ • setsudo
┃★│ • delsudo
┃★│ • vv
┃★│ • vv1
┃★│ • vv3
┃★│ • fullpp
┃★│ • fullpp2
┃★│ • setpp
┃★│ • getpp
┃★│ • getpp2
┃★│ • update 
┃★│ • shutdown
┃★│ • clearchats
┃★│ • delete
┃★│ • poststates
┃★│ • privacy
┃★│ • blocklist
┃★│ • getbio
┃★│ • setppall
┃★│ • setonline
┃★│ • setmyname
┃★│ • updatebio
┃★│ • groupsprivacy
┃★│ • getprivacy
┃★│ • savecontact
┃★│ • setting
┃★│ • jid
┃★│ • gjid
┃★│ • forward
┃★│ • send
┃★│ • persion
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🔍 *Search Menu* 〕━━┈⊷
┃★╭──────────────      
┃★│ • check
┃★│ • cid
┃★│ • country
┃★│ • chinfo
┃★│ • define
┃★│ • fancy 
┃★│ • githubstalk
┃★│ • npm
┃★│ • news
┃★│ • mvdetail
┃★│ • praytime
┃★│ • sss
┃★│ • srepo
┃★│ • ttstalk
┃★│ • twtstalk
┃★│ • yts
┃★│ • ytpost
┃★│ • ytstalk
┃★│ • weather
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 ⚙️ *Setting Menu* 〕━━┈⊷
┃★╭──────────────      
┃★│ • mode pravite/inbox/public
┃★│ • setprefix !,@,#,$,/ 
┃★│ • admin-events on/off
┃★│ • welcome on/off
┃★│ • auto-typing on/off
┃★│ • mention-reply on/off
┃★│ • always-online on/off
┃★│ • auto-recoding on/off
┃★│ • auto-seen on/off
┃★│ • status-react on/off
┃★│ • read-messages on/off 
┃★│ • auto-voice on/off
┃★│ • auto-reply on/off
┃★│ • auto-sticker on/off
┃★│ • auto-react on/off
┃★│ • status-reply on/off
┃★│ • anti-bad on/off
┃★│ • antilink on/off
┃★│ • antikick on/off
┃★│ • kicklink on/off
┃★│ • deletelink on/off
┃★│ • antibad on/off
┃★│ • antidelete on/off
┃★│ • anticall on/off
┃★│ • heartreact on/off
┃★│ • .use on/off
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400240662312@newsletter',
                        newsletterName: config.BOT_NAME,
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});
