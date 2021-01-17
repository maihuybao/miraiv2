const logger = require("../../utils/log.js");
const thread = require("../controllers/thread.js");

module.exports = function({ __GLOBAL, User, Thread, Currency }) {
	return async function({ event }) {

		if (__GLOBAL.settings.autoCreateDB == false) return;

		let { senderID, threadID } = event;
		senderID = parseInt(senderID);
		threadID = parseInt(threadID);
		var settings = {};
		var otherInfo = {};

		if (!(await Thread.getData(threadID))) {
			await Thread.createData({ threadID, defaults: { settings, otherInfo } });
			logger(`New Thread: ${threadID}`, "[ DATABASE ]")
		}
		if (!(await User.getData(senderID))) {
			await User.createData({ userID: senderID, defaults: { otherInfo } });
			logger(`New User: ${senderID}`, "[ DATABASE ]")
		}
		if (!(await Currency.getData(userID = senderID))) {
			await Currency.createData({ userID: senderID, defaults: { otherInfo } });
			logger(`New Currency: ${senderID}`, "[ DATABASE ]")
		}
	}
}