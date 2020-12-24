const logger = require("../../utils/log.js");

module.exports = function({ api, __GLOBAL, client, models, User, Thread, Currency }) {
	return async function({ event }) {
		if (client.userBanned.has(event.senderID) || client.threadBanned.has(event.threadID)) return;
		for (let [key, value] of client.events.entries()) {
			if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
				const eventRun = client.events.get(key);
				try {
					if (__GLOBAL.settings.DEVELOP_MODE == "on") logger(`Event Executed: ${eventRun.config.name} | Type Event: ${event.logMessageType} | Group: ${event.threadID}`, "[ DEV MODE ]")
					eventRun.run({ api, __GLOBAL, client, models, User, Thread, Currency });
				}
				catch (error) {
					logger(error + " at event: " + eventRun.config.name , 2);
				}
				return;
			};
		}
	}
}