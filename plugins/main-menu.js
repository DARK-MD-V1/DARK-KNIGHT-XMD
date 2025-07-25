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
┃◈│➊ 📥 *Download Menu*
┃◈│➋ 👥 *Group Menu*
┃◈│➌ 😄 *Fun Menu*
┃◈│➍ 👑 *Owner Menu*
┃◈│➎ 🤖 *AI Menu*
┃◈│➏ 🎎 *Anime Menu*
┃◈│➐ 🔄 *Convert Menu*
┃◈│➑ 📌 *Other Menu*
┃◈│➒ 💞 *Reactions Menu*
┃◈│➓ 🏠 *Main Menu*
┃◈│⓫ 🎨 *Logo Menu*
┃◈╰───────────┈⊷
╰──────────────┈⊷
> ${config.DESCRIPTION}`;

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
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
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
                { quoted: mek }
            );
        }
        
        const messageID = sentMsg.key.id;

        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "📥 *Download Menu* 📥",
                content: `╭━━━〔 *Download Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🌐 *Social Media*
┃★│ • facebook [url]
┃★│ • fb2 [url]
┃★│ • mediafire [url]
┃★│ • mfire [url]
┃★│ • tiktok [url]
┃★│ • tt2 [url]
┃★│ • twitter [url]
┃★│ • Insta [url]
┃★│ • Insta2 [url]
┃★│ • apk [app]
┃★│ • apk2 [app]
┃★│ • img [query]
┃★│ • pins [url]
┃★│ • pins2 [url]
┃★│ • pinterest [url]
┃★│ • ssweb [url]
┃★╰──────────────
┃★╭──────────────
┃★│ 🔞 *Adult Zone*
┃★│ • xvideo [query]
┃★│ • xnxx [query]
┃★│ • porn [query]
┃★│ • xporn [query]
┃★╰──────────────
┃★╭──────────────
┃★│ 🎬 *Movie Menu*
┃★│ • movie [name] (detail)
┃★│ • pirate [name]
┃★│ • pirate2 [name]
┃★│ • sinhalasub [name]
┃★│ • sinhalasub2 [name]
┃★╰──────────────
┃★╭──────────────
┃★│ 🎵 *Music/Video*
┃★│ • spotify [query]
┃★│ • play [url]
┃★│ • play1 [song]
┃★│ • play2 [name]
┃★│ • song [name]
┃★│ • song1 [name]
┃★│ • song2 [name]
┃★│ • audio [url]
┃★│ • audio2 [name]
┃★│ • music [url]
┃★│ • video [name]
┃★│ • video1 [name]
┃★│ • video2 [name]
┃★│ • video3 [name]
┃★│ • ytmp3 [url]
┃★│ • ytmp4 [url]
┃★│ • darama [name]
┃★│ • gdrive [url]
┃★│ • tiks [name]
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '2': {
                title: "👥 *Group Menu* 👥",
                content: `╭━━━〔 *Group Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🛠️ *Management*
┃★│ • grouplink
┃★│ • kickall
┃★│ • kickall2
┃★│ • kickall3
┃★│ • add @user
┃★│ • remove @user
┃★│ • kick @user
┃★│ • out @user
┃★╰──────────────
┃★╭──────────────
┃★│ ⚡ *Admin Tools*
┃★│ • promote @user
┃★│ • demote @user
┃★│ • dismiss 
┃★│ • revoke
┃★│ • setgoodbye
┃★│ • setwelcome
┃★│ • delete
┃★│ • getpic
┃★│ • ginfo
┃★│ • disappear on
┃★│ • disappear off
┃★│ • disappear 7h,24h
┃★│ • allreq
┃★│ • updategname
┃★│ • updategdesc
┃★│ • joinrequest
┃★│ • senddm
┃★│ • nikal
┃★│ • fullpo 
┃★│ • mute [time]
┃★│ • unmute
┃★│ • lockgc
┃★│ • unlockgc
┃★│ • antilink kick
┃★│ • out + country code
┃★╰──────────────
┃★╭──────────────
┃★│ 🏷️ *Tagging*
┃★│ • tag @user
┃★│ • hidetag [msg]
┃★│ • tagall
┃★│ • tagadmins
┃★│ • invite
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "😄 *Fun Menu* 😄",
                content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🎭 *Interactive*
┃★│ • shapar
┃★│ • rate @user
┃★│ • insult @user
┃★│ • hack @user
┃★│ • ship @user1 @user2
┃★│ • character
┃★│ • pickup
┃★│ • joke
┃★│ • blur
┃★│ • setpp
┃★│ • hand
┃★│ • nikal
┃★│ • hold
┃★│ • hug
┃★│ • hifi
┃★│ • poke
┃★│ • meme
┃★│ • fact 
┃★│ • quote
┃★│ • truth
┃★│ • dare
┃★│ • war
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Reactions*
┃★│ • hrt
┃★│ • hpy
┃★│ • syd
┃★│ • anger
┃★│ • shy
┃★│ • kiss
┃★│ • mon
┃★│ • cunfuzed
┃★│ • nikal
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "👑 *Owner Menu* 👑",
                content: `╭━━━〔 *Owner Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ⚠️ *Restricted*
┃★│ • block @user
┃★│ • unblock @user
┃★│ • broadcast
┃★│ • join
┃★│ • leave
┃★│ • fullpp/pp [img]
┃★│ • setpp [img]
┃★│ • restart
┃★│ • shutdown
┃★│ • updatecmd
┃★│ • setsudo
┃★│ • delsudo
┃★│ • setmyname
┃★│ • setppall [img]
┃★│ • getbio @tag
┃★│ • getpp @tag
┃★│ • privacy
┃★│ • getprivacy
┃★│ • groupsprivacy
┃★│ • updatebio 
┃★│ • blocklist
┃★│ • chai
┃★╰──────────────
┃★╭──────────────
┃★│ ℹ️ *Info Tools*
┃★│ • gjid
┃★│ • jid @user
┃★│ • id
┃★│ • menu
┃★│ • menu2
┃★│ • allmenu
┃★│ • listcmd
┃★│ • bible
┃★│ • biblelist
┃★│ • owner
┃★│ • vv / vv1
┃★│ • vv3
┃★│ • repo
┃★│ • alive
┃★│ • ping
┃★│ • ping2
┃★│ • version
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "🤖 *AI Menu* 🤖",
                content: `╭━━━〔 *AI Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 💬 *Chat AI*
┃★│ • ai [query]
┃★│ • bot [query]
┃★│ • gpt [query]
┃★│ • openai [query]
┃★│ • chatgpt [query]
┃★│ • deepseek [query]
┃★│ • seekai [query]
┃★╰──────────────
┃★╭──────────────
┃★│ 🖼️ *Image AI*
┃★│ • imagine [text]
┃★│ • imagine2 [text]
┃★╰──────────────
┃★╭──────────────
┃★│ 🔍 *Specialized*
┃★│ • gemini [query]
┃★│ • gemini2 [query]
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🎎 *Anime Menu* 🎎",
                content: `╭━━━〔 *Anime Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Images*
┃★│ • fack
┃★│ • truth
┃★│ • dare
┃★│ • dog
┃★│ • awoo
┃★│ • garl
┃★│ • waifu
┃★│ • neko
┃★│ • megnumin
┃★│ • maid
┃★│ • loli
┃★╰──────────────
┃★╭──────────────
┃★│ 🎭 *Characters*
┃★│ • animenews
┃★│ • animeboy
┃★│ • animegirl
┃★│ • animegirl 1-5
┃★│ • anime 1-5
┃★│ • animequote
┃★│ • animewall
┃★│ • animememe
┃★│ • foxgirl
┃★│ • naruto
┃★│ • neko
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🔄 *Convert Menu* 🔄",
                content: `╭━━━〔 *Convert Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🖼️ *Media*
┃★│ • sticker [img]
┃★│ • sticker2 [img]
┃★│ • emojimix 😎+😂
┃★│ • take [name,text]
┃★│ • tomp3 [video]
┃★│ • tomp4 [img]
┃★│ • remini [img]
┃★│ • removebg [img]
┃★│ • imgjoke [img]
┃★│ • invert [img]
┃★│ • grey [img]
┃★│ • blur [img]
┃★│ • wanted [img]
┃★│ • jail [img]
┃★│ • tiny [img]
┃★╰──────────────
┃★╭──────────────
┃★│ 📝 *Text*
┃★│ • fancy [text]
┃★│ • tts [text]
┃★│ • trt [text]
┃★│ • base64 [text]
┃★│ • unbase64 [text]
┃★│ • binary [test]
┃★│ • dbinary [test]
┃★│ • tinyurl [test]
┃★│ • urldecode [test]
┃★│ • urlencode [test]
┃★│ • url [test]
┃★│ • repeat [test]
┃★│ • ask [test]
┃★│ • readmore [test]
┃★│ • help [test]
┃★│ • support [test]
┃★│ • urltoimg [url]
┃★│ • recaption [test]
┃★│ • caption [test]
┃★│ • repost [test]
┃★│ • story [test]
┃★│ • states [test]
┃★│ • vcf [test]
┃★│ • ad [test]
┃★│ • nokia [test]
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "📌 *Other Menu* 📌",
                content: `╭━━━〔 *Other Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ 🕒 *Utilities*
┃★│ • timenow
┃★│ • date
┃★│ • count [num]
┃★│ • calculate [expr]
┃★│ • countx
┃★│ • gpass
┃★╰──────────────
┃★╭──────────────
┃★│ 🎲 *Random*
┃★│ • flip
┃★│ • coinflip
┃★│ • rcolor
┃★│ • roll
┃★│ • fact
┃★│ • cpp
┃★│ • rw
┃★│ • pair
┃★│ • fancy
┃★│ • logo
┃★│ • insult
┃★│ • save
┃★│ • chr [test]
┃★╰──────────────
┃★╭──────────────
┃★│ 🔍 *Search*
┃★│ • define [word]
┃★│ • news [query]
┃★│ • movie [name]
┃★│ • weather [loc]
┃★│ • srepo [name]
┃★│ • wikipedia [name]
┃★│ • hithubstalk
┃★│ • yts
┃★│ • ytv
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "💞 *Reactions Menu* 💞",
                content: `╭━━━〔 *Reactions Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ❤️ *Affection*
┃★│ • cuddle @user
┃★│ • hug @user
┃★│ • kiss @user
┃★│ • lick @user
┃★│ • pat @user
┃★╰──────────────
┃★╭──────────────
┃★│ 😂 *Funny*
┃★│ • cry @user 
┃★│ • smug @user
┃★│ • bully @user
┃★│ • bonk @user
┃★│ • yeet @user
┃★│ • slap @user
┃★│ • kill @user
┃★│ • nom @user
┃★│ • bite @user
┃★│ • cringe @user
┃★╰──────────────
┃★╭──────────────
┃★│ 😊 *Expressions*
┃★│ • awoo @user
┃★│ • blush @user
┃★│ • smile @user
┃★│ • wave @user
┃★│ • highfive @user
┃★│ • handhold @user
┃★│ • glomp @user
┃★│ • slap @user
┃★│ • happy @user
┃★│ • wink @user
┃★│ • poke @user
┃★│ • dance @user
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 *Main Menu* 🏠",
                content: `╭━━━〔 *Main Menu* 〕━━━┈⊷
┃★╭──────────────
┃★│ ℹ️ *Bot Info*
┃★│ • ping
┃★│ • ping2
┃★│ • speed
┃★│ • live
┃★│ • alive
┃★│ • runtime
┃★│ • uptime
┃★│ • version
┃★│ • repo
┃★│ • owner
┃★╰──────────────
┃★╭──────────────
┃★│ 🛠️ *Controls*
┃★│ • menu
┃★│ • menu2
┃★│ • restart
┃★╰──────────────
╰━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true
            },
            '11': {
                title: "🎨 *Logo Menu* 🎨",
                content: `╭━━━〔 *Logo Menu* 〕━━━┈⊷
┃★╭──────────────      
┃★│ 🎨 *Logo Menu*
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
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
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
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-11 to select a menu.\n\n*Example:* Reply with "1" for Download Menu\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
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
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
