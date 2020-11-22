module.exports.config = {
	name: "rerun",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Chạy lại lệnh qua events",
	commandCategory: "system",
	usages: "rerun",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args, __GLOBAL }) => {
	if (event.type != "message_reply") return api.sendMessage("Phản hồi tin nhắn cần chạy lại", event.threadID, event.messageID);
	let setEvent = {
		type: 'message',
		senderID: event.senderID,
		body: event.messageReply.body,
		threadID: event.threadID,
		messageID: event.messageID,
	}
	return require("../includes/listen")({ api, __GLOBAL })(undefined, setEvent);
}
