module.exports.config = {
	name: "default",
	eventType: ["log:subscribe"],
	version: "1.0.0",
	credits: "CatalizCS",
	description: "Listen events"
};

module.exports.run = async function(api, event, client) {
	let PREFIX, BOTNAME;
	try {
		const config = require("../config.json");
		PREFIX = config.PREFIX;
		BOTNAME = config.BOTNAME
	} catch (error) {
		PREFIX = process.env.PREFIX;
		BOTNAME = process.env.BOTNAME;
	}
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`[ ${PREFIX} ] • ${(!BOTNAME) ? "This bot was made by CatalizCS" : BOTNAME}`, event.threadID, api.getCurrentUserID());
		api.sendMessage(`Im connected sucess! thiz bot was made by me(CatalizCS)\nThank you for using our products, have fun UwU <3`, event.threadID);
		let deleteMe = event.logMessageData.addedParticipants.find(i => i.userFbId == api.getCurrentUserID());
		event.logMessageData.addedParticipants.splice(deleteMe, 1);
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