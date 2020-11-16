module.exports.config = {
	name: "rerun",
	version: "1.0.0",
	hasPermssion: 3,
	credits: "CatalizCS",
	description: "Chạy lại lệnh qua events",
	commandCategory: "system",
	usages: "rerun",
	cooldowns: 5,
	info: []
};

module.exports.run = async ({ api, event, args, __GLOBAL }) => {
	if (event.type != "message_reply") return api.sendMessage("Phản hồi tin nhắn cần gỡ", event.threadID, event.messageID);
	let eventCallback = {
		type: "message",
		senderID: event.senderID,
		threadID: event.threadID,
		messageID: event.messageReply.messageID,
		body: event.messageReply.body
	}
	return require("../includes/listen")({ eventCallBack });
}
