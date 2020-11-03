module.exports.config = {
	name: "sing",
	description: "Trả về bản nhạc bạn yêu cầu bot",
	commandCategory: "general",
	usages: "sing Link",
	cooldowns: 5,
	args: [
		{
			key: 'Link',
			prompt: `Là địa chỉ của video, có thể là youtube và soundcloud.`,
			type: 'URL',
			example: 'https://youtube.com'
		}
	]
};


module.exports.run = async (api, event, args) => {
	const ytdl = require("ytdl-core");
	const YouTubeAPI = require("simple-youtube-api");
	const scdl = require("soundcloud-downloader");
	const { createReadStream, createWriteStream, unlinkSync } = require("fs");
	
	const play = () => {
		api.sendMessage(`Bài nhạc của bạn đang được xử lý, nếu video dài có thể sẽ mất vài phút!`, event.threadID);
		return api.sendMessage({attachment: createReadStream(__dirname + "/cache/music.mp3")}, event.threadID, () => unlinkSync(__dirname + "/cache/music.mp3"), event.messageID);
	}
	
	let YOUTUBE_API, SOUNDCLOUD_API;
	try {
		const config = require('../config.json');
		YOUTUBE_API = config.YOUTUBE_API;
		SOUNDCLOUD_API= config.SOUNDCLOUD_API;
	} catch (error) {
		YOUTUBE_API = process.env.YOUTUBE_API;
		SOUNDCLOUD_API= process.env.SOUNDCLOUD_API;
	}
	const youtube = new YouTubeAPI(YOUTUBE_API);
	
	if (args.length == 0 || !args) return api.sendMessage('Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
	const keywordSearch = args.join(" ");
	const urlVideo = args[0];
	const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
	const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
	const urlValid = videoPattern.test(args[0]);
	
	if (urlValid) {
		try {
			var songInfo = await ytdl.getInfo(args[0]);
			api.sendMessage(`Tiêu đề: ${songInfo.videoDetails.title} | [${(songInfo.videoDetails.lengthSeconds-(songInfo.videoDetails.lengthSeconds%=60))/60+(9<songInfo.videoDetails.lengthSeconds?':':':0')+songInfo.videoDetails.lengthSeconds}]`, event.threadID, event.messageID);
		} catch (error) {
			api.sendMessage("thông tin của youtube đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
		ytdl(args[0], {filter: 'audioonly', format: 'mp3'}).pipe(createWriteStream(__dirname + "/cache/music.mp3")).on("close", play);
	}
	else if (scRegex.test(args[0])) {
		try {
			var songInfo = await scdl.getInfo(args[0], SOUNDCLOUD_API);
			var timePlay = Math.ceil(songInfo.duration / 1000);
			api.sendMessage(`Tiêu đề: ${songInfo.title} | ${(timePlay-(timePlay%=60))/60+(9<timePlay?':':':0')+timePlay}]`, event.threadID, event.messageID);
		} catch (error) {
			if (error.statusCode == "404") return api.sendMessage("Không tìm thấy bài nhạc của bạn thông qua link trên ;w;", event.threadID, event.messageID);
			api.sendMessage("thông tin của soundcloud đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
		try {
			await scdl.downloadFormat(args[0], scdl.FORMATS.OPUS, SOUNDCLOUD_API ? SOUNDCLOUD_API : undefined).then(songs => songs.pipe(createWriteStream(__dirname + "/cache/music.mp3")).on("close", play));
		} catch (error) {
			await scdl.downloadFormat(args[0], scdl.FORMATS.MP3, SOUNDCLOUD_API ? SOUNDCLOUD_API : undefined).then(songs => songs.pipe(createWriteStream(__dirname + "/cache/music.mp3")).on("close", play));
		}
	}
	
	/*let timeStart = Date.now();
	const ytdl = require("ytdl-core");
	const fs = require("fs");
	api.sendMessage(`video của bạn đang được xử lý, nếu video dài có thể sẽ mất vài phút!`, event.threadID);
	let processTime = Date.now();
	return ytdl(args[0], {filter: 'audioonly', format: 'mp3'}).pipe(fs.createWriteStream(__dirname + "/cache/music.mp3")).on("close", () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/cache/music.mp3")}, event.threadID, () =>{
		fs.unlinkSync(__dirname + "/cache/music.mp3");
		let timeEnd = Date.now();
		api.sendMessage(`thời gian xử lý tác vụ: ${processTime - timeStart}ms\nTổng thời gian xử lý và trả kết quả: ${timeEnd - timeStart}ms`, event.threadID);
	}, event.messageID));*/
}