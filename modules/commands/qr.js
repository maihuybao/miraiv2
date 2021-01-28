module.exports.config = {
	name: "qr",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Thọ",
	description: "Mã hoá văn bản bằng mã QR",
	commandCategory: "General",
	usages: "qr [text]",
	cooldowns: 5,
	dependencies: ["request","qrcode"]
};

module.exports.run = async function({ api, event, args }) {
	const { createReadStream, unlinkSync } = require("fs-extra")
	const text = args.join(" ")
	if(!text) return api.sendMessage("Nhập những thứ bạn muốn thêm vào mã qr",event.threadID);
	var opt = { errorCorrectionLevel: 'H', type: 'image/png', quality: 0.3, scale: 50, margin: 1, color:{ dark: '#000000', light: '#ffffff' } };
	 api.sendTypingIndicator(event.threadID, () => require('qrcode').toFile(__dirname + '/cache/qr.png', text, opt, (err) => {
		if (err) return err;
		api.sendMessage({
			attachment: createReadStream(__dirname + '/cache/qr.png')
		},event.threadID, () => unlinkSync(__dirname + '/cache/qr.png'), event.messageID);
	}))
}
