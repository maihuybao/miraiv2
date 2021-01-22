module.exports.config = {
	name: "leaveEvents",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

module.exports.run = async function({ api, event, client, __GLOBAL, Users }) {
	let name;
	try {
		name = Users.getData(event.logMessageData.leftParticipantFbId).name;	
	}
	catch {
		name = (await api.getUserInfo(event.logMessageData.leftParticipantFbId))[event.logMessageData.leftParticipantFbId].name;
	}
	if (event.author == event.logMessageData.leftParticipantFbId) api.sendMessage(`${name} có vẻ chán nản nên đã rời khỏi nhóm 🥺`, event.threadID);
	else api.sendMessage(`${name} vừa bị đá khỏi nhóm 🤔`, event.threadID);
}