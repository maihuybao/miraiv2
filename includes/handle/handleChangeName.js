module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		var data = await api.getThreadInfo(event.threadID);
		let prefix = "";
		let threadSetting = client.threadSetting.get(event.threadID) || {};
		let name = `[ ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`;
		if ((data.nicknames)[api.getCurrentUserID()] != name) api.changeNickname(name, event.threadID, api.getCurrentUserID());
	}
}