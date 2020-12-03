module.exports.config = {
	name: "search",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Tìm kiếm kết quả trên google!",
	commandCategory: "general",
	usages: "search [Text]",
	cooldowns: 5,
	dependencies: ["request", "fs"],
	info: [
		{
			key: "Text",
			prompt: "Là đoạn văn bản cần tìm kiếm hoặc phản hồi một ảnh!",
			type: 'Text',
			example: 'catalizcs'
		}
	]
};

module.exports.run = function({ api, event, args }) {
	const textNeedSearch = "";
	const regex = /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/;
	(event.type == "message_reply") ? textNeedSearch = event.messageReply.attachments[0].url : textNeedSearch = args.join(" ");
	(regex.test(textNeedSearch)) ? api.sendMessage(`https://www.google.com/searchbyimage?&image_url=${textNeedSearch}`, event.threadID, event.messageID) : api.sendMessage(``)
}
