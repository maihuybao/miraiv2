module.exports.config = {
	name: "sim",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Trò chuyện cùng con sim mất dạy nhất quả đất",
	commandCategory: "Chatbot",
	usages: "sim [Text]",
	cooldowns: 5,
	dependencies: ["axios"],
	info: [
		{
			key: "Text",
			prompt: "Lời muốn nói chuyện với em ấy",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
	const axios = require("axios");
	var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	if (!args.join(" ")) return out("Bạn chưa nhập tin nhắn");
	return axios.get(`https://simsimi.miraiproject.tk/api/sim?apikey=3EF9F60D383F4F7DD52D157EE5AAAA3ACC42D182&ask=${encodeURIComponent(args.join(" "))}`).then(res => (res.data.success == false) ? out(res.data.error) : out(res.data.msg));
}
