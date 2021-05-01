

module.exports = function({ api, __GLOBAL, client, models, Users, Threads, Currencies }) {
	const logger = require("../../utils/log.js");
	return async function({ event }) {
		const timeStart = Date.now();
		var { senderID, threadID } = event;
		senderID = parseInt(senderID);
		threadID = parseInt(threadID);
		if (client.userBanned.has(senderID) || client.threadBanned.has(threadID) || __GLOBAL.settings.allowInbox == false && senderID == threadID) return;
		for (const [key, value] of client.events.entries()) {
			if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
				const eventRun = client.events.get(key);
				try {
					await eventRun.run({ api,event, __GLOBAL, client, models, Users, Threads, Currencies });
					if (__GLOBAL.settings.DeveloperMode == true) {
						const moment = require("moment");
						const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss L");
						logger(`[ ${time} ] Event Executed: ${eventRun.config.name} | Group: ${threadID} | Process Time: ${(Date.now()) - timeStart}ms`, "[ DEV MODE ]");
					}
				}
				catch (error) {
					logger(JSON.stringify(error) + " at event: " + eventRun.config.name , "error");
				}
			};
		}
		return;
	}
}