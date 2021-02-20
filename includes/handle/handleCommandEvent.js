const logger = require("../../utils/log.js");

module.exports = function({ api, __GLOBAL, client, models, Users, Threads, Currencies, utils }) {
	return async function({ event }) {
		if (client.userBanned.has(event.senderID) || client.threadBanned.has(event.threadID) || __GLOBAL.settings.allowInbox == true && event.senderID == event.threadID) return;
		let commands = client.commands.values();
		for (const command of commands) {
			if (command.event) {
				try {
					command.event({ event, api, __GLOBAL, client, models, Users, Threads, Currencies, utils });
				}
				catch (error) {
					logger(error + " at event command: " + command.config.name , 2);
				}
			}
		}
	}
}