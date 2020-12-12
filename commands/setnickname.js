module.exports.config = {
	name: "setnickname",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "MeewMeew",
	description: "Set lại tên bot cho toàn bộ nhóm!",
	commandCategory: "system",
	usages: "setnickname",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	api.getThreadList(50, null, ["INBOX"], (err, list) => {
		list.forEach(async(info) => {
			if (!info.isGroup || (info.participants).length <= 10 || info.name == null || info.isSubscribed == false) return;
			var data = await api.getThreadInfo(info.threadID);
			if ((data.nicknames)[api.getCurrentUserID()] != `[ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "This bot was made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`) {
				await api.sendMessage("‏‏‎ ‎", info.threadID);
				api.changeNickname(`[ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "This bot was made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`, info.threadID, api.getCurrentUserID());
				logger("Đã sửa lại nickname của bot tại nhóm: " + data.threadName);
			}
		})
	})
}