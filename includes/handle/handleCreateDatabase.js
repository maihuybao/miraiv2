module.exports = function({ __GLOBAL, api, Users, Threads, Currencies, client }) {
	const logger = require("../../utils/log.js");
	return async function({ event }) {
		try {

			if (__GLOBAL.settings.autoCreateDB == false) return;
			const { senderID, threadID } = event;
			var settings = {};

			if (!client.allThread.includes(parseInt(threadID))) {
				const threadInfo = await api.getThreadInfo(threadID);
				await Threads.createData(threadID, { name: threadInfo.name, settings, threadInfo });
				client.allThread.push(parseInt(threadID));
				logger(`New Thread: ${threadID}`, "[ DATABASE ]")
			}

			if (!client.allUser.includes(parseInt(senderID))) {
				const name = (await api.getUserInfo(senderID))[senderID].name;
				await Users.createData(senderID, { name });
				logger(`New User: ${senderID}`, "[ DATABASE ]")
				await Currencies.createData(senderID);
				client.allUser.push(parseInt(senderID));
				logger(`New Currency: ${senderID}`, "[ DATABASE ]")
			}
			return;
		}

		catch(e) {
			console.log(e);
		}
	}
}