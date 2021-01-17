module.exports.config = {
	name: "unsend",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord",
	description: "Gỡ tin nhắn của bot",
	commandCategory: "System",
	usages: "unsend",
	cooldowns: 0,
	info: [
		{
			key: 'unsend',
			prompt: 'Reply tin nhắn cần gỡ bỏ',
			type: 'Văn Bản',
			example: 'unsend'
		}
	]
};

module.exports.run = function({ api, event }) {
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage('Không thể gỡ tin nhắn của người khác.', event.threadID, event.messageID);
	if (event.type != "message_reply") return api.sendMessage('Hãy reply tin nhắn cần gỡ.', event.threadID, event.messageID);
	return api.unsendMessage(event.messageReply.messageID);
}