module.exports = function({ api, __GLOBAL, client }) {
	return async function({ event }) {
		if (__GLOBAL.settings.AutoChangeName == false) return;
		var { threadID } = event;
		threadID = parseInt(threadID);
		const data = await api.getThreadInfo(threadID);
		const threadSetting = client.threadSetting.get(threadID) || {};
		const name = `[ ${(threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : __GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "Made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`;
	if ((data.nicknames)[api.getCurrentUserID()] != name) api.changeNickname(name, threadID, api.getCurrentUserID(), (err) => (err) ? console.error(err) : '');
	}
}