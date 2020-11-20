module.exports.config = {
	name: "uptime",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Kiểm tra thời gian bot đã online",
	commandCategory: "system",
	usages: "uptime",
	cooldowns: 5
};

module.exports.run = ({ api, event }) => {
	let timeStart = Date.now();
	var time = process.uptime();
	var hours = Math.floor(time / (60 * 60));
	var minutes = Math.floor((time % (60 * 60)) / 60);
	var seconds = Math.floor(time % 60);
	let processTime = Date.now();
	return api.sendMessage(`Bot đã hoạt động được ${hours} giờ ${minutes} phút ${seconds} giây.`, event.threadID, event.messageID);
}