module.exports.config = {
	name: "setprefix",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Đặt lại prefix của nhóm",
	commandCategory: "system",
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

module.exports.handleReaction = async function({ api, event, args, client, __GLOBAL, Thread, handleReaction }) {
	let { threadID, messageID } = event;
	let settings, data;
	data = (await Thread.getData(threadID)).settings;
	data["PREFIX"] = handleReaction.PREFIX;
	await Thread.setData({ threadID, options: { settings: data } });
	await client.threadSetting.set(threadID, data);
	return api.sendMessage(`Đã chuyển đổi prefix của nhóm thành: ${handleReaction.PREFIX}`, threadID, messageID);
}

module.exports.run = async ({ api, event, args, client }) => {
	if (!args) return api.sendMessage("Phần prefix cần đặt không được để trống", event.threadID, event.messageID);
	return api.sendMessage("Bạn có chắc bạn muốn đổi prefix của nhóm thành: " + args[0], event.threadID, (error, info) => {
		client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: args[0]
		})
	})
}