 module.exports.config = {
	name: "teach",
	version: "0.0.1-beta",
	hasPermssion: 0,
	credits: "MewMew",
	description: "Dạy bot (dùng cho lệnh sim)",
	commandCategory: "Chatbot",
	usages: "teach [In] => [Out]",
	cooldowns: 5,
	dependencies: ["axios"],
	info: [
		{
			key: 'In',
			prompt: 'Câu đầu vào',
			type: 'Văn Bản',
			example: 'Chào SpermLord'
		},
		{
			key: 'Out',
			prompt: 'Câu đầu ra',
			type: 'Văn Bản',
			example: 'Chào cái baise ta mère'
		}
	]
};

module.exports.run = async function({ api, event, args }) {
	let res = await require("axios")("https://simsimi.miraiproject.tk/teach", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		data: { teach: args.join(" ") }
	})
	let data = await res.data.success;
	api.sendMessage(`${data}`, event.threadID, event.messageID)
}
