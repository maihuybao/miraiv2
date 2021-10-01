module.exports.config = {
	name: "pending",
	version: "1.0.2",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý tin nhắn chờ của bot",
	commandCategory: "system",
	usages: "pending",
	cooldowns: 5
};

module.exports.handleReaction = async function({ api, event, handleReaction }) {
	if (event.userID != handleReaction.author) return;
	api.sendMessage("Testing...", handleReaction.pending);
	return api.sendMessage('Đã duyệt thành công nhóm có ID: ' + handleReaction.pending, event.threadID);
}

module.exports.run = async function({ api, event, client }) {
	try {
		var spam = await api.getThreadList(100, null, ["SPAM"]);
		var pending = await api.getThreadList(100, null, ["PENDING"]);
	}
	catch (e) {
		console.log(e)
	}
	let list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup == true);
	return api.sendMessage(`Đang có tổng: ${list.length} nhóm đang trong tin nhắn chờ cần bạn duyệt, hãy reactions tin nhắn bên dưới để duyệt!`, event.threadID, () => {
		for (groupInfo of list) {
			api.sendMessage('Tên nhóm: ' + groupInfo.name + '\nID: ' + groupInfo.threadID, event.threadID, (error, info) => {
				client.handleReaction.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					pending: groupInfo.threadID
				})
			})
	
		}
	}, event.messageID);
	
}