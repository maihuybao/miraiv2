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

module.exports.handleReaction = async function({ api, event, client, __GLOBAL, handleReaction }) {
	let events = client.events.get("joinEvents");
	let json = {
		logMessageData: {
			addedParticipants: [
				{
					userFbId: api.getCurrentUserID()
				}
			]
		},
		threadID: handleReaction.pending
	}
	await events.run({ event: json, client, __GLOBAL, api });
	return api.sendMessage('Đã duyệt thành công nhóm có ID: ' + handleReaction.pending, event.threadID);
}

module.exports.run = async function({ api, event, client }) {
	let spam = await api.getThreadList(100, null, ["SPAM", "unsend"]);
	let pending = await api.getThreadList(100, null, ["PENDING", "unsend"]);
	let list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
	return api.sendMessage(`Đang có tổng: ${list.length} nhóm đang trong tin nhắn chờ cần bạn duyệt, hãy reactions tin nhắn bên dưới để duyệt!`, event.threadID, () => {
		for (groupInfo of list) {
			api.sendMessage('Tên nhóm: ' + any.name + '\nID: ' + any.threadID, event.threadID, (error, info) => {
				client.handleReaction.push({
					name: "pending",
					messageID: info.messageID,
					author: event.senderID,
					pending: any.threadID
				})
			})
	
		}
	}, event.messageID);
	
}