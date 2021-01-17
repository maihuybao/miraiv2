module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		let { threadID } = event;
		threadID = parseInt(threadID);
		let data = await api.getThreadInfo(threadID);
		let threadSetting = client.threadSetting.get(threadID) || {};
		let name = `[ ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`;
		if ((data.nicknames)[api.getCurrentUserID()] != name) api.changeNickname(name, threadID, api.getCurrentUserID());
	}
}