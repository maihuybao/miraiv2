module.exports.config = {
	name: "leaveEvents",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "SpermLord",
	description: "Listen events"
};

module.exports.run = async function({ api, event, client, __GLOBAL }) {
	if (event.author == event.logMessageData.leftParticipantFbId) api.sendMessage(`${event.logMessageBody.split(' đã rời khỏi nhóm.')[0]} có vẻ chán nản nên đã rời khỏi nhóm 🥺`, event.threadID);
	else api.sendMessage(`${/đã xóa (.*?) khỏi nhóm/.exec(event.logMessageBody)[1]} vừa bị đá khỏi nhóm 🤔`, event.threadID);
}