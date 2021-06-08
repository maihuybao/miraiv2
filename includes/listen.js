module.exports = function({ api, models }) {

	const Users = require("./controllers/users")({ models, api }),
				Threads = require("./controllers/threads")({ models, api }),
				Currencies = require("./controllers/currencies")({ models });
	const logger = require("../utils/log.js");

	//////////////////////////////////////////////////////////////////////
	//========= Push all variable from database to environment =========//
	//////////////////////////////////////////////////////////////////////
	
	(async function() {
		try {
			logger("Khởi tạo biến môi trường", "[ DATABASE ]");
			const threads = await Threads.getAll();
			const users = await Users.getAll(["userID", "name", "data"]);
			const currencies = await Currencies.getAll(["userID"]);

			for (const info of threads) {
				const threadID = parseInt(info.threadID);
				global.data.allThreadID.push(threadID);
				global.data.threadData.set(threadID, info.data || {});
				global.data.threadInfo.set(threadID, info.threadInfo || {})
				if (info.data && info.data.banned == true) global.data.threadBanned.set(info.threadID, 1);
			}
			logger.loader("Đã tải xong biến môi trường nhóm!");

			for (const info of users) {
				global.data.allUserID.push(parseInt(info.userID));
				if (info.name && info.name.length != 0) global.data.userName.set(parseInt(info.userID), info.name);
				if (info.banned == 1) global.data.userBanned.set(parseInt(info.userID), 1); 
			}
			for (const id of currencies) global.data.allCurrenciesID.push(parseInt(id.userID));
			logger.loader("Đã tải xong biến môi trường người dùng!");


			logger("Khởi tạo biến môi trường thành công!", "[ DATABASE ]");
		}
		catch (error) {
			return logger.loader("Khởi tạo biến môi trường không thành công, Lỗi: " + error, "error");
		}
	})();

	logger(`${api.getCurrentUserID()} - [ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "This bot was made by CatalizCS and SpermLord" : global.config.BOTNAME}`, "[ BOT INFO ]");
	
	///////////////////////////////////////////////
	//========= Require all handle need =========//
	//////////////////////////////////////////////

	require("./handle/handleSchedule")({ api, models, Users, Threads, Currencies });
	const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
	const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
	const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
	const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
	const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({  api, Threads, Users, Currencies, models });

	logger.loader(`====== ${Date.now() - global.client.timeStart}ms ======`);

	//////////////////////////////////////////////////
	//========= Send event to handle need =========//
	/////////////////////////////////////////////////

	return (event) => {
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				handleCommand({ event });
				handleReply({ event });
				handleCommandEvent({ event });
				handleCreateDatabase({ event });
				break;
			case "event":
				handleEvent({ event });
				break;
			case "message_reaction":
				handleReaction({ event });
				break;
			default:
				break;
		}
	};
};

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯