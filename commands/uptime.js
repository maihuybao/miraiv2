module.exports.config = {
	name: "uptime",
	aliases: [],
	usage: "check uptime",
	commandCategory: "system"
};


module.exports.run = (api, event) => {
	let timeStart = Date.now();
	var time = process.uptime();
	var hours = Math.floor(time / (60*60));
	var minutes = Math.floor((time % (60 * 60)) / 60);
	var seconds = Math.floor(time % 60);
	let processTime = Date.now();
	return api.sendMessage(`Bot đã hoạt động được ${hours} giờ ${minutes} phút ${seconds} giây.`, event.threadID,() =>{
		let timeEnd = Date.now();
		api.sendMessage(`thời gian xử lý tác vụ: ${processTime - timeStart}ms\nTổng thời gian xử lý và trả kết quả: ${timeEnd - timeStart}ms`, event.threadID);
	}, event.messageID);
}