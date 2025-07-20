const config = require('../config')
const { cmd, commands } = require('../command');
const path = require('path'); 
const os = require("os")
const fs = require('fs');
const {runtime} = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu2",
    alias: ["allmenu","fullmenu"],
    use: '.menu2',
    desc: "Show all bot commands",
    category: "menu",
    react: "📜",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭━〔 🚀 *${config.BOT_NAME}* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• 👑 Owner : *${config.OWNER_NAME}*
┃◈┃• ⚙️ Prefix : *[${config.PREFIX}]*
┃◈┃• 🌐 Platform : *Heroku*
┃◈┃• 📦 Version : *2.0.0*
┃◈┃• ⏱️ Runtime : *${runtime(process.uptime())}*
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 📥 *DOWNLOAD MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• facebook
┃◈┃• fb2
┃◈┃• mediafire
┃◈┃• mfire2
┃◈┃• tiktok
┃◈┃• tt2
┃◈┃• twitter
┃◈┃• insta
┃◈┃• insta2
┃◈┃• apk
┃◈┃• apk2
┃◈┃• img
┃◈┃• pins
┃◈┃• pins2
┃◈┃• pinterest
┃◈┃• spotify
┃◈┃• play
┃◈┃• play1
┃◈┃• play2
┃◈┃• song
┃◈┃• song1
┃◈┃• song2
┃◈┃• audio
┃◈┃• audio2
┃◈┃• video
┃◈┃• video1
┃◈┃• video2
┃◈┃• video3
┃◈┃• ytmp3
┃◈┃• ytmp4
┃◈┃• darama
┃◈┃• gdrive
┃◈┃• ssweb
┃◈┃• tiks
┃◈┃•
┃◈┃• xnxx
┃◈┃• xvideo
┃◈┃• xporn
┃◈┃• porn
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 👥 *GROUP MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• grouplink
┃◈┃• kickall
┃◈┃• kickall2
┃◈┃• kickall3
┃◈┃• add
┃◈┃• remove
┃◈┃• kick
┃◈┃• out
┃◈┃• fullpo
┃◈┃• promote
┃◈┃• demote
┃◈┃• dismiss
┃◈┃• revoke
┃◈┃• setgoodbye
┃◈┃• setwelcome
┃◈┃• delete
┃◈┃• getpic
┃◈┃• ginfo
┃◈┃• disappear on
┃◈┃• disappear off
┃◈┃• disappear 7D,24H
┃◈┃• allreq
┃◈┃• updategname
┃◈┃• updategdesc
┃◈┃• joinrequests
┃◈┃• senddm
┃◈┃• nikal
┃◈┃• mute
┃◈┃• unmute
┃◈┃• lockgc
┃◈┃• unlockgc
┃◈┃• antilink kick
┃◈┃• out + country code
┃◈┃• invite
┃◈┃• tag
┃◈┃• hidetag
┃◈┃• @tagall
┃◈┃• tagadmins
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🎭 *REACT MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• bully @tag
┃◈┃• cuddle @tag
┃◈┃• cry @tag
┃◈┃• hug @tag
┃◈┃• awoo @tag
┃◈┃• kiss @tag
┃◈┃• lick @tag
┃◈┃• pat @tag
┃◈┃• smug @tag
┃◈┃• bonk @tag
┃◈┃• yeet @tag
┃◈┃• blush @tag
┃◈┃• smile @tag
┃◈┃• wave @tag
┃◈┃• highfive @tag
┃◈┃• handhold @tag
┃◈┃• nom @tag
┃◈┃• bite @tag
┃◈┃• glomp @tag
┃◈┃• slap @tag
┃◈┃• kill @tag
┃◈┃• happy @tag
┃◈┃• wink @tag
┃◈┃• poke @tag
┃◈┃• dance @tag
┃◈┃• cringe @tag
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🎨 *LOGO MAKER* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• neonlight
┃◈┃• blackpink
┃◈┃• dragonball
┃◈┃• 3dcomic
┃◈┃• america
┃◈┃• naruto
┃◈┃• sadgirl
┃◈┃• clouds
┃◈┃• futuristic
┃◈┃• 3dpaper
┃◈┃• eraser
┃◈┃• sunset
┃◈┃• leaf
┃◈┃• galaxy
┃◈┃• sans
┃◈┃• boom
┃◈┃• hacker
┃◈┃• devilwings
┃◈┃• nigeria
┃◈┃• bulb
┃◈┃• angelwings
┃◈┃• zodiac
┃◈┃• luxury
┃◈┃• paint
┃◈┃• frozen
┃◈┃• castle
┃◈┃• tatoo
┃◈┃• valorant
┃◈┃• bear
┃◈┃• typography
┃◈┃• birthday
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 *OWNER MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• owner
┃◈┃• menu
┃◈┃• menu2
┃◈┃• vv / vv1
┃◈┃• vv3
┃◈┃• listcmd
┃◈┃• allmenu
┃◈┃• repo
┃◈┃• broadcast
┃◈┃• join
┃◈┃• leave 
┃◈┃• block
┃◈┃• unblock
┃◈┃• fullpp
┃◈┃• setpp
┃◈┃• restart
┃◈┃• shutdown
┃◈┃• updatecmd
┃◈┃• alive
┃◈┃• ping
┃◈┃• ping2
┃◈┃• version
┃◈┃• gjid
┃◈┃• jid
┃◈┃• id
┃◈┃• bible
┃◈┃• blist
┃◈┃• setsudo
┃◈┃• delsudo
┃◈┃• setmyname
┃◈┃• setppall
┃◈┃• getbio @tag
┃◈┃• getpp @tag
┃◈┃• privacy
┃◈┃• getprivacy
┃◈┃• groupsprivacy
┃◈┃• updatebio
┃◈┃• blocklist
┃◈┃• chai
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🎉 *FUN MENU* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• shapar
┃◈┃• rate
┃◈┃• insult
┃◈┃• hack
┃◈┃• ship
┃◈┃• character
┃◈┃• pickup
┃◈┃• joke
┃◈┃• blur
┃◈┃• hrt
┃◈┃• hpy
┃◈┃• syd
┃◈┃• anger
┃◈┃• shy
┃◈┃• kiss
┃◈┃• mon
┃◈┃• cunfuzed
┃◈┃• setpp
┃◈┃• hand
┃◈┃• nikal
┃◈┃• hold
┃◈┃• hug
┃◈┃• nikal
┃◈┃• hifi
┃◈┃• poke
┃◈┃• meme
┃◈┃• fact
┃◈┃• quote 
┃◈┃• truth
┃◈┃• dare
┃◈┃• war
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━〔 🔄 *CONVERT MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• sticker
┃◈┃• sticker2
┃◈┃• emojimix
┃◈┃• fancy
┃◈┃• take
┃◈┃• tomp3
┃◈┃• tomp4
┃◈┃• tts
┃◈┃• trt
┃◈┃• base64
┃◈┃• unbase64
┃◈┃• binary
┃◈┃• dbinary
┃◈┃• tinyurl
┃◈┃• urldecode
┃◈┃• urlencode
┃◈┃• url
┃◈┃• repeat
┃◈┃• ask
┃◈┃• readmore
┃◈┃• help
┃◈┃• support
┃◈┃• remini
┃◈┃• removebg
┃◈┃• urltoimg
┃◈┃• recaption
┃◈┃• caption
┃◈┃• repost
┃◈┃• story
┃◈┃• states
┃◈┃• vcf
┃◈┃• imgjoke
┃◈┃• invert
┃◈┃• grey
┃◈┃• blur
┃◈┃• ad
┃◈┃• nokia
┃◈┃• wanted
┃◈┃• jail
┃◈┃• tiny
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🤖 *AI MENU* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• ai
┃◈┃• bot
┃◈┃• gpt
┃◈┃• openai
┃◈┃• chatgpt
┃◈┃• deepseek
┃◈┃• seekai
┃◈┃• imagine
┃◈┃• imagine2
┃◈┃• gemini
┃◈┃• gemini2
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 ⚡ *MAIN MENU* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• ping
┃◈┃• ping2
┃◈┃• speed
┃◈┃• live
┃◈┃• alive
┃◈┃• runtime
┃◈┃• uptime
┃◈┃• version
┃◈┃• repo
┃◈┃• owner
┃◈┃• menu
┃◈┃• menu2
┃◈┃• restart
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 🎎 *ANIME MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• fack
┃◈┃• truth
┃◈┃• dare
┃◈┃• dog
┃◈┃• awoo
┃◈┃• garl
┃◈┃• waifu
┃◈┃• neko
┃◈┃• megnumin
┃◈┃• neko
┃◈┃• maid
┃◈┃• loli
┃◈┃• animeboy
┃◈┃• animegirl
┃◈┃• animegirl 1-5
┃◈┃• anime 1-5
┃◈┃• animequote
┃◈┃• animewall
┃◈┃• animememe
┃◈┃• animenews
┃◈┃• foxgirl
┃◈┃• naruto
┃◈╰────────────┈⊷
╰━━━━━━━━━━━━━━┈⊷

╭━━〔 ℹ️ *OTHER MENU* 〕━┈⊷
┃◈╭─────────────·๏
┃◈┃• timenow
┃◈┃• date
┃◈┃• count
┃◈┃• calculate
┃◈┃• countx
┃◈┃• flip
┃◈┃• coinflip
┃◈┃• rcolor
┃◈┃• roll
┃◈┃• fact
┃◈┃• cpp
┃◈┃• rw
┃◈┃• pair
┃◈┃• pair2
┃◈┃• fancy
┃◈┃• logo
┃◈┃• define
┃◈┃• news
┃◈┃• movie
┃◈┃• weather
┃◈┃• srepo
┃◈┃• insult
┃◈┃• save
┃◈┃• wikipedia
┃◈┃• gpass
┃◈┃• githubstalk
┃◈┃• yts
┃◈┃• ytv
┃◈┃• chr
┃◈╰────────────┈⊷
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
