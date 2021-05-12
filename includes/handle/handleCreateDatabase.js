module.exports = function({ global, Users, Threads, Currencies, client }) {
	const logger = require("../../utils/log.js");
	return async function({ event }) {

		try {
			if (global.config.autoCreateDB == false || client.inProcess == true) return
			var { senderID, threadID } = event;
			senderID = senderID.toString();
			threadID = threadID.toString();
			var settings = {};

			if (!client.allThread.includes(threadID) && event.isGroup == true) {
				try {	
					client.inProcess = true;
					await Threads.createData(threadID, { settings });
					client.allThread.push(threadID);
					logger(`New Thread: ${threadID}`, "[ DATABASE ]")
					client.inProcess = false;
				}
				catch {
					client.inProcess = false;
					logger("Không thể ghi nhóm có ID " + threadID + " vào database!", "[ DATABASE ]");
				}
			}

			if (!client.allUser.includes(senderID)) {
				try {
					client.inProcess = true;
					await Users.createData(senderID, { name: "" });
					logger(`New User: ${senderID}`, "[ DATABASE ]")
					await Currencies.createData(senderID);
					client.allUser.push(parseInt(senderID));
					logger(`New Currency: ${senderID}`, "[ DATABASE ]")
					client.inProcess = false;
				}
				catch {
					client.inProcess = false;
					logger("Không thể ghi người dùng có ID " + senderID + " vào database!", "[ DATABASE ]");
				}
			}
			return;
		}
		catch(e) {
			console.log(e);
		}
	}
}