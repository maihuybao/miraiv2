const logger = require("../utils/log.js");

module.exports = function({ api, client, __GLOBAL, models }) {
	const Users = require("./controllers/users")({ models, api }),
				Threads = require("./controllers/threads")({ models, api }),
				Currencies = require("./controllers/currencies")({ models });

	(async () => {
		logger("Khởi tạo biến môi trường", "[ DATABASE ]");
		var threadBanned = (await Threads.getAll({ banned: true }));
		var userBanned = (await Users.getAll({ banned: true }));
		var threadSetting = (await Threads.getAll(['threadID', 'settings']));
		for (const info of threadBanned) client.threadBanned.set(info.threadID.toString(), { reason: info.reasonban, time2unban: info.time2unban });
		logger("Loaded thread banned!", "[ DATABASE ]")
		for (const info of userBanned) client.userBanned.set(info.userID.toString(), { reason: info.reasonban, time2unban: info.time2unban });
		logger("Loaded user banned!", "[ DATABASE ]")
		for (const info of threadSetting) client.threadSetting.set(info.threadID.toString(), info.settings);
		logger("Loaded thread setting", "[ DATABASE ]")
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

	return (error, event) => {
		if (error) logger(JSON.stringify(error), 2);
		if (client.event && JSON.stringify(event) == JSON.stringify(client.event) || typeof event.type == "undefined") "";
		else {
			client.event = event;
			try {
				switch (event.type) {
					case "message":
					case "message_reply": 
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
			catch (e) {
				""
			}
			if (__GLOBAL.settings.DeveloperMode == true) console.log(event);
		}
	}
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯