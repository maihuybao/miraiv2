module.exports.config = {
	name: "uptime",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Kiểm tra thời gian bot đã online",
	commandCategory: "System",
	usages: "uptime",
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	let time = process.uptime();
	let hours = Math.floor(time / (60 * 60));
	let minutes = Math.floor((time % (60 * 60)) / 60);
	let seconds = Math.floor(time % 60);
	return api.sendMessage(`Bot đã hoạt động được ${hours} giờ ${minutes} phút ${seconds} giây.`, event.threadID, event.messageID);
}