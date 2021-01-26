const logger = require("../utils/log.js");

module.exports = function({ api, client, __GLOBAL, models }) {
	const Users = require("./controllers/users")({ models, api }),
				Threads = require("./controllers/threads")({ models, api }),
				Currencies = require("./controllers/currencies")({ models });

	const utils = require("../utils/funcs.js")({ api, __GLOBAL, client });
	const handleCommand = require("./handle/handleCommand")({ api, __GLOBAL, client, models, Users, Threads, Currencies, utils });
	const handleCommandEvent = require("./handle/handleCommandEvent")({ api, __GLOBAL, client, models, Users, Threads, Currencies, utils });
	const handleReply = require("./handle/handleReply")({ api, __GLOBAL, client, models, Users, Threads, Currencies });
	const handleReaction = require("./handle/handleReaction")({ api, __GLOBAL, client, models, Users, Threads, Currencies });
	const handleEvent = require("./handle/handleEvent")({ api, __GLOBAL, client, models, Users, Threads, Currencies });
	const handleChangeName = require("./handle/handleChangeName")({ api, __GLOBAL, client });
	const handleCreateDatabase = require("./handle/handleCreateDatabase")({ __GLOBAL, api, Threads, Users, Currencies, models });

	logger(__GLOBAL.settings.PREFIX || "[none]", "[ PREFIX ]");
	logger(`${api.getCurrentUserID()} - [ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "This bot was made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`, "[ UID ]");
	logger("Connected to Messenger\nThis source code was made by Catalizcs(roxtigger2003) and SpermLord, please do not delete this credits!", "[ SYSTEM ]");

	(async () => {
		logger("Khởi tạo biến môi trường", "[ DATABASE ]");
		var threadBanned, userBanned, threadSetting;
		threadBanned = (await Threads.getAll({ banned: true })).map(e => e.get({ plain: true }));
		userBanned = (await Users.getAll({ banned: true })).map(e => e.get({ plain: true }));
		threadSetting = await Threads.getAll(['settings']);
		threadBanned.forEach(info => client.threadBanned.set(info.threadID, { reason: info.reasonban, time2unban: info.time2unban }));
		userBanned.forEach(info => client.userBanned.set(info.userID, { reason: info.reasonban, time2unban: info.time2unban }));
		threadSetting.forEach(info => client.threadSetting.set(info.threadID, info.settings));
		logger("Khởi tạo biến môi trường thành công!", "[ DATABASE ]");
	})();

	function sendEvent({ event }) {
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

	return (error, event) => {
		if (error) logger(JSON.stringify(error), 2);
		if (client.event && JSON.stringify(client.event) == JSON.stringify(event) || event.messageID && client.messageID == event.messageID) ""
		else {
			client.event = event;
			client.messageID = event.messageID;
			try {
				sendEvent({ event })
			}
			catch (e) {
				logger(JSON.stringify(e), 2);
			}	
		}
	}
}
//THIZ BOT WAS MADE BY ME(CATALIZCS) AND MY BROTHER SPERMLORD - DO NOT STEAL MY CODE (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯