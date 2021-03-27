module.exports.config = {
	name: "ping",
	version: "0.0.1",
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
	listUserID.splice(listUserID.indexOf(api.getCurrentUserID()), 1);
	listUserID.splice(listUserID.indexOf(event.senderID), 1);
	var body = args.join(" ") || '@everyone', mentions = [];
	for (let i = 0; i < listUserID.length; i++) {
		if (i == body.length) body += " ";
		mentions.push({
			tag: body[i],
			id: listUserID[i],
			fromIndex: i - 1
		});
	}
	return api.sendMessage({ body, mentions }, event.threadID, async (err, info) => {
		await new Promise(resolve => setTimeout(resolve, 2 * 1000));
		api.deleteMessage(info.messageID);
	}, event.messageID);
}