const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')

cmd({
  pattern: 'song',
  desc: 'Download YouTube songs as MP3',
  category: 'music',
  use: '.song <song name or YouTube link>'
}, async (conn, mek, m, { text }) => {
  try {
    if (!text) return m.reply('🪶 Please give me a song name or YouTube link!')

    m.reply('🔎 Searching your song...')

    let videoUrl = ''
    if (text.includes('youtube.com') || text.includes('youtu.be')) {
      videoUrl = text
    } else {
      const search = await yts(text)
      if (!search.videos.length) return m.reply('❌ No results found.')
      videoUrl = search.videos[0].url
    }

    m.reply('🎧 Downloading MP3, please wait...')

    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/youtube-mp3?url=${videoUrl}&format=mp3`
    const res = await axios.get(apiUrl)

    if (!res.data || !res.data.result || !res.data.result.url)
      return m.reply('❌ Failed to get the download link.')

    const { title, thumbnail, url } = res.data.result

    await conn.sendMessage(m.chat, {
      audio: { url },
      mimetype: 'audio/mpeg',
      ptt: false,
      fileName: `${title}.mp3`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `🎵 *${title}* \n✅ Downloaded successfully!`
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Error: ' + err.message)
  }
})
