const logger = require("../../utils/log.js");

module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		if (client.userBanned.has(event.senderID) || client.threadBanned.has(event.threadID)) return;
		for (let [key, value] of client.commands.entries()) {
			const eventLoop = client.events.get(key);
			if (!eventLoop.eventLoop) return;
			try {
				eventLoop.eventLoop({ api, event, client, __GLOBAL });
			}
			catch (error) {
				logger(error + " at eventLoop: " + eventLoop.config.name , 2);
			}
			return;
		}
	}
}