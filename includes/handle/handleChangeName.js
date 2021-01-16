module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		let data = await api.getThreadInfo(event.threadID);
		let threadSetting = client.threadSetting.get(parseInt(event.threadID)) || {};
		let name = `[ ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "Made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`;
		if ((data.nicknames)[api.getCurrentUserID()] != name) api.changeNickname(name, event.threadID, api.getCurrentUserID());
	}
}