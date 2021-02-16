module.exports.config = {
	name: "pending",
	version: "1.0.2",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý tin nhắn chờ của bot",
	commandCategory: "System",
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

module.exports.run = function({ api, event, clientL }) {
	api.getThreadList(100, null, ["PENDING", "OTHER", "unread"], (err, list) => {
		api.sendMessage(`Đang có tổng: ${list.length} nhóm đang trong tin nhắn chờ cần bạn duyệt, hãy reactions tin nhắn bên dưới để duyệt!`, event.threadID, event.messageID);
		list.forEach((infoPending) => {
			if (!infoPending.isGroup || infoPending.isSubscribed == false) return api.deleteThread(infoPending.threadID);
			api.sendMessage(
			'Tên nhóm: ' + infoPending.name +
			'\nID: ' + infoPending.threadID
			, event.threadID, (error, info) => {
				client.handleReaction.push({
					name: "pending",
					messageID: info.messageID,
					author: event.senderID,
					pending: infoPending.threadID
				})
			})
		})
	})
}