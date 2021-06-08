module.exports = function({ api, models, Users, Threads, Currencies }) {
	const logger = require("../../utils/log.js");

	return function({ event }) {
		const timeStart = Date.now();

		const { userBanned, threadBanned } = global.data;
		const { events } = global.client;
		const { allowInbox, DeveloperMode } = global.config;

		var { senderID, threadID } = event;
		
		senderID = parseInt(senderID);
		threadID = parseInt(threadID);

		if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == false && senderID == threadID) return;
		for (const [key, value] of events.entries()) {
			if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
				const eventRun = events.get(key);
				try {
					eventRun.run({ api, event, models, Users, Threads, Currencies });
					if (DeveloperMode == true) {
						const moment = require("moment");
						const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
						logger(`[ ${time} ] Event Executed: ${eventRun.config.name} | Group: ${threadID} | Process Time: ${(Date.now()) - timeStart}ms`, "[ DEV MODE ]");
					}
				}
				catch (error) {
					logger(JSON.stringify(error) + " at event: " + eventRun.config.name , "error");
				}
			}
		}
		return;
	};
};