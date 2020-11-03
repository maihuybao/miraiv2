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
	var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
	var languageToSay = (["ru","en","ko","ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : 'vi';
	var msg = (languageToSay != 'vi') ? content.slice(3, content.length) : content;
	return request(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`).pipe(fs.createWriteStream(__dirname+'/cache/say.mp3')).on('close',() => api.sendMessage({body: "", attachment: fs.createReadStream(__dirname + "/cache/say.mp3")}, threadID, () => fs.unlinkSync(__dirname + "/cache/say.mp3")));
}