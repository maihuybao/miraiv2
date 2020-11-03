module.exports.config = {
	name: "say",
	description: "Điều khiển bot biến văn bản thành giọng đọc",
	commandCategory: "general",
	args: [
		{
			key: 'text',
			prompt: `Phần text bạn muốn bot nói.`,
			type: 'string',
			default: 'Mirai-Chan xin chào cả nhà'
		}
	]
};


module.exports.run = function(api, event, args) {
	const request = require("request");
	const fs = require("fs");
	var callback = () => api.sendMessage({body: "", attachment: fs.createReadStream(__dirname + "/cache/say.mp3")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/say.mp3"));
	return request(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args.join(" "))}&tl=vi&client=tw-ob`).pipe(fs.createWriteStream(__dirname+'/cache/say.mp3')).on('close',() => callback());

}