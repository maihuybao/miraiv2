module.exports = function({ __GLOBAL, api, Users, Threads, Currencies, client }) {
	const logger = require("../../utils/log.js");
	return async function(event) {
		try {

			if (__GLOBAL.settings.autoCreateDB == false || client.inProcess == true) return;
			const { senderID, threadID } = event;
			var settings = {};

			if (!client.allThread.includes(parseInt(threadID))) {
				client.inProcess = true;
				await Threads.createData(threadID, { name: threadInfo.name, settings });
				client.allThread.push(parseInt(threadID));
				logger(`New Thread: ${threadID}`, "[ DATABASE ]")
				client.inProcess = false;
			}

			if (!client.allUser.includes(parseInt(senderID))) {
				client.inProcess = true;
				const name = (await api.getUserInfo(senderID))[senderID].name;
				await Users.createData(senderID, { name });
				logger(`New User: ${senderID}`, "[ DATABASE ]")
				await Currencies.createData(senderID);
				client.allUser.push(parseInt(senderID));
				logger(`New Currency: ${senderID}`, "[ DATABASE ]")
				client.inProcess = false;
			}
			return;
		}
		catch(e) {
			console.log(e);
		}
	}
}