module.exports.config = {
	name: "sing",
	version: "1.0.4",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Phát nhạc thông qua link YouTube, SoundCloud hoặc từ khoá tìm kiếm",
	commandCategory: "media",
	usages: "sing [Text]",
	cooldowns: 10,
	dependencies: ["ytdl-core","simple-youtube-api","soundcloud-downloader","fs-extra"],
	info: [
		{
			key: 'Text',
			prompt: 'Nhập link YouTube, SoundCloud hoặc là từ khoá tìm kiếm.',
			type: 'Văn Bản',
			example: 'rap chậm thôi'
		}
	]
};

module.exports.handleReply = async function({ api, event, client, __GLOBAL, handleReply }) {
	const ytdl = require("ytdl-core");
	const { createReadStream, createWriteStream, unlinkSync } = require("fs-extra");
	ytdl(`https://www.youtube.com/watch?v=${handleReply.link[event.body - 1]}`, { filter: format => format.itag == '140' }).pipe(createWriteStream(__dirname + "/cache/music.m4a")).on("close", () => api.sendMessage({ attachment: createReadStream(__dirname + "/cache/music.m4a" )}, event.threadID, () => unlinkSync(__dirname + "/cache/music.m4a"), event.messageID));
}

module.exports.run = async function({ api, event, args, __GLOBAL }) {
	const ytdl = require("ytdl-core");
	const YouTubeAPI = require("simple-youtube-api");
	const scdl = require("soundcloud-downloader");
	const { createReadStream, createWriteStream, unlinkSync } = require("fs-extra");
	
	const youtube = new YouTubeAPI(__GLOBAL.settings.YOUTUBE_API);
	
	if (args.length == 0 || !args) return api.sendMessage('Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
	const keywordSearch = args.join(" ");
	const urlVideo = args[0];
	const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
	const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
	const urlValid = videoPattern.test(args[0]);
	
	if (urlValid) {
		try {
			var songInfo = await ytdl.getInfo(args[0]);
			let body = `Tiêu .đề: ${songInfo.videoDetails.title} | [${(songInfo.videoDetails.lengthSeconds - (songInfo.videoDetails.lengthSeconds %= 60)) / 60 + (9 < songInfo.videoDetails.lengthSeconds ? ':' : ':0') + songInfo.videoDetails.lengthSeconds}]`;
		}
		catch (error) {
			api.sendMessage("Thông tin của YouTube đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
		ytdl(args[0], { filter: format => format.itag == '140' }).pipe(createWriteStream(__dirname + "/cache/music.m4a")).on("close", () => api.sendMessage({ body, attachment: createReadStream(__dirname + "/cache/music.m4a" )}, event.threadID, () => unlinkSync(__dirname + "/cache/music.m4a"), event.messageID));
	}
	else if (scRegex.test(args[0])) {
		try {
			var songInfo = await scdl.getInfo(args[0], __GLOBAL.settings.SOUNDCLOUD_API);
			var timePlay = Math.ceil(songInfo.duration / 1000);
			let body = `Tiêu đề: ${songInfo.title} | ${(timePlay - (timePlay %= 60)) / 60 + (9 < timePlay ? ':' : ':0') + timePlay}]`;
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
			var link = [], num = 0, msg = "";
			var results = await youtube.searchVideos(keywordSearch, 5);
			for (let i of results) {
				if (typeof results.Video[i].id != 'undefined') {
					link.push(results.Video.id);
					var songInfo = await ytdl.getInfo(results[i].Video.id);
					msg += `${num += 1}. ${decodeURIComponent(songInfo.videoDetails.title)} | [${(songInfo.videoDetails.lengthSeconds - (songInfo.videoDetails.lengthSeconds %= 60)) / 60 + (9 < songInfo.videoDetails.lengthSeconds ? ':' : ':0') + songInfo.videoDetails.lengthSeconds}]\n\n`;
				}
			}
			api.sendMessage(`🎼 Có ${link.length} kết quả trùng với từ khoá tìm kiếm của bạn: \n\n${msg}\n\n Hãy reply(phản hồi) chọn một trong những tìm kiếm trên`, event.threadID,(error, info) => client.handleReply.push({ name: "sing", messageID: info.messageID, author: event.senderID, link }), event.messageID);
			/*let songInfo = await ytdl.getInfo(results[0].url);
			let body = `Tiêu đề: ${songInfo.videoDetails.title} | [${(songInfo.videoDetails.lengthSeconds - (songInfo.videoDetails.lengthSeconds %= 60)) / 60 + (9 < songInfo.videoDetails.lengthSeconds ? ':' : ':0') + songInfo.videoDetails.lengthSeconds}]`;
			ytdl(results[0].url, { filter: format => format.itag == '140' }).pipe(createWriteStream(__dirname + "/cache/music.m4a")).on("close", () => api.sendMessage({ body, attachment: createReadStream(__dirname + "/cache/music.m4a" )}, event.threadID, () => unlinkSync(__dirname + "/cache/music.m4a"), event.messageID));*/
		}
		catch (error) {
			api.sendMessage("Thông tin của YouTube đã xảy ra sự cố, lỗi: " + error.message, event.threadID, event.messageID);
		}
	}
}