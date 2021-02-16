const logger = require("../../utils/log.js");

module.exports = function({ __GLOBAL, api, Users, Threads, Currencies }) {
	return async function({ event }) {
		if (__GLOBAL.settings.autoCreateDB == false) return;
		let { senderID, threadID } = event;
		var settings = {};

		if (!(await Threads.getData(threadID))) {
			let name = (await api.getThreadInfo(threadID)).name;
			await Threads.createData(threadID, { name, settings });
			logger(`New Thread: ${threadID}`, "[ DATABASE ]")
		}
		if (!(await Users.getData(senderID)) ) {
			let name = (await api.getUserInfo(senderID))[senderID].name;
			await Users.createData(senderID, { name });
			logger(`New User: ${senderID}`, "[ DATABASE ]")
		}
		if (!(await Currencies.getData(senderID))) {
			await Currencies.createData(senderID);
			logger(`New Currency: ${senderID}`, "[ DATABASE ]")
		}
	}
} 