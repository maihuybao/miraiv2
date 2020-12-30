const logger = require("../../utils/log.js");

module.exports = function({ __GLOBAL, User, Thread, Currency, models }) {
	if (__GLOBAL.settings.autoCreateDB == false) return;
	return async function({ event }) {

		let { senderID, threadID } = event;
		var settings = {};
		var otherInfo = {};

		if ((await Thread.getData(threadID)) == null) {
			await Thread.createData({ threadID, defaults: { settings, otherInfo } });
			logger(`New Thread: ${threadID}`, "[ DATABASE ]")
		}
		if ((await User.getData(senderID)) == null) {
			await User.createData({ userID: senderID, defaults: { otherInfo } });
			logger(`New User: ${senderID}`, "[ DATABASE ]")
		}
		if ((await Currency.getData({threadID, userID: senderID})) == null) {
			await Currency.createData({ threadID, userID: senderID, defaults: { otherInfo } });
		}
	}
}