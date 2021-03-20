const logger = require("../utils/log.js");

module.exports = function({ api, client, __GLOBAL, models, timeStart }) {
	const Users = require("./controllers/users")({ models, api }),
				Threads = require("./controllers/threads")({ models, api }),
				Currencies = require("./controllers/currencies")({ models });

	(async () => {
		logger("Khởi tạo biến môi trường", "[ DATABASE ]");
		var threadBanned = (await Threads.getAll({ banned: true }));
		var userBanned = (await Users.getAll({ banned: true }));
		var threadInfo = (await Threads.getAll(["threadID","threadInfo"]));
		var threadSetting = (await Threads.getAll(['threadID', 'settings']));
		for (const info of threadBanned) client.threadBanned.set(info.threadID.toString(), { reason: info.reasonban, time2unban: info.time2unban });
		logger.loader("Đã tải xong biến môi trường nhóm!")
		for (const info of userBanned) client.userBanned.set(info.userID.toString(), { reason: info.reasonban, time2unban: info.time2unban });
		logger.loader("Đã tải xong biến môi trường người dùng!")
		for (const info of threadSetting) client.threadSetting.set(info.threadID.toString(), info.settings);
		for (const info of threadInfo) client.threadInfo.set(info.threadID.toString(), info.threadInfo);
		logger.loader("Đã tải xong biến môi trường cài đặt nhóm!")
		logger("Khởi tạo biến môi trường thành công!", "[ DATABASE ]");
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
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({ __GLOBAL, api, Threads, Users, Currencies, models });

	logger.loader(`====== ${Date.now() - timeStart}ms ======`);

	return (error, event) => {
		try	{
			if (error) throw new Error(error.error);
			if (client.messageID && client.messageID == event.messageID || ["presence","typ","read_receipt"].some(typeFilter => typeFilter == event.type)) "";
			else {
				client.messageID = event.messageID;
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
				if (__GLOBAL.settings.DeveloperMode == true) console.log(event);
			}
		}
		catch {
			if (__GLOBAL.settings.DeveloperMode == true) logger(JSON.stringify(error), "error");
		}
	}
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯