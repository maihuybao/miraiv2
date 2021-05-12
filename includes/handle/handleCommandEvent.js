module.exports = function({ api, global, client, models, Users, Threads, Currencies, utils }) {
	const logger = require("../../utils/log.js");
	return async function({ event }) {
		var { senderID, threadID } = event;
		senderID = senderID.toString();
		threadID = threadID.toString();
		if (client.userBanned.has(senderID) || client.threadBanned.has(threadID) || global.config.allowInbox == true && senderID == threadID) return;
		const commands = client.commandRegister.get("event") || [];
		for (const command of commands) {
			const commandModule = client.commands.get(command);
			try {
				await commandModule.event({ event, api, global, client, models, Users, Threads, Currencies, utils });
			}
			catch (error) {
				logger(error + " at event command: " + commandModule.config.name , "error");
			}
		}
	}
}