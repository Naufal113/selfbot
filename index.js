const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange, 
    WA_DEFAULT_EPHEMERAL, 
    WA_MESSAGE_STUB_TYPES
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const imageToBase64 = require('image-to-base64')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const setting = JSON.parse(fs.readFileSync('./src/settings.json'))
prefix = setting.prefix
blocked = []
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:ME? \n' 
            + 'ORG:ME? .;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=6285793432434:+62 857-9343-2434\n' // NOMER HP LU
            + 'END:VCARD'

const setiker = JSON.parse(fs.readFileSync('./src/stik.json'))
const audionye = JSON.parse(fs.readFileSync('./src/audio.json'))

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)}Jam ${pad(minutes)}Mnt ${pad(seconds)}Dtk`
}


				 

async function starts() {
	const selfb = new WAConnection()
	selfb.logger.level = 'warn'
	console.log(banner.string)
	selfb.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./self-bot.json') && selfb.loadAuthInfo('./self-bot.json')
	selfb.on('connecting', () => {
		start('2', 'Connecting...')
	})
	selfb.on('open', () => {
		success('2', 'Connected')
	})
	await selfb.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./self-bot.json', JSON.stringify(selfb.base64EncodedAuthInfo(), null, '\t'))

	selfb.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	selfb.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (!mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const speed = require('performance-now') 
			const date = new Date().toLocaleDateString()
			const time = moment.tz('Asia/Jakarta').format(' (HH:mm:ss)--(DD/MM/YYYY) ')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
			
			mess = {
				wait: '`\`\`\PROSES GAN! \`\`\`',
				asik: '`\`\`\PROSES GAN! \`\`\`',
				success: '_Yeay Berhasil Kak_',
				error: {
					stick: 'PT.error.Stick',
					Iv: ' Link yang anda kirim tidak valid!'
				}}

			const botNumber = selfb.user.jid
			const totalchat = await selfb.chats.all()
			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const tescuk = ["0@s.whatsapp.net"]
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await selfb.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				selfb.sendMessage(from, teks, text, {quoted:mek})
			}
			const apikey = setting.apiKey // get on https://leyscoders-api.herokuapp.com
			const lolkey = setting.lol // get on http://lolhuman.herokuapp.com
			const vinz = setting.vinz //get on https://api.zeks.xyz
			const sendMess = (hehe, teks) => {
				selfb.sendMessage(hehe, teks, text)
			}
			const freply = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } }
			
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? selfb.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : selfb.sendMessage(from, teks.trim(), extendedText, {quoted: freply, contextInfo: {"mentionedJid": memberr}})
			}
			

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			let authorname = selfb.contacts[from] != undefined ? selfb.contacts[from].vname || selfb.contacts[from].notify : undefined	
			function addMetadata(packname, author) {	
	if (!packname) packname = 'WABot'; 
	let name = `${packname}`
	const packID = 'com.snowcorp.stickerly.android.stickercontentprovider b5e7275f-f1de-4137-961f-57becfad34f2'
    const playstore = 'https://play.google.com/store/apps/details?id=com.termux'
     const itunes = 'https://itunes.apple.com/app/sticker-maker-studio/id1443326857'
	if (fs.existsSync(`./${name}.exif`)) return `./${name}.exif`
	const json = {	
	     "sticker-pack-id": packID,
		"sticker-pack-name": packname,
		"android-app-store-link": playstore,
         'ios-app-store-link': itunes
	}
	const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
	const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]	

	let len = JSON.stringify(json).length	
	let last	

	if (len > 256) {	
		len = len - 256	
		bytes.unshift(0x01)	
	} else {	
		bytes.unshift(0x00)	
	}	

	if (len < 16) {	
		last = len.toString(16)	
		last = "0" + len	
	} else {	
		last = len.toString(16)	
	}	

	const buf2 = Buffer.from(last, "hex")	
	const buf3 = Buffer.from(bytes)	
	const buf4 = Buffer.from(JSON.stringify(json))	

	const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

	fs.writeFile(`./${name}.exif`, buffer, (err) => {	
		return `./${name}.exif`	
	})	

} 
			 if (budy.includes(`assalamualaikum`)) {
                  reply(`Waalaikumsalam`)
                  }
                  if (budy.includes(`Assalamualaikum`)) {
                  reply(`Waalaikumsalam`)
                  }
                   if (budy.includes(`assalamu'alaikum`)) {
                  reply(`Waalaikumsalam`)
                  }
                  if (budy.includes(`Assalamu'alaikum`)) {
                  reply(`Waalaikumsalam`)
                  }
                  if (budy.match('tobat')){
   var Hmm = fs.readFileSync('./src/audio/tobat.mp3');
selfb.sendMessage(from, Hmm, audio, { mimetype: 'audio/mp4', quoted : freply,ptt: true })
}
if (budy.match('Tobat')){
   var Hmm = fs.readFileSync('./src/audio/tobat.mp3');
selfb.sendMessage(from, Hmm, audio, { mimetype: 'audio/mp4', quoted : freply, ptt: true })
}
			
			switch(command) {
				case 'help':
				case 'menu':
				co = ["1.3","1.2","1.4","1.1","1.6","1.5","1.272bytes","1.392bytes","1.536bytes","1.464bytes","1.630bytes","1.139bytes"]
  am = co[Math.floor(Math.random() * co.length)]
runtime = process.uptime()
          selfb.sendMessage(from, `
┏━━━━《 SelfBot Recode 》━━━━
┃
┣◪ 𝗜𝗡𝗙𝗢
┃ ❏ Library : Baileys
┃ ❏ Runtime : ${kyun(runtime)}
┃ ❏ Waktu Saat Ini : ${time}
┃ ❏ Prefix : 「 ${prefix} 」
┃ ❏ Ram : *${am}* / 3.0gb
┃ ❏ Selfbot Recode
‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎┃
┣◪ 𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗
┃
┣ ❏ ${prefix}statusimg
┣ ❏ ${prefix}statusvid
┣ ❏ ${prefix}addsticker
┣ ❏ ${prefix}addvn
┣ ❏ ${prefix}addimage
┣ ❏ ${prefix}addvideo
┣ ❏ ${prefix}getsticker
┣ ❏ ${prefix}getvn
┣ ❏ ${prefix}getimage
┣ ❏ ${prefix}getvideo
┣ ❏ ${prefix}nightcore
┣ ❏ ${prefix}slow
┣ ❏ ${prefix}tupai
┣ ❏ ${prefix}blub
┣ ❏ ${prefix}gemuk
┣ ❏ ${prefix}ghost
┣ ❏ ${prefix}bass
┣ ❏ ${prefix}toptt
┃
┣◪ 𝗠𝗔𝗞𝗘𝗥 
┃
┣ ❏ ${prefix}sticker
┣ ❏ ${prefix}ttp [text]
┣ ❏ ${prefix}attp [text]
┣ ❏ ${prefix}take
┣ ❏  ${prefix}hitler [@tagmember]
┣ ❏  ${prefix}deletetrash [@tagmember]
┣ ❏  ${prefix}trash [@tagmember]
┣ ❏  ${prefix}joke [@tagmember]
┣ ❏  ${prefix}sephia [@tagmember]
┣ ❏  ${prefix}affect [reply gambar]
┣ ❏  ${prefix}picture [reply gambar]
┣ ❏  ${prefix}wanted [reply gambar]
┣ ❏  ${prefix}trigger [reply gambar]
┣ ❏  ${prefix}greyscale [reply gambar]
┣ ❏  ${prefix}igstalk [@username]
┃
┣◪ 𝗘𝗗𝗨𝗞𝗔𝗦𝗜 & 𝗜𝗡𝗙𝗢
┃
┣ ❏  ${prefix}runtime
┣ ❏  ${prefix}run [function]
┣ ❏  ${prefix}cekchat
┣ ❏  ${prefix}kali [2|8]
┣ ❏  ${prefix}persegipjg [lebar|panjang]
┣ ❏  ${prefix}kuadrat [angka]
┣ ❏  ${prefix}persegi [sisi]
┣ ❏  ${prefix}kubik [angka]
┣ ❏  ${prefix}detik
┣ ❏  ${prefix}sindointer
┣ ❏  ${prefix}sindonasional
┣ ❏  ${prefix}okezone
┣ ❏  ${prefix}antara
┣ ❏  ${prefix}berita
┣ ❏  ${prefix}wattpad [query]
┣ ❏  ${prefix}kiryuu
┣ ❏  ${prefix}apkpure [apk]
┣ ❏  ${prefix}otakunews
┣ ❏  ${prefix}dewabatch
┣ ❏  ${prefix}dewasearch [judul]
┣ ❏  ${prefix}jadwalbola
┃
┣◪ 𝗚𝗥𝗢𝗨𝗣
┃
┣ ❏ ${prefix}zxci
┣ ❏ ${prefix}tag
┣ ❏ ${prefix}add
┣ ❏ ${prefix}promote
┣ ❏ ${prefix}demote
┣ ❏ ${prefix}kick
┣ ❏ ${prefix}delete
┣ ❏ ${prefix}jagoan
┃
┗━━━━《 SelfBot Recode 》━━━━`, MessageType.text, {quoted: freply})
					break
					case 'bahasa':
					case 'listbahasa':
					selfb.sendMessage(from, `
					List kode Bahasa
  
   af :  Afrikaans  
   sq :  Albanian  
   ar :  Arabic  
   hy :  Armenian  
   ca :  Catalan  
   zh :  Chinese  
   zh-cn :  Chinese (Mandarin/China)  
   zh-tw :  Chinese (Mandarin/Taiwan)  
   zh-yue :  Chinese (Cantonese)  
   hr :  Croatian  
   cs :  Czech  
   da :  Danish  
   nl :  Dutch  
   en :  English  
   en-au :  English (Australia)  
   en-uk :  English (United Kingdom)  
   en-us :  English (United States)  
   eo :  Esperanto  
   fi :  Finnish  
   fr :  French  
   de :  German  
   el :  Greek  
   ht :  Haitian Creole  
   hi :  Hindi  
   hu :  Hungarian  
   is :  Icelandic  
   id :  Indonesian  
   it :  Italian  
   ja :  Japanese  
   ko :  Korean  
   la :  Latin  
   lv :  Latvian  
   mk :  Macedonian  
   no :  Norwegian  
   pl :  Polish  
   pt :  Portuguese  
   pt-br :  Portuguese (Brazil)  
   ro :  Romanian  
   ru :  Russian  
   sr :  Serbian  
   sk :  Slovak  
   es :  Spanish  
   es-es :  Spanish (Spain)  
   es-us :  Spanish (United States)  
   sw :  Swahili  
   sv :  Swedish  
   ta :  Tamil  
   th :  Thai  
   tr :  Turkish  
   vi :  Vietnamese  
   cy :  Welsh `, MessageType.text, {quoted: freply})
   break
					case 'me':
					case 'owner':
                 selfb.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: freply})
                 selfb.sendMessage(from, 'Ini aku awokawokawok',MessageType.text, { quoted: freply} )
                 break
					case 'caristik':
sweet = body.slice(9)
					datas = await fetchJson(`https://api.zeks.xyz/api/searchsticker?apikey=${vinz}&q=${sweet}`)
					teks = '=================\n'
					for (let i of datas.sticker) {
						teks += `\n*Link* : ${i}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
					case 'stik':
					url = body.slice(6) 
					
					sweet = await getBuffer(`http://lolhuman.herokuapp.com/api/convert/towebp?apikey=${lolkey}&img=${url}`)
					
					selfb.sendMessage(from, sweet, sticker, {quoted: freply})
					break
				
               case 'speed':
                case 'ping':
                pingbro = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝙋𝙄𝙉𝙂 𝙂𝙒 𝘽𝙍𝙊", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } }
			
                co = ["1.3","1.2","1.4","1.1","1.6","1.5","1.272bytes","1.392bytes","1.536bytes","1.464bytes","1.630bytes","1.139bytes"]
  am = co[Math.floor(Math.random() * co.length)]
                    const timestamp = speed();
                    const latensi = speed() - timestamp
                    selfb.updatePresence(from, Presence.composing) 
				uptime = process.uptime()
                    selfb.sendMessage(from, `-{𝗣𝗜𝗡𝗚}-\n\nRAM : *${am}*\nChat List : *${totalchat.length}*\nBlock List : *${blocked.length}*\n\n\nSpeed: *${latensi.toFixed(4)}𝚂𝙴𝙲𝙾𝙽𝙳𝚂!`, text, { quoted: pingbro})
                    break
                    case 'fitnah':
					var gh = body.slice(8)
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
						var replace = gh.split("|")[0];
						var targets = gh.split("|")[1];
						var bot = gh.split("|")[2];
						selfb.sendMessage(from, `${bot}`, text, {quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${targets}` }}})
						break
					case 'send':
					var pc = body.slice(6)
					var nomor = pc.split("|")[0];
					var org = pc.split("|")[1];
					selfb.sendMessage(nomor+'@s.whatsapp.net', org, text)
					break
                    case 'statusvid':
                    var teksyy = body.slice(11) 
                    reply('Sedang Proses Pengiriman!')
                    enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(enmedia)
                    buff2 = fs.readFileSync(media)
                    selfb.sendMessage('status@broadcast', buff2, MessageType.image, {quoted: mek, caption: `${teksyy}`})
                    reply('Upload Story Whatsapp Sukses!')
                        break
                        case 'statusimg':
                    var teksyy = body.slice(11)
                    reply('Sedang Proses Pengiriman!')
                    enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(enmedia)
                    buff5 = fs.readFileSync(media)
                    selfb.sendMessage('status@broadcast', buff5, MessageType.video, {quoted: mek, caption: `${teksyy}`})
                    reply('Upload Story Whatsapp Sukses!')
                        break
                        case 'simi':
                    misi = body.slice(5)
                    simi = await fetchJson(`https://api.zeks.xyz/api/simi?apikey=${vinz}&text=${misi}`, {method: 'get'})
                    reply(simi.result) 
                        break
                        case 'xci':
					await selfb.toggleDisappearingMessages(from, WA_DEFAULT_EPHEMERAL) 
					
await selfb.toggleDisappearingMessages(from, 0)
				break
                       case 'from':
            try {
                axios.get('https://raw.githubusercontent.com/ArugaZ/grabbed-results/main/islam/surah.json')
                .then((response) => {
                    let hehex = '╔══✪〘 List Surah 〙✪══\n'
                    for (let i = 0; i < response.data.data.length; i++) {
                        hehex += '╠➥ '
                        hehex += response.data.data[i].name.transliteration.id.toLowerCase() + '\n'
                            }
                        hehex += '╚═〘 *List Surah* 〙'
                    reply(from, hehex, text)
                })
            } catch(err) {
                reply(from, err, text)
            }
            break
         case 'clone':
					if (args.length < 1) return reply('TAG ORANG NYA!!')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('TAG ORANG NYA!!!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						selfb.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('GAGAL!')
					}
					break
                   case 'spamcall':
          reply('Calling📲...')
                                       if (args[0].startsWith('08')) return reply('Gunakan nomor awalan 8/n ex : *81234567890*')
                                       if (args[0].startsWith('85793432434')) return reply('Gagal tidak dapat menelpon nomer sendiri')
                                       var data = body.slice(10)
                                       await fetchJson(`https://core.ktbs.io/v2/user/registration/otp/62`+data, {method: 'get'})
                                       await fetchJson(`https://arugaz.herokuapp.com/api/spamcall?no=`+data, {method: 'get'})
                                       await fetchJson(`https://api.danacita.co.id/users/send_otp/?mobile_phone=62`+data, {method: 'get'})
                                       await fetchJson(`https://account-api-v1.klikindomaret.com/api/PreRegistration/SendOTPSMS?NoHP=0`+data, {method: 'get'})
                                   data = await fetchJson(`https://tobz-api.herokuapp.com/api/spamcall?no=`+data+`&apikey=BotWeA`, {method: 'get'})
                                   call = `${data.logs}`
                                   reply(call) 
                                       break
				case 'affect':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmediia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						
							owgix = await selfb.downloadAndSaveMediaMessage(encmediia)
					data = await imgbb("acf1ad5f22ad5822dc163cce74aedfd4", owgix)
					toge = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/affect?url=${data.display_url}&apikey=${apikey}`)
						//toge = await getBuffer(anu.message)
					selfb.sendMessage(from, toge, image, {quoted: freply, caption: mess.success})
					} else {
						reply('Reply Gambar/Foto! ')
					}
					
					break
				case 'picture':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmediia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					owgix = await selfb.downloadAndSaveMediaMessage(encmediia)
					data = await imgbb("acf1ad5f22ad5822dc163cce74aedfd4", owgix)
					toge = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/picture?url=${data.display_url}&apikey=${apikey}`)
					selfb.sendMessage(from, toge, image, {quoted: freply, caption: mess.success})
					} else {
					reply('Reply Gambar/Foto! ')
					}
					break
				case 'wanted':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmediia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					owgix = await selfb.downloadAndSaveMediaMessage(encmediia)
					data = await imgbb("acf1ad5f22ad5822dc163cce74aedfd4", owgix)
					toge = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/wanted?url=${data.display_url}&apikey=${apikey}`)
					selfb.sendMessage(from, toge, image, {quoted: freply, caption: mess.success})
					} else {
					reply('Reply Gambar/Foto! ')
					}
					break
				case 'greyscale':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmediia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					owgix = await selfb.downloadAndSaveMediaMessage(encmediia)
					data = await imgbb("acf1ad5f22ad5822dc163cce74aedfd4", owgix)
					anu = await getBuffer(`http://leyscoders-api.herokuapp.com/api/img/greyscale?url=${data.display_url}&apikey=${apikey}`)
					selfb.sendMessage(from, anu, image, {quoted: freply, caption: mess.success})
					} else {
					reply('Reply Gambar/Foto! ')
					}
					break
					case 'trigger':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek 
					owgi = await  selfb.downloadAndSaveMediaMessage(ger)
					anu = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", owgi)
					teks = `${anu.display_url}`
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu1 = `https://some-random-api.ml/canvas/triggered?avatar=${teks}`
					exec(`wget ${anu1} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
					fs.unlinkSync(ranp)
					exec(`webpmux -set exif ${addMetadata('@MIKU', 'Triggered!')} ${rano} -o ${rano}`, async (error) => {
					selfb.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: freply})
					fs.unlinkSync(rano)
					})
					})
					} else {
					reply('Gunakan foto!')
					}
					break
					case 'meme':
					splet = body.slice(12)
                                        atas = splet.split('|')[0];
                                        bawah = splet.split('|')[1];
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					ger = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek 
					owgi = await  selfb.downloadAndSaveMediaMessage(ger)
					anu = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", owgi)
					teks = `${anu.display_url}`
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu1 = `https://api.memegen.link/images/custom/${atas}/${bawah}.png?background=${teks}`
					exec(`wget ${anu1} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
					fs.unlinkSync(ranp)
					exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX', 'MemeTeks')} ${rano} -o ${rano}`, async (error) => {
					selfb.sendMessage(from, fs.readFileSync(rano), sticker, {quoted: freply})
					fs.unlinkSync(rano)
					})
					})
					} else {
					reply('Gunakan foto!')
					}
					break
				case 'sephia':
					if (args.length < 1)return reply('Tag Orangnya')
					reply(mess.wait)
					var imgbb = require('imgbb-uploader')
					ghost = mek.message.extendedTextMessage.contextInfo.mentionedJid[0] || from
					pp = await selfb.getProfilePicture(ghost)
					media = await getBuffer(pp)
					datae = await imageToBase64(JSON.stringify(pp).replace(/\"/gi, ''))
					fs.writeFileSync('janckuk.jpeg', datae, 'base64')
					data = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", 'janckuk.jpeg')
					wtd = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/sepia?url=${data.display_url}&apikey=freeKeY`)
					selfb.sendMessage(from, wtd, image, {quoted: freply, caption: mess.success})
					break
				case 'trash':
					if (args.length < 1)return reply('Tag Orangnya')
					reply(mess.wait)
					var imgbb = require('imgbb-uploader')
					ghost = mek.message.extendedTextMessage.contextInfo.mentionedJid[0] || from
					pp = await selfb.getProfilePicture(ghost)
					media = await getBuffer(pp)
					datae = await imageToBase64(JSON.stringify(pp).replace(/\"/gi, ''))
					fs.writeFileSync('janckuk.jpeg', datae, 'base64')
					data = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", 'janckuk.jpeg')
					wtd = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/trash?url=${data.display_url}&apikey=freeKeY`)
					selfb.sendMessage(from, wtd, image, {quoted: freply, caption: mess.success})
					break
		       		case 'joke':
					if (args.length < 1)return reply('Tag Orangnya')
					var imgbb = require('imgbb-uploader')
					ghost = mek.message.extendedTextMessage.contextInfo.mentionedJid[0] || from
					pp = await selfb.getProfilePicture(ghost)
					media = await getBuffer(pp)
					datae = await imageToBase64(JSON.stringify(pp).replace(/\"/gi, ''))
					fs.writeFileSync('janckuk.jpeg', datae, 'base64')
					data = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", 'janckuk.jpeg')
					wtd = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/joke?url=${data.display_url}&apikey=freeKeY`)
					selfb.sendMessage(from, wtd, image, {quoted: freply, caption: mess.success})
					break
		      		case 'hitler':
					if (args.length < 1)return reply('Tag Orangnya')
					var imgbb = require('imgbb-uploader')
					ghost = mek.message.extendedTextMessage.contextInfo.mentionedJid[0] || from
					pp = await selfb.getProfilePicture(ghost)
					media = await getBuffer(pp)
					datae = await imageToBase64(JSON.stringify(pp).replace(/\"/gi, ''))
					fs.writeFileSync('janckuk.jpeg', datae, 'base64')
					data = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", 'janckuk.jpeg')
					wtd = await getBuffer(`http://leyscoders-api.herokuapp.com/api/img/hitler?url=${data.display_url}&apikey=${apikey}`)
						selfb.sendMessage(from, wtd, image, {quoted: freply, caption: mess.success})
					break
		   		 case 'deletetrash':
					if (args.length < 1)return reply('Tag Orangnya')
					var imgbb = require('imgbb-uploader')
					ghost = mek.message.extendedTextMessage.contextInfo.mentionedJid[0] || from
					pp = await selfb.getProfilePicture(ghost)
					media = await getBuffer(pp)
					datae = await imageToBase64(JSON.stringify(pp).replace(/\"/gi, ''))
					fs.writeFileSync('janckuk.jpeg', datae, 'base64')
					data = await imgbb("33ea1465ef91578a90ee81f7d41c59a1f", 'janckuk.jpeg')
					wtd = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/delete?url=${data.display_url}&apikey=${apikey}`)
					selfb.sendMessage(from, wtd, image, {quoted: freply, caption: mess.success})
					break
				case 'igstalk':
					if (args.length < 1) return reply('Masukan username nya')
		    			anu = await fetchJson(`https://leyscoders-api.herokuapp.com/api/igstalk?user=${body.slice(9)}&apikey=${apikey}`)
					if (anu.error) return reply(anu.error)
					teks = `User di temukan!!\n\n➸ *Username* : ${anu.result[0].username}\n➸ *Name* : ${anu.result[0].fullName}\n➸ *Followers* : ${anu.result[0].follower}\n➸ *Following* : ${anu.result[0].following}\n➸ *Postingan* : ${anu.result[0].postsCount}\n➸ *Highlight* : ${anu.result[0].highlightCount}\n➸ *Private* : ${anu.result[0].isPrivate}\n➸ *Verified* : ${anu.result[0].isVerified}\n➸ *Bisnis* : ${anu.result[0].isBusinessAccount}\n➸ *Biodata* : \n${anu.result[0].biography}`
					igpict = await getBuffer(anu.result[0].profilePic)
					selfb.sendMessage(from, igpict, image, {quoted: freply, caption: teks})
					break
				case 'wattpad':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/wattpad-search?q=${body.slice(9)}&apikey=${apikey}`)
				        teks = `*「 WATTPAD 」*\n\n*Hasil Pencarian : ${body.slice(9)}*\n─────────────\n\n`
					for (let i of data.result) {
					teks += `➸ *Title* : ${i.title}\n➸ *ID* : ${i.id}\n➸ *Link* : ${i.url}\n\n─────────────\n\n`
					}
					buff = await getBuffer(data.result[0].thumb)
					selfb.sendMessage(from, buff, image, {quoted: freply, caption: teks}) 	
		  			break				
				case 'kubik':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/bdr/kubik?q=${body.slice(7)}&apikey=freeKeY`)
					reply(`hasil: ${data.result}`)
					break
				case 'sindointer':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/sindo/international?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.data) {
						teks += `\n*Judul* : ${i.judul}\n*Link* : ${i.link}\n*Waktu:* ${i.waktu}\n*Type:* ${i.tipe}\n*Desc*: ${i.kutipan}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
				case 'sindonasional':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/sindo/nasional?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.data) {
						teks += `\n*Judul* : ${i.judul}\n*Link* : ${i.link}\n*Waktu:* ${i.waktu}\n*Type:* ${i.tipe}\n*Desc*: ${i.kutipan}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
				case 'kiryuu':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/kiryuu?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of data.result) {
						teks += `\n*Link:* ${i.url}\n*Judul:* ${i.judul}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
				case 'jadwalbola':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/jadwalbola?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of data.result) {
						teks += `\n*waktu:* ${i.waktu}\n*Kick Off:* ${i.kickoff}\n*Channel:* ${i.channel}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
				case 'berita':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/berita-news?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n=================\n`
					}
					buffs = await getBuffer(`${datas.result[0].img}`)
					selfb.sendMessage(from, buffs, MessageType.image, {quoted: freply, caption: teks})
					break
				case 'dewabatch':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/dewabatch?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n*Desc:* ${i.desc}\n=================\n`
					}
					buffs = await getBuffer(`${datas.result[0].img}`)
					selfb.sendMessage(from, buffs, MessageType.image, {quoted: freply, caption: teks})
					break
				case 'dewasearch':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/dewabatch?q=${body.slice(12)}&apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n*Desc:* ${i.desc}\n=================\n`
					}
					buffs = await getBuffer(`${datas.result[0].img}`)
					selfb.sendMessage(from, buffs, MessageType.image, {quoted: freply, caption: teks})
					break
				case 'antara':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/antara-news?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n=================\n`
					}
					buffs = await getBuffer(`${datas.result[0].img}`)
					selfb.sendMessage(from, buffs, MessageType.image, {quoted: freply, caption: teks})
					break
				case 'otakunews':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/otakunews?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of datas.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n=================\n`
					}
					buffs = await getBuffer(`${datas.result[0].img}`)
					selfb.sendMessage(from, buffs, MessageType.image, {quoted: freply, caption: teks})
					break
				case 'apkpure':
					datas = await fetchJson(`https://leyscoders-api.herokuapp.com/api/apkpure?q=${body.slice(9)}&apikey={apikey}`)
					teks = '=================\n'
					for (let i of datas.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n=================\n`
					}
					buffs = await getBuffer(`${datas.result[0].img}`)
					selfb.sendMessage(from, buffs, MessageType.image, {quoted: freply, caption: teks})
					break
				case 'okezone':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/okezone?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of data.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
				case 'detik':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/detik?apikey=${apikey}`)
					teks = '=================\n'
					for (let i of data.result) {
						teks += `\n*Judul* : ${i.title}\n*Link* : ${i.url}\n=================\n`
					}
					selfb.sendMessage(from, teks, MessageType.text, {quoted: freply})
					break
				case 'kuadrat':
					data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/bdr/kuadrat?q=${body.slice(9)}&apikey=${apikey}`)
					reply(`hasil: ${data.result}`)
					break
				case 'persegi':
					splet = body.slice(9)
                                        data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/persegi?sisi=${splet}apikey=${apikey}`)
                                       selfb.sendMessage(from, `Keliling:\nRumus: ${data.rumus_keliling}\nhasil: ${data.hasil_keliling}\n\nLuas:\nRumus: ${data.rumus_luas}\nHasil: ${data.hsail_luas}`, MessageType.text, {quoted: freply})
                                       break
				case 'persegipjg':
					splet = body.slice(12)
                                        no1 = splet.split('|')[0];
                                        no2 = splet.split('|')[1];
                                        data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/ppanjang?pjg=${no2}&lebar=${no2}&apikey=${apikey}`)
                                       selfb.sendMessage(from, `Keliling:\nRumus: ${data.rumus_keliling}\nhasil: ${data.hasil_keliling}\n\nLuas:\nRumus: ${data.rumus_luas}\nHasil: ${data.hsail_luas}`, MessageType.text, {quoted: freply})
                                       break
                               case 'kali':
                               	splet = body.slice(6)
                                        no1 = splet.split('|')[0];
                                        no2 = splet.split('|')[1];
                                        data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/perkalian?angka1=${no1}&angka2=${no2}&apikey=${apikey}`)
                                        reply(`Hasil: ${data.result}`)
                                        break
				case 'runtime':
				selfb.updatePresence(from, Presence.composing) 
				runtime = process.uptime()
				wah = `-{ *𝙍𝙐𝙉𝙏𝙄𝙈𝙀* }-\n\n\`\`\`${kyun(runtime)}\`\`\``
                                selfb.sendMessage(from, wah, text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.com`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝙍𝙐𝙉𝙏𝙄𝙈𝙀", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1200, "width": 1100, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } }})
			        break
			case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja mas')
					}
					break
	        case 'return':
			        return selfb.sendMessage(from, JSON.stringify(eval(args.join(''))), text, {quoted: { key: { fromMe: false, participant: `0@s.whatsapp.com`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1200, "width": 1100, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } }})
		                break
			case 'chatlist':
			case 'cekchat':
				selfb.updatePresence(from, Presence.composing)
				var itsme = `0@s.whatsapp.net`
				var split = `𝘾𝙀𝙆 𝘼𝙇𝙇-𝘾𝙃𝘼𝙏`
				var selepbot =         {
					contextInfo:   {
					participant: itsme,
					quotedMessage: {
					extendedTextMessage: {
					text: split,
				}
				}
				}
				}
				teks = `Total : ${totalchat.length}`
				selfb.sendMessage(from, teks, MessageType.text, selepbot)
				break
				case 'stiktag':
					if (!isQuotedSticker) return reply('Reply stickernya um')
					var group = await selfb.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					contextInfo: { mentionedJid: mem },
					quoted: freply
					}
					selfb.sendMessage(from, options, sticker)
					break
               case 'tag':
					var value = body.slice(4)
					var group = await selfb.groupMetadata(from)
					var member = group['participants']
					var mem = []
					member.map( async adm => {
					mem.push(adm.id.replace('c.us', 's.whatsapp.net'))
					})
					var options = {
					text: value,
					contextInfo: { mentionedJid: mem },
					quoted: freply
					}
					selfb.sendMessage(from, options, text)
					break
					case 'promote':
					case 'pm':
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di jadi admin!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Up↑ :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						selfb.groupMakeAdmin(from, mentioned)
					} else {
						mentions(`Up↑ : @${mentioned[0].split('@')[0]}`, mentioned, true)
						selfb.groupMakeAdmin(from, mentioned)
					}
					break
					case 'demote':
					case 'dm':
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tidak jadi admin!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Turun↓ :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						selfb.groupDemoteAdmin(from, mentioned)
					} else {
						mentions(`Turun↓: @${mentioned[0].split('@')[0]}`, mentioned, true)
						selfb.groupDemoteAdmin(from, mentioned)
					}
					break
					case 'kick':
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Gass :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						selfb.groupRemove(from, mentioned)
					} else {
						mentions(`Gass: @${mentioned[0].split('@')[0]}`, mentioned, true)
						selfb.groupRemove(from, mentioned)
					}
					break
					case 'leave': 
			    	anu = await selfb.groupLeave(from, '𝗕𝘆𝗲𝗲',groupId)
	                break
					case 'delete':
					case 'del':
					case 'd':
					selfb.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
					break
					case 'add':
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara mas')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						selfb.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
					case 'jagoan':
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
					case 'open':
					{
					    reply(`PUBLIC IN`)
						selfb.groupSettingChange(from, GroupSettingChange.messageSend, false)
					}
					break
					case 'close':
					{
					    reply(`ADMIN IN`)
						selfb.groupSettingChange(from, GroupSettingChange.messageSend, true)
					}
					break
					case 'linkgroup':
				case 'linkgrup':
				case 'linkgc':
				    linkgc = await selfb.groupInviteCode (from)
				    yeh = `https://chat.whatsapp.com/${linkgc}\n\nlink Group *${groupName}*`
				    selfb.sendMessage(from, yeh, text, {quoted: freply})
			        break
			case 'picture':
					var imgbb = require('imgbb-uploader')
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
					const encmediia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
					owgix = await selfb.downloadAndSaveMediaMessage(encmediia)
					data = await imgbb("acf1ad5f22ad5822dc163cce74aedfd4", owgix)
					toge = await getBuffer(`https://leyscoders-api.herokuapp.com/api/img/picture?url=${data.display_url}&apikey=freeKeY`)
					selfb.sendMessage(from, toge, image, {quoted: freply, caption: mess.success})
					} else {
					reply('Reply Gambar/Foto! ')
					}
					break
					case 'setpp':
									        selfb.updatePresence(from, Presence.composing) 
									    			if (!isQuotedImage) return reply(`Kirim gambar dengan caption ${prefix}setbotpp atau tag gambar yang sudah dikirim`)
									    					    enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
									    								media = await selfb.downloadAndSaveMediaMessage(enmedia)
									    										    await selfb.updateProfilePicture(botNumber, media)
									    													reply('Sukses update photo profile')
									    															    break 
					case 'toimg':
				case 'stickertoimg':
					if (!isQuotedSticker) return reply('Reply stickernya um')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
						buffer2 = fs.readFileSync(ran)
						selfb.sendMessage(from, buffer2, image, {quoted: freply, caption: 'Berhasil...'})
						fs.unlinkSync(ran)
					})
					break
               case 'block':
				 selfb.chatRead (from)
					selfb.blockUser (`${body.slice(7)}@c.us`, "add")
					selfb.sendMessage(from, `Tercatat Ke List 𝖉𝖊𝖆𝖙𝖍 𝖓𝖔𝖙𝖊 : ${body.slice(7)}@c.us`, text)
					break
					case 'listblock':
					teks = '_*BLOCK LIST!*_:\n'
					for (let block of blocked) {
						teks += `┣➢ @${block.split('@')[0]}\n`
					}
					teks += `𝐓𝐨𝐭𝐚𝐥 : ${blocked.length}`
					selfb.sendMessage(from, teks.trim(), extendedText, {quoted: freply, contextInfo: {"mentionedJid": blocked}})
					break
					case 'ttp':
                    if (args.length == 0) return reply(`Usage: ${prefix + command} query\nExample: ${prefix + command} LoL Human`)
                    txt = args.join(" ")
                    buffer3 = await getBuffer(`http://api.lolhuman.xyz/api/ttp?apikey=${lolkey}&text=${txt}`)
                    selfb.sendMessage(from, buffer3, sticker, { quoted: freply })
                    break
                    case 'semoji':  
       teks = emojiUnicode(gm).trim()
       anu = await getBuffer(`https://api.zeks.xyz/api/emoji-image?apikey=${vinz}&emoji=${teks}`) 
       reply(mess.wait)
       selfb.sendMessage(from, anu, sticker, {quoted:mek}) 
       break
                    case 'attp':
  if (args.length === 0) return selfb.sendMessage(from, 'Teks nya?', MessageType.text, {quoted: rio})
  let yosh = body.slice(6)
  let buffer = await getBuffer(`https://api.xteam.xyz/attp?file&text=${encodeURIComponent(yosh)}`)
  selfb.sendMessage(from, buffer, MessageType.sticker)
  break
					case 'tovid':
selfb.updatePresence(from,
  Presence.composing)
if (!isQuotedSticker) return reply(' Reply stikernya')
reply(mess.wait)
anumedia = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
anum = await selfb.downloadAndSaveMediaMessage(anumedia)
ran = getRandom('.webp')
exec(`ffmpeg -i ${anum} ${ran}`, (err) => {
  fs.unlinkSync(anum)
  if (err) return reply('Gagal, pada saat mengkonversi sticker ke Video')
  buffer = fs.readFileSync(ran)
  selfb.sendMessage(from, buffer, video, {
quoted: freply, caption: 'Buat apa sii..'
  })
  fs.unlinkSync(ran)
})
break
	       case 'addsticker':          
				if (!isQuotedSticker) return reply('Reply stiker nya')
				svst = body.slice(12)
				if (!svst) return reply('Nama sticker nya apa?')
				boij = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				delb = await selfb.downloadMediaMessage(boij)
				setiker.push(`${svst}`)
				fs.writeFileSync(`./src/sticker/${svst}.webp`, delb)
				fs.writeFileSync('./src/stik.json', JSON.stringify(setiker))
				selfb.sendMessage(from, `Sukses Menambahkan Sticker kedalam database\nSilahkan Cek dengan cara ${prefix}liststicker`, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }} }) 
				break
			case 'addvn':
				if (!isQuotedAudio) return reply('Reply vnnya blokk!')
				svst = body.slice(7)
				if (!svst) return reply('Nama audionya apa su?')
				boij = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				delb = await selfb.downloadMediaMessage(boij)
				audionye.push(`${svst}`)
				fs.writeFileSync(`./src/audio/${svst}.mp3`, delb)
				fs.writeFileSync('./src/audio.json', JSON.stringify(audionye))
				selfb.sendMessage(from, `Sukses Menambahkan Vn ke dalam database\nSilahkann Cek dengan cara ${prefix}listvn`, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }} }) 
				break
			case 'getvn':
			   if (args.length < 1) return reply('Masukan nama yang terdaftar di list vn')
				namastc = body.slice(7)
				buffer = fs.readFileSync(`./src/audio/${namastc}.mp3`)
				selfb.sendMessage(from, buffer, audio, { mimetype: 'audio/mp4',  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }}, ptt: true })
				break
			case 'getsticker':
			case 'gets':
			   if (args.length < 1) return reply('Masukan nama yang terdaftar di list sticker')
				namastc = body.slice(12)
				result = fs.readFileSync(`./src/sticker/${namastc}.webp`)
				selfb.sendMessage(from, result, sticker)
				break
           case 'liststicker':
				teks = '*Sticker List :*\n\n'
				for (let awokwkwk of setiker) {
					teks += `- ${awokwkwk}\n`
				}
				teks += `\n*Total : ${setiker.length}*`
				selfb.sendMessage(from, teks.trim(), extendedText, {  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }}, contextInfo: { "mentionedJid": setiker } })
				break
			case 'listvn':
			case 'vnlist':
				teks = '*List Vn:*\n\n'
				for (let awokwkwk of audionye) {
					teks += `- ${awokwkwk}\n`
				}
				teks += `\n*Total : ${audionye.length}*`
				selfb.sendMessage(from, teks.trim(), extendedText, {  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }}, contextInfo: { "mentionedJid": audionye } })
				break
			case 'addimage':
				if (!isQuotedImage) return reply('Reply imagenya blokk!')
				svst = body.slice(10)
				if (!svst) return reply('Nama imagenya apa su?')
				boij = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				delb = await selfb.downloadMediaMessage(boij)
				imagenye.push(`${svst}`)
				fs.writeFileSync(`./src/image/${svst}.jpeg`, delb)
				fs.writeFileSync('./src/image.json', JSON.stringify(imagenye))
				selfb.sendMessage(from, `Sukses Menambahkan image ke dalam database\nSilahkan cek dengan cara ${prefix}listimage`, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }} }) 
				await limitAdd(sender)
				break
			case 'getimage':
            case 'getimg':
			   if (args.length < 1) return reply('Masukan nama yang terdaftar di list image')
				namastc = body.slice(10)
				buffer = fs.readFileSync(`./src/image/${namastc}.jpeg`)
				selfb.sendMessage(from, buffer, image, {  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }}, caption: `Result From Database : ${namastc}.jpeg` })
				break
			case 'imagelist':
			case 'listimage':
				teks = '*List Image :*\n\n'
				for (let awokwkwk of imagenye) {
					teks += `- ${awokwkwk}\n`
				}
				teks += `\n*Total : ${imagenye.length}*`
				selfb.sendMessage(from, teks.trim(), extendedText, {  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }}, contextInfo: { "mentionedJid": imagenye } })
				break
			case 'addvideo':
				if (!isQuotedVideo) return reply('Reply videonya blokk!')
				svst = body.slice(10)
				if (!svst) return reply('Nama videonya apa su?')
				boij = JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo
				delb = await selfb.downloadMediaMessage(boij)
				videonye.push(`${svst}`)
				fs.writeFileSync(`./src/video/${svst}.mp4`, delb)
				fs.writeFileSync('./src/video.json', JSON.stringify(videonye))
				selfb.sendMessage(from, `Sukses Menambahkan Video\nCek dengan cara ${prefix}listvideo`, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }} }) 
				break
			case 'getvideo':
			   if (args.length < 1) return reply('Masukan nama yang terdaftar di list video')
				namastc = body.slice(10)
				buffer = fs.readFileSync(`./src/video/${namastc}.mp4`)
				selfb.sendMessage(from, buffer, video, { mimetype: 'video/mp4', quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }} }) 
				break
			case 'listvideo':
			case 'videolist':
				teks = '*List Video :*\n\n'
				for (let awokwkwk of videonye) {
					teks += `- ${awokwkwk}\n`
				}
				teks += `\n*Total : ${videonye.length}*`
				selfb.sendMessage(from, teks.trim(), extendedText, {  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }}, contextInfo: { "mentionedJid": videonye } })
				break
				break
				case 'img2url':
             var imgbb = require('imgbb-uploader')
            var encmedia  = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
            var media = await  selfb.downloadAndSaveMediaMessage(encmedia)
            
            imgbb('acf1ad5f22ad5822dc163cce74aedfd4', media)
                .then(data => {
                    var caps = `*╭─「 IMAGE TO URL 」*\n*├•  ID :* \`\`\`${data.id}\`\`\`\n*├•  MimeType :* \`\`\`${data.image.mime}\`\`\`\n*├•  Extension :* \`\`\`${data.image.extension}\`\`\`\n*╰─────‣*\n*URL :* \`\`\`${data.display_url}\`\`\``
                    ibb = fs.readFileSync(media)
                     selfb.sendMessage(from, ibb, image, { quoted: freply, caption: caps })
                })
                .catch(err => {
                    throw err
                })
            break  
					case 'run':
                sy = args.join(' ')
                return eval(sy)
                break
                case 'slink':
					if (args.length < 1) return reply('Textnya mana um?')
					ranp = getRandom('.jpg')
					rano = getRandom('.webp')
					teks = body.slice(7).trim()
					exec(`wget ${teks} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						selfb.sendMessage(from, buffer, sticker, {quoted: freply})
						fs.unlinkSync(rano)
					})
					break
					case 'blowjob':
					ranp = getRandom('.gif')
					rano = getRandom('.webp')
					anu = await fetchJson('https://tobz-api.herokuapp.com/api/ttp?text=${teks}&apikey=BotWeA', {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						selfb.sendMessage(from, buffer, sticker, {quoted: freply})
						fs.unlinkSync(rano)
					})
					break
					case 'stikel':
				const u = "Ig : @nfz.01"
				const b = "Eakkk"
				var teks = 'processing data, please wait'
				await createExif(a, b)
				await sleep(3000)
				await selfb.sendMessage(from, teks, MessageType.text)
				let op = "author: " + au + "\n"
				op += "pack: " + bp + "\n"
				op += "name: 𝐒𝐄𝐋𝐅𝐁𝐎𝐓"
				if (isMedia && !m.message.imageMessage || isQuotedVideo) {
					const decryptMedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					const mediaData = await selfb.downloadMediaMessage(decryptMedia)
					if (Buffer.byteLength(mediaData) >= 6186598.4) return selfb.sendMessage(from, `sizenya terlalu gede sayang, dd gakuat :( max 5,9mb`, MessageType.text)
					modifWebp(jam, mediaData).then(res => {
						selfb.sendMessage(from, res, MessageType.sticker, {
							contextInfo: {
								participant: "6285793432434@s.whatsapp.net",
								quotedMessage: {
									conversation: op
								}
							}
						})
					})
				} else if (isMedia && !m.message.videoMessage || isQuotedImage) {
					const decryptMedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
					let asu = (fs.readFileSync('./lib/image.jpg', {
						encoding: 'base64'
					}))
					const roundedCorners = Buffer.from(
						'<svg><rect x="0" y="0" width="600" height="600" rx="300" ry="300"/></svg>'
					);
					await selfb.downloadMediaMessage(decryptMedia).then(mediaData => {
						sharp(mediaData).resize({
							width: 600,
							height: 600
						}).composite([{
							input: roundedCorners,
							blend: 'dest-in'
						}]).webp().toBuffer().then(buffer => {
							modifExif(buffer, jam, (res) => {
								selfb.sendMessage(from, res, MessageType.sticker, {
									quoted: freply,
									thumbnail: asu.toString("base64")
								})
							})
						})
					})
				}
				break
          case 's': 
				case 'stiker':
				case 'sticker': 
				case 'sgif':
				case 'stikergif':
				case 'stickergif':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX')} ${ran} -o ${ran}`, async (error) => {
								if (error) return reply(mess.error.stick)
								selfb.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: freply })
								fs.unlinkSync(media)	
								fs.unlinkSync(ran)	
								})
								/*selfb.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: freply})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						wew = `❮⏳❯  \`\`\`Please Wait! \`\`\``
					selfb.sendMessage(from, wew, text, { quoted: freply })
							await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX')} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.error.stick)
									selfb.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: freply })
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)
							})
								/*selfb.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: freply})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						wew = `❮⏳❯  \`\`\`Please Wait! \`\`\``
					selfb.sendMessage(from, wew, text, { quoted: freply })
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
							if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX')} ${ranw} -o ${ranw}`, async (error) => {
								selfb.sendMessage(from, fs.readFileSync(ranw), sticker, { quoted: freply })
								fs.unlinkSync(ranw)
								})
								//selfb.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: freply})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								selfb.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: freply})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break      
            case 'wm':
            case 'take':
					if ((isMedia && !mek.message.videoMessage || isQuotedSticker) && args.length == 0) {
						const encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX')} ${ran} -o ${ran}`, async (error) => {
								if (error) return reply(mess.error.stick)
								selfb.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: freply })
								fs.unlinkSync(media)	
								fs.unlinkSync(ran)	
								})
								/*selfb.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: freply})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						wew = `❮⏳❯  \`\`\`Please Wait! \`\`\``
					selfb.sendMessage(from, wew, text, { quoted: freply })
							await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
							console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX')} ${ran} -o ${ran}`, async (error) => {
									if (error) return reply(mess.error.stick)
									selfb.sendMessage(from, fs.readFileSync(ran), sticker, { quoted: freply })
									fs.unlinkSync(media)	
									fs.unlinkSync(ran)
							})
								/*selfb.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: freply})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)*/
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedSticker) && args[0] == 'nobg') {
						const encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						wew = `❮⏳❯  \`\`\`Please Wait! \`\`\``
					selfb.sendMessage(from, wew, text, { quoted: freply })
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
							if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								exec(`webpmux -set exif ${addMetadata('@SelfBot-TermuX')} ${ranw} -o ${ranw}`, async (error) => {
								selfb.sendMessage(from, fs.readFileSync(ranw), sticker, { quoted: freply })
								fs.unlinkSync(ranw)
								})
								//selfb.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: freply})
							})
						})
					/*} else if ((isMedia || isQuotedSticker) && colors.includes(args[0])) {
						const encmedia = isQuotedSticker ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await selfb.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								selfb.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: freply})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
					case 'tts':
					if (args.length < 1) return selfb.sendMessage(from, 'Kode bahasanya mana om?', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return selfb.sendMessage(from, 'Textnya mana om', text, {quoted: mek})
					dtt = body.slice(8)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 600
					? reply('Textnya kebanyakan om')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							bufferg = fs.readFileSync(rano)
							if (err) return reply('Gagal om:(')
							selfb.sendMessage(from, bufferg, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
			    case 'tobug':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} ar 48000 -vn -c:a libopus ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true, quoted: freply,duration:99999999999999999999999})
						fs.unlinkSync(ran)
					   })
				       break 
				case 'slow':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=0.7,asetrate=44100" ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true,  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } } })
						fs.unlinkSync(ran)
					    })
				        break
				case 'tupai':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=0.5,asetrate=65100" ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true,  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } } })
						fs.unlinkSync(ran)
					    })
				       break
				case 'blub':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=0.9,asetrate=95100" ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true,  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } } })
						fs.unlinkSync(ran)
					    })
				        break
				case 'gemuk':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=22100" ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true,  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } } })
						fs.unlinkSync(ran)
					    })
				        break
				case 'ghost':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -filter:a "atempo=1.6,asetrate=3486" ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true, quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JStw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} }} })
						fs.unlinkSync(ran)
					    })
				       break
		       case 'bass':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} -af equalizer=f=64:width_type=o:width=2:g=56 ${ran}`, (err, stderr, stdout) => {
						fs.unlinkSync(media)
						if (err) return reply('Error!')
						hah = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true,  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } } })
						fs.unlinkSync(ran)
					   })
				       break
	             case 'toptt':
	                 if (!isQuotedAudio) return reply('Reply audio nya om')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp3')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal mengkonversi audio ke ptt')
						topt = fs.readFileSync(ran)
						selfb.sendMessage(from, hah, audio, {mimetype: 'audio/mp4', ptt:true,  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } } })
						})
					    break
					case 'tomp3':
					reply('Tunggu bro, mungkin lama') 
                	selfb.updatePresence(from, Presence.composing) 
					if (!isQuotedVideo) return reply('_*Reply Video nya Baka!*_')
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await selfb.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.mp4')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('Gagal, pada saat mengkonversi video ke mp3')
						bufferlkj = fs.readFileSync(ran)
						selfb.sendMessage(from, bufferlkj, audio, {mimetype: 'audio/mp4',  quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": "𝐒𝐄𝐋𝐅 𝐁𝐎𝐓 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩", "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('image/mek.jpeg')} } }, ptt:true})
						fs.unlinkSync(ran)
					})
					break
		case 'kisahnabi':
			data = await fetchJson(`https://leyscoders-api.herokuapp.com/api/nabi?q=${body.slice(11)}&apikey=${apikey}`)
			hepik = data.result
			bismillah = await getBuffer(data.result.image)
		    teks = `➸ *Nama*: ${hepik.nabi}\n➸ *Lahir*: ${hepik.lahir}\n➸ *Umur:* ${hepik.umur}\n➸ *Tempat*: ${hepik.tempat}\n➸ *Kisah*: \n\n${hepik.kisah}`
			selfb.sendMessage(from, bismillah, image, {quoted: freply, caption: teks})
			break
				case 'setprefix':
					if (args.length < 1) return
					prefix = args[0]
					setting.prefix = prefix
					fs.writeFileSync('./src/settings.json', JSON.stringify(setting, null, '\t'))
					reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
					break
				
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()

