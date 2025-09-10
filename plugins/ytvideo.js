const { cmd, commands } = require('../command');
const yts = require('yt-search');
const { fetchJson } = require('../lib/functions');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// Function to extract the video ID from youtu.be or YouTube links
function extractYouTubeId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to convert any YouTube URL to a full YouTube watch URL
function convertYouTubeLink(q) {
    const videoId = extractYouTubeId(q);
    if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return q;
}

cmd({
    pattern: "video5",
    alias: ["ytv3"],
    desc: "To download songs.",
    react: "🎬",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        q = convertYouTubeLink(q);
        if (!q) return reply("*`Need YT_URL or Title`*");
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
✾━┫ *⚬Lααɾα-ᴠᴇᴅɪᴏ⚬* ┣━✾
              *ᴸ  ͣ  ͣ  ͬ  ͣ  ✻  ᴸ  ͣ  ͣ  ͬ  ͣ*

> ❍ *ᴛɪᴛʟᴇ :* ${data.title}
> ❍ *ᴅᴜʀᴀᴛɪᴏɴ :* ${data.timestamp}
> ❍ *ᴠɪᴇᴡꜱ :* ${data.views}
> ❍ *ᴜᴘʟᴏᴀᴅ ᴏɴ :* ${data.ago}

> Lααɾα-ᴍᴅ ✻
`;
let info = `
*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*
 `;   
const sentMsg = await conn.sendMessage(from, {
            image: { url: data.thumbnail},
            caption: desc,
  contextInfo: {
                mentionedJid: ['94779062397@s.whatsapp.net'], // specify mentioned JID(s) if any
                groupMentions: [],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363192254044294@newsletter',
                    newsletterName: "Lααɾα-ᴍᴅ ✻",
                    serverMessageId: 999
                }
            }
     }, {quoted: mek});
     
     const down =  await fetchJson(`https://api.agatz.xyz/api/ytmp4?url=${url}`);
     const laraDown = down.data.downloadUrl;
     await conn.sendMessage(
    from, 
    { 
        video: {
            url: laraDown
        },
        caption: '*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*',
	    ptv: false // if set to true, will send as a `video note`
    },
{quoted: mek});
await conn.sendMessage(from, { delete: sentMsg.key });

 } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

cmd({
    pattern: "video6",
    alias: ["ytv","mp4"],
    desc: "To download songs.",
    react: "🎬",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        q = convertYouTubeLink(q);
        if (!q) return reply("*`Need YT_URL or Title`*");
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;

        let desc = `
✾━┫ *⚬Lααɾα-ᴠᴇᴅɪᴏ⚬* ┣━✾
              *ᴸ  ͣ  ͣ  ͬ  ͣ  ✻  ᴸ  ͣ  ͣ  ͬ  ͣ*

> ❍ *ᴛɪᴛʟᴇ :* ${data.title}
> ❍ *ᴅᴜʀᴀᴛɪᴏɴ :* ${data.timestamp}
> ❍ *ᴠɪᴇᴡꜱ :* ${data.views}
> ❍ *ᴜᴘʟᴏᴀᴅ ᴏɴ :* ${data.ago}

🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ*
*ᴅᴏᴡɴʟᴏᴀᴅ ꜰʀᴏᴍᴀᴛ*

*1*  |  _360p ᴅᴏᴡɴʟᴏᴀᴅ_
*2*  |  _480p ᴅᴏᴡɴʟᴏᴀᴅ_
*3*  |  _720p ᴅᴏᴡɴʟᴏᴀᴅ_
*4*  |  _1080p ᴅᴏᴡɴʟᴏᴀᴅ_

> Lααɾα-ᴍᴅ ✻
`;
let info = `
*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*
 `;   
const sentMsg = await conn.sendMessage(from, {
            image: { url: data.thumbnail},
            caption: desc,
  contextInfo: {
                mentionedJid: ['94779062397@s.whatsapp.net'], // specify mentioned JID(s) if any
                groupMentions: [],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363192254044294@newsletter',
                    newsletterName: "Lααɾα-ᴍᴅ ✻",
                    serverMessageId: 999
                }
            }
     }, {quoted: mek});
     
        const messageID = sentMsg.key.id; // Save the message ID for later reference


        // Listen for the user's response
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            const mek = messageUpdate.messages[0];
            if (!mek.message) return;
            const messageType = mek.message.conversation || mek.message.extendedTextMessage?.text;
            const from = mek.key.remoteJid;
            const sender = mek.key.participant || mek.key.remoteJid;

            // Check if the message is a reply to the previously sent message
            const isReplyToSentMsg = mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo.stanzaId === messageID;

            if (isReplyToSentMsg) {
                // React to the user's reply (the "1" or "2" message)

                // React to the upload (sending the file)
                

                if (messageType === '1') {
                    // Handle option 1 (Audio File)
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                    let apiUrl = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${encodeURIComponent(url)}&format=360&apikey=sadiya`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (!data.result.download) {
            return reply("Failed to fetch the video. Please try again later.");
        }
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });  
                    await conn.sendMessage(from, {
                        document: { url: data.result.download },
                        mimetype: "video/mp4",
                        fileName: `${data.result.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                        caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*\n> *360P*",
                        contextInfo: {
                            externalAdReply: {
                                title: data.result.title,
                                body: "ꜱᴀᴅᴇᴇꜱʜᴀ ᴛʜᴀʀᴜᴍɪɴ",
                                mediaType: 1,
                                sourceUrl: url,
                                thumbnailUrl: data.result.thumbnail, // This should match the image URL provided above
                                renderLargerThumbnail: false,
                                showAdAttribution: true
                            }
                        }
                                            
                      }, { quoted: mek });
                    await conn.sendMessage(from, { delete: sentMsg.key });
                
                } else if (messageType === '2') {
                    // Handle option 2 (Document File)
                    await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                    let apiUrl = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${encodeURIComponent(url)}&format=480&apikey=sadiya`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (!data.result.download) {
            return reply("Failed to fetch the video. Please try again later.");
        }
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                    await conn.sendMessage(from, {
                        document: { url: data.result.download },
                        mimetype: "video/mp4",
                        fileName: `${data.result.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                        caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*\n> *480P*",
                        contextInfo: {
                            externalAdReply: {
                                title: data.result.title,
                                body: "ꜱᴀᴅᴇᴇꜱʜᴀ ᴛʜᴀʀᴜᴍɪɴ",
                                mediaType: 1,
                                sourceUrl: "https://github.com/sadiyamin",
                                thumbnailUrl: data.result.thumbnail, // This should match the image URL provided above
                                renderLargerThumbnail: false,
                                showAdAttribution: true
                            }
                        }
                                            
                      }, { quoted: mek });
                      await conn.sendMessage(from, { delete: sentMsg.key });
                     } else if (messageType === '3') {
                     await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                     let apiUrl = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${encodeURIComponent(url)}&format=720&apikey=sadiya`;
        
                     let response = await fetch(apiUrl);
                     let data = await response.json();
                     
                     if (!data.result.download) {
                         return reply("Failed to fetch the video. Please try again later.");
                     }
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });  
                    await conn.sendMessage(from, {
                        document: { url: data.result.download },
                        mimetype: "video/mp4",
                        fileName: `${data.result.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                        caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*\n> *720P*",
                        contextInfo: {
                            externalAdReply: {
                                title: data.result.title,
                                body: "ꜱᴀᴅᴇᴇꜱʜᴀ ᴛʜᴀʀᴜᴍɪɴ",
                                mediaType: 1,
                                sourceUrl: url,
                                thumbnailUrl: data.result.thumbnail, // This should match the image URL provided above
                                renderLargerThumbnail: false,
                                showAdAttribution: true
                            }
                        }
                                            
                      }, { quoted: mek });
                    await conn.sendMessage(from, { delete: sentMsg.key }); 
                     } else if (messageType === '4') {
                     await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                     let apiUrl = `https://sadiya-tech-apis.vercel.app/download/ytdl?url=${encodeURIComponent(url)}&format=1080&apikey=sadiya`;
        
                     let response = await fetch(apiUrl);
                     let data = await response.json();
                     
                     if (!data.result.download) {
                         return reply("Failed to fetch the video. Please try again later.");
                     }
                await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });  
                    await conn.sendMessage(from, {
                        document: { url: data.result.download },
                        mimetype: "video/mp4",
                        fileName: `${data.result.title}.mp4`, // Ensure `img.allmenu` is a valid image URL or base64 encoded image
                        caption: "*© ᴄʀᴇᴀᴛᴇᴅ ʙʏ ꜱᴀᴅᴇᴇꜱʜᴀ ᴄᴏᴅᴇʀ · · ·*\n> *1080P*",
                        contextInfo: {
                            externalAdReply: {
                                title: data.result.title,
                                body: "ꜱᴀᴅᴇᴇꜱʜᴀ ᴛʜᴀʀᴜᴍɪɴ",
                                mediaType: 1,
                                sourceUrl: url,
                                thumbnailUrl: data.result.thumbnail, // This should match the image URL provided above
                                renderLargerThumbnail: false,
                                showAdAttribution: true
                            }
                        }
                                            
                      }, { quoted: mek });
                    await conn.sendMessage(from, { delete: sentMsg.key }); 
                }
            }
        });
        
 } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
}); 
cmd({ 
    pattern: "mp42", 
    alias: ["video2"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 < YT URL OR NAME >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("PROVIDE URL OR NAME");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = ` 
*LARA MD VIDEO DOWNLOADER*

> *TITLE:* ${yts.title}
> *DURATION:* ${yts.timestamp}
> *VIEWS:* ${yts.views}
> *AUTHOR:* ${yts.author.name}
> *LINK:* ${yts.url}

*Lααɾα-ᴍᴅ*
`;

        // Send video directly with caption
        await conn.sendMessage(
            from, 
            { 
                video: { url: data.result.download_url }, 
                caption: ytmsg,
                mimetype: "video/mp4"
            }, 
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});
