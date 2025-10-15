const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Count total commands
        const totalCommands = Object.keys(commands).length;
        
        const menuCaption = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★╭──────────────
┃★│ 👑 Owner : *${config.OWNER_NAME}*
┃★│ 🤖 Baileys : *Multi Device*
┃★│ 💻 Type : *NodeJs*
┃★│ 🚀 Platform : *Heroku*
┃★│ ⚙️ Mode : *[${config.MODE}]*
┃★│ 🔣 Prefix : *[${config.PREFIX}]*
┃★│ 🏷️ Version : *2.0.0 Bᴇᴛᴀ*
┃★│ 📚 Commands : *${totalCommands}*
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
╭━━〔 *Menu List* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈│ ➊ 🤖 *Ai Menu*
┃◈│ ➋ 🔄 *Convert Menu*
┃◈│ ➌ 📥 *Download Menu*
┃◈│ ➍ 😄 *Fun Menu*
┃◈│ ➎ 👥 *Group Menu*
┃◈│ ➏ 🖼️ *Imagine Menu*
┃◈│ ➐ 🎨 *Logo Menu*
┃◈│ ➑ 🏠 *Main Menu*
┃◈│ ➒ 📌 *Other Menu*
┃◈│ ➓ 👑 *Owner Menu*
┃◈│ ⓫ 🔍 *Search Menu*
┃◈│ ⓬ ⚙️ *Setting Menu*
┃◈╰───────────┈⊷
╰──────────────┈⊷
> ${config.DESCRIPTION}`;

      // Fake VCard
        const FakeVCard = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "© 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=13135550002:+13135550002\nEND:VCARD`
        }
      }
    };       
        
        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363400240662312@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: FakeVCard }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: FakeVCard }
                );
            }
        };

        // Send image with timeout
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo: contextInfo },
                { quoted: FakeVCard }
            );
        }
        
        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "🤖 *AI Menu* 🤖",
                content: `╭━━━〔 *🤖 Ai Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ • ai
┃★│ • gpt
┃★│ • openai
┃★│ • gemini
┃★│ • gemini2
┃★│ • aiimg
┃★│ • aiimg2
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '2': {
                title: "🔄 *Convert Menu* 🔄",
                content: `╭━━━〔 🔄 *Convert Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "📥 *Download Menu* 📥",
                content: `╭━━━〔 📥 *Download Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ • apk
┃★│ • apk2
┃★│ • facebook
┃★│ • fb2
┃★│ • gdrive
┃★│ • gdrive2
┃★│ • gitclone
┃★│ • image
┃★│ • img
┃★│ • instagram
┃★│ • igvid
┃★│ • ig2
┃★│ • mediafire
┃★│ • mfire2
┃★│ • pinterest
┃★│ • pindl2
┃★│ • ringtone
┃★│ • spotify
┃★│ • spotify2
┃★│ • tiktok
┃★│ • tt2
┃★│ • tiks
┃★│ • twitter
┃★│ • xnxx
┃★│ • xvideo
┃★│ • ytmp3
┃★│ • play
┃★│ • song
┃★│ • song1
┃★│ • song2
┃★│ • song3
┃★│ • song4
┃★│ • song5
┃★│ • song6
┃★│ • video
┃★│ • video1
┃★│ • video2
┃★│ • video3
┃★│ • video4 
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "😄 *Fun Menu* 😄",
                content: `╭━━━〔 😄 *Fun Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "👥 *Group Menu* 👥",
                content: `╭━━━〔 👥 *Group Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🖼️ *Imagine Menu 🖼️*",
                content: `╭━━━〔 🖼️ *Imagine Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ • awoo
┃★│ • dog
┃★│ • imgloli
┃★│ • maid
┃★│ • megumin
┃★│ • waifu
┃★│ • neko
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
┃★│ • wallpaper
┃★│ • randomwall
┃★│ • getimage
┃★│ • imgscan
┃★│ • image
┃★│ • adedit
┃★│ • bluredit
┃★│ • greyedit
┃★│ • invertedit
┃★│ • jailedit
┃★│ • jokeedit
┃★│ • nokiaedit
┃★│ • wantededit
┃★│ • removebg
┃★│ • couplepp
┃★│ • bonk
┃★│ • bully
┃★│ • blush
┃★│ • bite
┃★│ • cry
┃★│ • cuddle
┃★│ • cringe
┃★│ • dance
┃★│ • glomp
┃★│ • hug
┃★│ • happy
┃★│ • handhold
┃★│ • highfive
┃★│ • kill
┃★│ • kiss
┃★│ • lick
┃★│ • nom
┃★│ • pat
┃★│ • poke
┃★│ • smug
┃★│ • slay
┃★│ • smile
┃★│ • marige
┃★│ • wave
┃★│ • wink
┃★│ • yeet
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🎨 *Logo Menu* 🎨",
                content: `╭━━━〔 🎨 *Logo Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ • 3dcomic
┃★│ • 3dpaper
┃★│ • america
┃★│ • angelwings
┃★│ • bear
┃★│ • bulb
┃★│ • boom
┃★│ • birthday
┃★│ • blackpink
┃★│ • cat
┃★│ • clouds
┃★│ • castle
┃★│ • deadpool
┃★│ • dragonball
┃★│ • devilwings
┃★│ • eraser
┃★│ • frozen
┃★│ • futuristic
┃★│ • galaxy
┃★│ • hacker
┃★│ • leaf
┃★│ • luxury
┃★│ • naruto
┃★│ • nigeria
┃★│ • neonlight
┃★│ • paint
┃★│ • pornhub
┃★│ • sans
┃★│ • sunset
┃★│ • sadgirl
┃★│ • thor
┃★│ • tatoo
┃★│ • typography
┃★│ • valorant
┃★│ • zodiac
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "🏠 *Main Menu* 🏠",
                content: `╭━━━〔 🏠 *Main Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "📌 *Other Menu* 📌",
                content: `╭━━━〔 📌 *Other Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "👑 *Owner Menu* 👑",
                content: `╭━━━〔 👑 *Owner Menu* 〕━━━┈⊷
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
┃★│ • listsudo
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
> ${config.DESCRIPTION}`,
                image: true
            },
            '11': {
                title: "🔍 *Search Menu* 🔍",
                content: `╭━━━〔 🔍 *Search Menu* 〕━━━┈⊷
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
┃★│ • news2
┃★│ • mvdetail
┃★│ • praytime
┃★│ • sss
┃★│ • srepo
┃★│ • stickers
┃★│ • ttstalk
┃★│ • twtstalk
┃★│ • yts
┃★│ • ytpost
┃★│ • ytstalk
┃★│ • weather
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '12': {
                title: "⚙️ *Setting Menu* ⚙️",
                content: `╭━━━〔 ⚙️ *Setting Menu* 〕━━━┈⊷
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
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/brlkte.jpg' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: FakeVCard }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: FakeVCard }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: FakeVCard }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-11 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: FakeVCard }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
                { quoted: FakeVCard }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
