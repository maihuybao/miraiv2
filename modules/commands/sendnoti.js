module.exports.config = {
	name: "sendnoti",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "SpermLord",
	description: "Gửi tin nhắn tới các nhóm!",
	commandCategory: "System",
	usages: "sendnoti [Text]",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "Đoạn văn bản bạn muốn gửi tới mọi người",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
	return api.getThreadList(100, null, ["INBOX"], (err, list) => {
		if (err) throw err;
		list.forEach(item => (item.isGroup == true && item.threadID != event.threadID) ? api.sendMessage(args.join(" "), item.threadID) : '');
		api.sendMessage('🛠 | Đã gửi đến toàn bộ nhóm thành công', event.threadID);
	});
}