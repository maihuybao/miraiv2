module.exports.config = {
	name: "sing",
	version: "1.0.4",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Phát nhạc thông qua link YouTube, SoundCloud hoặc từ khoá tìm kiếm",
	commandCategory: "Media",
	usages: "sing [Text]",
	cooldowns: 10,
	dependencies: ["ytdl-core","simple-youtube-api","soundcloud-downloader","fluent-ffmpeg","@ffmpeg-installer/ffmpeg"],
	info: [
		{
			key: 'Text',
			prompt: 'Nhập link YouTube, SoundCloud hoặc là từ khoá tìm kiếm.',
			type: 'Văn Bản',
			example: 'rap chậm thôi'
		}
	],
	envConfig: {
		"YOUTUBE_API": "AIzaSyB6pTkV2PM7yLVayhnjDSIM0cE_MbEtuvo",
		"SOUNDCLOUD_API": "M4TSyS6eV0AcMynXkA3qQASGcOFQTWub"
	}
};

module.exports.handleReply = async function({ api, event, handleReply }) {
	const ffmpeg = require("fluent-ffmpeg");
	const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
	ffmpeg.setFfmpegPath(ffmpegPath);
	const ytdl = require("ytdl-core");
	const { createReadStream, createWriteStream, unlinkSync, statSync } = require("fs-extra");
	api.sendMessage("Đang xử lý request của bạn!", event.threadID,event.messageID)
	ffmpeg().input(ytdl(`https://www.youtube.com/watch?v=${handleReply.link[event.body - 1]}`)).toFormat("mp3").pipe(createWriteStream(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp3`)).on("close", () => api.sendMessage({attachment: createReadStream(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp3`)}, event.threadID, () => unlinkSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp3`), event.messageID));
}

module.exports.run = async function({ api, event, args, __GLOBAL, client }) {
	const ytdl = require("ytdl-core");
	const YouTubeAPI = require("simple-youtube-api");
	const scdl = require("soundcloud-downloader").default;
	const { createReadStream, createWriteStream, unlinkSync } = require("fs-extra");
	var ffmpeg = require("fluent-ffmpeg");
	var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
	ffmpeg.setFfmpegPath(ffmpegPath);
	
	const youtube = new YouTubeAPI(__GLOBAL["sing"].YOUTUBE_API);
	
	if (args.length == 0 || !args) return api.sendMessage('Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
	const keywordSearch = args.join(" ");
	const urlVideo = args[0];
	const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
	const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
	const urlValid = videoPattern.test(args[0]);
	
	if (urlValid) {
		try {
			var songInfo = await ytdl.getInfo(args[0]);
			let body = `Tiêu đề: ${songInfo.videoDetails.title} | [${(songInfo.videoDetails.lengthSeconds - (songInfo.videoDetails.lengthSeconds %= 60)) / 60 + (9 < songInfo.videoDetails.lengthSeconds ? ':' : ':0') + songInfo.videoDetails.lengthSeconds}]`;
		}
		catch (error) {
			api.sendMessage("Thông tin của YouTube đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
		ffmpeg().input(ytdl(args[0])).toFormat("mp3").pipe(createWriteStream(__dirname + "/cache/music.mp3")).on("close", () => api.sendMessage({attachment: createReadStream(__dirname + "/cache/music.mp3")}, event.threadID, () => unlinkSync(__dirname + "/cache/music.mp3"), event.messageID));

	}
	else if (scRegex.test(args[0])) {
		let body;
		try {
			var songInfo = await scdl.getInfo(args[0], __GLOBAL.sing.SOUNDCLOUD_API);
			var timePlay = Math.ceil(songInfo.duration / 1000);
			body = `Tiêu đề: ${songInfo.title} | ${(timePlay - (timePlay %= 60)) / 60 + (9 < timePlay ? ':' : ':0') + timePlay}]`;
		}
		catch (error) {
			if (error.statusCode == "404") return api.sendMessage("Không tìm thấy bài nhạc của bạn thông qua link trên ;w;", event.threadID, event.messageID);
			api.sendMessage("Thông tin của SoundCloud đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
		try {
			await scdl.downloadFormat(args[0], scdl.FORMATS.OPUS, __GLOBAL.settings.SOUNDCLOUD_API ? __GLOBAL.settings.SOUNDCLOUD_API : undefined).then(songs => songs.pipe(createWriteStream(__dirname + "/cache/music.mp3")).on("close", () => api.sendMessage({ body, attachment: createReadStream(__dirname + "/cache/music.mp3" )}, event.threadID, () => unlinkSync(__dirname + "/cache/music.mp3"), event.messageID)));
		}
		catch (error) {
			await scdl.downloadFormat(args[0], scdl.FORMATS.MP3, __GLOBAL.settings.SOUNDCLOUD_API ? __GLOBAL.settings.SOUNDCLOUD_API : undefined).then(songs => songs.pipe(createWriteStream(__dirname + "/cache/music.mp3")).on("close", () => api.sendMessage({ body, attachment: createReadStream(__dirname + "/cache/music.mp3" )}, event.threadID, () => unlinkSync(__dirname + "/cache/music.mp3"), event.messageID)));
		}
	}
	else {
		try {
			let link = [], msg = "", num = 0;
			let results = await youtube.searchVideos(keywordSearch, 5);
			for (let value of results) {
				if (typeof value.id == 'undefined') return;
				link.push(value.id);
				msg += (`${num+=1}. ${value.title}\n`);
			}
			return api.sendMessage(`🎼 Có ${link.length} kết quả trùng với từ khoá tìm kiếm của bạn: \n${msg}\nHãy reply(phản hồi) chọn một trong những tìm kiếm trên`, event.threadID,(error, info) => client.handleReply.push({ name: "sing", messageID: info.messageID, author: event.senderID, link }), event.messageID);
		}
		catch (error) {
			api.sendMessage("Thông tin của YouTube đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
	}
}