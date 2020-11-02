module.exports.config = {
	name: "say",
	aliases: [],
	usage: "",
	commandCategory: "system"
};


module.exports.run = (api, event, args) => {
	const request = require("request");
	const fs = require("fs");
	var callback = () => api.sendMessage({body: "", attachment: fs.createReadStream(__dirname + "/cache/say.mp3")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/say.mp3"));
	return request(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args)}&tl=vi&client=tw-ob`).pipe(fs.createWriteStream(__dirname+'/cache/say.mp3')).on('close',() => callback());

}