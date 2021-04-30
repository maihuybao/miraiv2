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
		},
		{
			key: "default",
			prompt: "Đặt lại prefix về mặc định!",
			type: 'Văn bản',
			example: '!'
		}
	]
};

module.exports.handleReaction = async function({ api, event, client, Threads, handleReaction }) {
	if (event.userID != handleReaction.author) return;
	const { threadID, messageID } = event;
	var data = (await Threads.getData(threadID)).settings;
	data["PREFIX"] = handleReaction.PREFIX;
	await Threads.setData( threadID, { settings: data } );
	await client.threadSetting.set(parseInt(threadID), data);
	return api.sendMessage(`Đã chuyển đổi prefix của nhóm thành: ${handleReaction.PREFIX}`, threadID, messageID);
}

module.exports.run = async ({ api, event, args, client, Threads, __GLOBAL }) => {
	if (typeof args[0] == "undefined") return api.sendMessage("Phần prefix cần đặt không được để trống", event.threadID, event.messageID);
	let prefix = args[0].trim();
	if (!prefix) return api.sendMessage("Phần prefix cần đặt không được để trống", event.threadID, event.messageID);
	if (prefix == "default") {
		var data = (await Threads.getData(event.threadID)).settings;
		data["PREFIX"] = __GLOBAL.settings.PREFIX;
		await Threads.setData( event.threadID, { settings: data } );
		await client.threadSetting.set(parseInt(event.threadID), data);
		return api.sendMessage(`Đã reset prefix về mặc định ${__GLOBAL.settings.PREFIX}`, event.threadID, event.messageID);
	} else return api.sendMessage("Bạn có chắc bạn muốn đổi prefix của nhóm thành: " + prefix, event.threadID, (error, info) => {
		client.handleReaction.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			PREFIX: prefix
		})
	})
}