module.exports = function({ Users, Threads, Currencies }) {
	const logger = require("../../utils/log.js");

	return async function({ event }) {

		const { allUserID, allCurrenciesID, allThreadID, userName } = global.data;
		const { autoCreateDB } = global.config;

		if (autoCreateDB == false) return;

		var { senderID, threadID } = event;

		senderID = parseInt(senderID);
		threadID = parseInt(threadID);

		try {

			///////////////////////////////////////////////
			//========= Check and create thread =========//
			///////////////////////////////////////////////

			if (!allThreadID.includes(threadID) && event.isGroup == true) {
				await Threads.createData(threadID, { data: {} });
				allThreadID.push(threadID);
				logger(`New Thread: ${threadID}`, "[ DATABASE ]");				
			}

			//////////////////////////////////////
			//========= Check userInfo =========//
			//////////////////////////////////////

			if (!allUserID.includes(senderID)) {
				await Users.createData(senderID, { name: "" });
				allUserID.push(parseInt(senderID));
				logger(`New User: ${senderID}`, "[ DATABASE ]");
			}

			////////////////////////////////////////
			//========= Check Currencies =========//
			////////////////////////////////////////

			if (!allCurrenciesID.includes(senderID)) {
				await Currencies.createData(senderID);
				allCurrenciesID.push(parseInt(senderID));
				logger(`New Currency: ${senderID}`, "[ DATABASE ]");
			}
			
			//////////////////////////////////////
			//========= Check nameUser =========//
			//////////////////////////////////////

			if (!userName.has(senderID) || (userName.get(senderID) == "Người dùng facebook")) {				
				const name = await Users.getNameUser(senderID);
				await Users.setData(senderID, { name });
				userName.set(senderID, name);
			}

			return;
		}
		catch(e) {
			return console.log(e);
		}
	};
};