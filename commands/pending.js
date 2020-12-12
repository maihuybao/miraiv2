module.exports.config = {
	name: "pending",
	version: "pending",
	credits: "CatalizCS",
	hasPermssion: 2,
	description: "Quản lý tin nhắn chờ của bot",
	commandCategory: "system",
	usages: "pending",
	cooldowns: 5
};

module.exports.handleReaction = function({ api, event, args, client, __GLOBAL, handleReaction }) {
	let setEvent = {
		type: 'event',
		logMessageType: 'log:subscribe',
		logMessageData: {
			addedParticipants: [
				{
					userFbId: api.getCurrentUserID()
				}
			]
		},
		threadID: handleReaction.pending
	}
	api.sendMessage('Box của bạn đã được duyệt!', handleReaction.pending);
	api.sendMessage(' Đã duyệt thành công nhóm có ID: ' + handleReaction.pending, event.threadID);
	return require("../includes/listen")({ api, __GLOBAL })(undefined, setEvent);
}

module.exports.run = function({ api, event, args, client, __GLOBAL }) {
	api.getThreadList(10, null, ["PENDING"], (err, list) => {
		api.sendMessage(`Đang có tổng: ${list.length} nhóm đang trong tin nhắn chờ cần bạn duyệt, hãy reactions tin nhắn bên dưới để duyệt!`, event.threadID, event.messageID);
		list.forEach((infoPending) => {
			if (infoPending.isGroup !== true) return;
			api.sendMessage(
			'Tên nhóm: ' + infoPending.name +
			'\nID: ' + infoPending.threadID
			, event.threadID, (error, info) => {
				client.handleReaction.push({
					name: "checkpending",
					messageID: info.messageID,
					author: event.senderID,
					pending: infoPending.threadID
				})
			})
		})
	})
}