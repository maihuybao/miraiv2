module.exports = function({ global, Users, Threads, Currencies, client }) {
	const logger = require("../../utils/log.js");
	return async function({ event }) {

		try {
			if (global.config.autoCreateDB == false || client.inProcess == true) return;
			const { senderID, threadID } = event;
			var settings = {};

			if (!client.allThread.includes(parseInt(threadID)) && event.isGroup == true) {
				try {	
					client.inProcess = true;
					await Threads.createData(threadID, { settings });
					client.allThread.push(parseInt(threadID));
					logger(`New Thread: ${threadID}`, "[ DATABASE ]");
					client.inProcess = false;
				}
				catch {
					client.inProcess = false;
					logger("Không thể ghi nhóm có ID " + threadID + " vào database!", "[ DATABASE ]");
				}
			}

			//////////////////////////////////////
			//========= Check userInfo =========//
			//////////////////////////////////////

			if (!client.allUser.includes(parseInt(senderID))) {
				try {
					client.inProcess = true;
					await Users.createData(senderID, { name: "" });
					logger(`New User: ${senderID}`, "[ DATABASE ]");
					await Currencies.createData(senderID);
					client.allUser.push(parseInt(senderID));
					logger(`New Currency: ${senderID}`, "[ DATABASE ]");
					client.inProcess = false;
				}
				catch {
					client.inProcess = false;
					logger("Không thể ghi người dùng có ID " + senderID + " vào database!", "[ DATABASE ]");
				}
			}

			if (!client.nameUser.has(parseInt(senderID)) || client.nameUser.get(senderID)) {
				try{
					const name = await Users.getNameUser(senderID);
					await Users.setData(senderID, { name });
					client.nameUser.set(senderID, name);
				}
				catch (e) {
					logger("Không thể lấy thông tin của người dùng", "error");
				}
			}
			return;
		}
		catch(e) {
			console.log(e);
		}
	};
};