module.exports.config = {
	name: "sing",
	aliases: [],
	usage: "hát cho bạn nghe qua youtube hoặc soundcloud",
	commandCategory: "system"
};

module.exports.run = async (api, event, args) => {
	let timeStart = Date.now();
	const ytdl = require("ytdl-core");
	//const ffmpeg = require("fluent-ffmpeg");
	//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
	const fs = require("fs");
	//ffmpeg.setFfmpegPath(ffmpegPath);
	api.sendMessage(`video của bạn đang được xử lý, nếu video dài có thể sẽ mất vài phút!`, event.threadID);
	let processTime = Date.now();
	return ytdl(args[0]).pipe(fs.createWriteStream(__dirname + "/cache/music.mp4")).on("close", () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/music.mp4")}, event.threadID, () =>{
		fs.unlinkSync(__dirname + "/cache/music.mp4");
		let timeEnd = Date.now();
		api.sendMessage(`thời gian xử lý tác vụ: ${processTime - timeStart}ms\nTổng thời gian xử lý và trả kết quả: ${timeEnd - timeStart}ms`, event.threadID);
	}, event.messageID));
}