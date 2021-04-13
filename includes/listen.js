const logger = require("../utils/log.js");

module.exports = function({ api, client, __GLOBAL, models, timeStart }) {
	const Users = require("./controllers/users")({ models, api }),
				Threads = require("./controllers/threads")({ models, api }),
				Currencies = require("./controllers/currencies")({ models });

	(async () => {
		try {
			logger("Khởi tạo biến môi trường", "[ DATABASE ]")
			var threads = (await Threads.getAll());
			for (const info of threads) {
				client.allThread.push(info.threadID);
				client.threadSetting.set(info.threadID.toString(), info.settings || {});
				client.threadInfo.set(info.threadID.toString(), info.threadInfo || {});
			}
			logger.loader("Đã tải xong biến môi trường nhóm!")
			var users = (await Users.getAll(["userID"]));
			for (const info of users) client.allUser.push(info.userID);
			logger.loader("Đã tải xong biến môi trường người dùng!")
			logger("Khởi tạo biến môi trường thành công!", "[ DATABASE ]");
		}
		catch (error) {
			return logger.loader("Khởi tạo biến môi trường không thành công, Lỗi: " + error, "error");
		} 
	})();

	logger(__GLOBAL.settings.PREFIX || "[none]", "[ PREFIX ]");
	logger(`${api.getCurrentUserID()} - [ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "This bot was made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`, "[ UID ]");
	logger("Connected to Messenger\nThis source code was made by Catalizcs(roxtigger2003) and SpermLord, please do not delete this credits!", "[ SYSTEM ]");
	
	const utils = require("../utils/funcs.js")({ api, __GLOBAL, client });
	const handleCommand = require("./handle/handleCommand")({ api, __GLOBAL, client, models, Users, Threads, Currencies, utils });
	const handleCommandEvent = require("./handle/handleCommandEvent")({ api, __GLOBAL, client, models, Users, Threads, Currencies, utils });
	const handleReply = require("./handle/handleReply")({ api, __GLOBAL, client, models, Users, Threads, Currencies });
	const handleReaction = require("./handle/handleReaction")({ api, __GLOBAL, client, models, Users, Threads, Currencies });
	const handleEvent = require("./handle/handleEvent")({ api, __GLOBAL, client, models, Users, Threads, Currencies });
	const handleChangeName = require("./handle/handleChangeName")({ api, __GLOBAL, client });
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({ __GLOBAL, api, Threads, Users, Currencies, models, client });

	logger.loader(`====== ${Date.now() - timeStart}ms ======`);

	return (event) => {
		switch (event.type) {
				case "message":
				case "message_reply":
				case "message_unsend":
					handleCommand({ event })
					handleReply({ event })
					handleCommandEvent({ event })
					handleChangeName({ event })
					handleCreateDatabase({ event })
					break;
				case "event":
					handleEvent({ event })
					break;
				case "message_reaction":
					handleReaction({ event })
					break;
				default:
					break;
		}
	}
}

//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯