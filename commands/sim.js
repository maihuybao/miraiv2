module.exports.config = {
	name: "sim",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Trò chuyện cùng con sim mất dạy nhất quả đất",
	commandCategory: "general",
	usages: "sim [Text]",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "Lời muốn nói chuyện với em ấy",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async (api, event, args) => {
	const request = require("request");
	return request(`http://195.201.173.201:26880/sim/${encodeURIComponent(args.join(" "))}`, (err, response, body) => api.sendMessage(`${body}`, event.threadID, event.messageID));
}