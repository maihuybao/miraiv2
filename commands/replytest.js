module.exports.config = {
	name: "reply",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "say bla bla ở đây",
	commandCategory: "group",
	usages: "name Text1 Text2",
	cooldowns: 5
};

module.exports.handleReaction = function({ api, event, args, client, __GLOBAL }) {
	return api.sendMessage("fuck you, im passed, im ok", event.threadID, event.messageID);
}

module.exports.handleReply = function({ api, event, args, client, __GLOBAL }) {
	return api.sendMessage("fuck you, im passed, try reaction thiz", event.threadID, (error, info) => {
		client.handleReaction.push({
			name: "reply",
			messageID: info.messageID,
			author: event.senderID
		})
	})
}

module.exports.run = function({ api, event, args, client, __GLOBAL }) {
	return api.sendMessage("try reply thiz!", event.threadID, (error, info) => {
		client.handleReply.push({
			name: "reply",
			messageID: info.messageID,
			author: event.senderID
		})
	})
}