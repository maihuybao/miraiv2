module.exports.config = {
	name: "uptime",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Kiểm tra thời gian bot đã online",
	commandCategory: "system",
	usages: "uptime",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);

	const timeStart = Date.now();
	return api.sendMessage("", event.threadID, () => api.sendMessage(`Bot đã hoạt động được ${hours} giờ ${minutes} phút ${seconds} giây.\n\nTổng người dùng: ${global.data.allUserID.length}\nTổng Nhóm: ${global.data.allThreadID.length}\nPing: ${Date.now() - timeStart}ms`, event.threadID, event.messageID));
}