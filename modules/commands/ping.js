module.exports.config = {
	name: "ping",
	version: "0.0.2",
	hasPermssion: 1,
	credits: "SpermLord",
	description: "tag toàn bộ thành viên",
	commandCategory: "system",
	usages: "ping [Text]",
	cooldowns: 70,
	info: [
		{
			key: 'Text',
			prompt: 'Nội dung để ping, có thể để trống',
			type: 'Văn Bản',
			example: 'Mọi người ơi'
		}
	]
};

module.exports.run = async function({ api, event, args, Threads, client }) {
	var listUserID = ((client.threadInfo.get(event.threadID)) || (await Threads.getInfo(event.threadID))).participantIDs;
	const botID = api.getCurrentUserID();
	listUserID = listUserID.filter(ID => ID != botID && ID != event.senderID);
	var body = args.join(" ") || "@everyone",
		mentions = [],
		index = 0;
	
	for (idUser of listUserID) {
		if (index == body.length) body += "  ";
		mentions.push({
			tag: body[index],
			id: idUser,
			fromIndex: -1
		})
		index += 1;
	}

	return api.sendMessage({ body, mentions }, event.threadID);
}