module.exports = function({ api, global, client, models, Users, Threads, Currencies, utils }) {
	const logger = require("../../utils/log.js");
	return function({ event }) {
		const { senderID, threadID } = event;

		if (client.userBanned.has(parseInt(senderID)) || client.threadBanned.has(parseInt(threadID)) || global.config.allowInbox == true && senderID == threadID) return;
		const commands = client.commandRegister.get("event") || [];
		for (const command of commands) {
			const commandModule = client.commands.get(command);
			try {
				commandModule.event({ event, api, global, client, models, Users, Threads, Currencies, utils });
			}
			catch (error) {
				logger(error + " at event command: " + commandModule.config.name , "error");
			}
		}
	};
};