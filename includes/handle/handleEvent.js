const logger = require("../../utils/log.js");

module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		for (let [key, value] of client.events.entries()) {
			if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
				const eventRun = client.events.get(key);
				try {
					eventRun.run({ api, event, client, __GLOBAL });
				} catch (error) {
					logger(error + " at event: " + eventRun.config.name , 2);
				}
				return;
			};
		}
	}
}