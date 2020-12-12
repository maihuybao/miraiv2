module.exports.config = {
	name: "joinEvents",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

module.exports.run = async function({ api, event, client, __GLOBAL }) {
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.sendMessage(`Connected successfully! This bot was made by CatalizCS and SpermLord\nThank you for using our products, have fun UwU <3`, event.threadID);
		api.changeNickname(`[ ${__GLOBAL.settings.PREFIX} ] • ${(!__GLOBAL.settings.BOTNAME) ? "This bot was made by CatalizCS and SpermLord" : __GLOBAL.settings.BOTNAME}`, event.threadID, api.getCurrentUserID());
	}
	else {
		let threadInfo = await api.getThreadInfo(event.threadID);
		let threadName = threadInfo.threadName;
		var mentions = [], nameArray = [], memLength = [];
		for (var i = 0; i < event.logMessageData.addedParticipants.length; i++) {
			let id = event.logMessageData.addedParticipants[i].userFbId;
			let userName = event.logMessageData.addedParticipants[i].fullName;
			nameArray.push(userName);
			mentions.push({ tag: userName, id });
			memLength.push(threadInfo.participantIDs.length - i);
		}
		memLength.sort((a, b) => a - b);
		var body = `Welcome aboard ${nameArray.join(', ')}.\nChào mừng ${(memLength.length > 1) ?  'các bạn' : 'bạn'} đã đến với ${threadName}.\n${(memLength.length > 1) ?  'Các bạn' : 'Bạn'} là thành viên thứ ${memLength.join(', ')} của nhóm 🥳`;
		api.sendMessage({ body, mentions }, event.threadID);
	}
}