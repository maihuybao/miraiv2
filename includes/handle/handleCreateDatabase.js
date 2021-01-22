const logger = require("../../utils/log.js");

module.exports = function({ __GLOBAL, api, Users, Threads, Currencies }) {
	return async function({ event }) {
		if (__GLOBAL.settings.autoCreateDB == false) return;
		let { senderID, threadID } = event;
		var settings = {};

		if ((await Threads.getData(threadID)) == null) {
			let name = (await api.getThreadInfo(threadID)).name;
			await Threads.createData({ threadID, defaults: { name, settings } });
			logger(`New Thread: ${threadID}`, "[ DATABASE ]")
		}
		if ((await Users.getData(senderID)) == null) {
			let name = (await api.getUserInfo(senderID))[senderID].name;
			await Users.createData({ userID: senderID, defaults: { name } });
			logger(`New User: ${senderID}`, "[ DATABASE ]")
		}
		if ((await Currencies.getData(userID = senderID)) == null) {
			await Currencies.createData({ userID: senderID, defaults: { money: 0 } });
			logger(`New Currency: ${senderID}`, "[ DATABASE ]")
		}
	}
}