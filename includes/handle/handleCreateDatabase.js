const logger = require("../../utils/log.js");

module.exports = function({ __GLOBAL, api, User, Thread, Currency }) {
	return async function({ event }) {
		if (__GLOBAL.settings.autoCreateDB == false) return;
		let { senderID, threadID } = event;
		var settings = {};

		if ((await Thread.getData(threadID)) == null) {
			let name = (await api.getThreadInfo(threadID)).name;
			await Thread.createData({ threadID, defaults: { name, settings } });
			logger(`New Thread: ${threadID}`, "[ DATABASE ]")
		}
		if ((await User.getData(senderID)) == null) {
			let name = (await api.getUserInfo(senderID))[senderID].name;
			await User.createData({ userID: senderID, defaults: { name } });
			logger(`New User: ${senderID}`, "[ DATABASE ]")
		}
		if ((await Currency.getData(userID = senderID)) == null) {
			await Currency.createData({ userID: senderID, defaults: { money: 0 } });
			logger(`New Currency: ${senderID}`, "[ DATABASE ]")
		}
	}
}