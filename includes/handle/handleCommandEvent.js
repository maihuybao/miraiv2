module.exports = function({ api, models, Users, Threads, Currencies }) {
	const logger = require("../../utils/log.js");

	return function({ event }) {

		const { allowInbox } = global.config;
		const { userBanned, threadBanned } = global.data;
		const { commands, eventRegistered } = global.client;

		var { senderID, threadID } = event;

		senderID = parseInt(senderID);
		threadID = parseInt(threadID);

		if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == true && senderID == threadID) return;

		for (const commandName of eventRegistered) {
			const commandModule = commands.get(commandName);
			try {
				if (commandModule) commandModule.handleEvent({ event, api, models, Users, Threads, Currencies });
			}
			catch (error) {
				logger(error + " at event command: " + commandModule.config.name , "error");
			}
		}
	};
};