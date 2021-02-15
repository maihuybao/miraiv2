module.exports.config = {
	name: "setprefix",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Đặt lại prefix của nhóm",
	commandCategory: "System",
	usages: "setprefix [prefix]",
	cooldowns: 5,
	info: [
		{
			key: "prefix",
			prompt: "prefix bạn muốn thay đổi",
			type: 'Văn bản',
			example: '!'
		}
	]
};

module.exports.handleReaction = async function({ api, event, client, Threads, handleReaction }) {
	let { threadID, messageID } = event;;
	let data = (await Threads.getData(threadID)).settings;
	data["PREFIX"] = handleReaction.PREFIX;
	await Threads.setData( threadID, { settings: data } );
	await client.threadSetting.set(parseInt(threadID), data);
	return api.sendMessage(`Đã chuyển đổi prefix của nhóm thành: ${handleReaction.PREFIX}`, threadID, messageID);
}

module.exports.run = async ({ api, event, args, client }) => {
	if (typeof args[0] == "undefined") return api.sendMessage("Phần prefix cần đặt không được để trống", event.threadID, event.messageID);
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage("Phần prefix cần đặt không được để trống", event.threadID, event.messageID);
	return api.sendMessage("Bạn có chắc bạn muốn đổi prefix của nhóm thành: " + prefix, event.threadID, (error, info) => {
		client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: prefix
		})
	})
}