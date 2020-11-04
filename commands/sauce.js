module.exports.config = {
	name: "sauce",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Tìm kiếm thông tin ảnh thông qua ảnh(chỉ dành cho anime và hentai)",
	commandCategory: "general",
	usages: "sauce",
	cooldowns: 5,
	args: [
		{
			key: "reply ảnh",
			prompt: "Bạn cần phải reply(phản hồi) ảnh/gif để có thể tìm thấy sauce",
			type: 'Reply',
			example: 'Không Có'
		}
	]
};

module.exports.run = async (api, event, args) => {
	let SAUCENAO_API;
	try {
		const config = require('../config.json');
		SAUCENAO_API = config.SAUCENAO_API;
	} catch (error) {
		SAUCENAO_API = process.env.SAUCENAO_API;
	}
	const sagiri = require('sagiri'), search = sagiri(SAUCENAO_API);
	if (event.type != "message_reply") return api.sendMessage(`Vui lòng bạn reply bức ảnh cần phải tìm!`, event.threadID, event.messageID);
	if (event.messageReply.attachments.length > 1) return api.sendMessage(`Vui lòng reply chỉ một ảnh!`, event.threadID, event.messageID);
	if (event.messageReply.attachments[0].type == 'photo') {
		if (SAUCENAO_API == '' || typeof SAUCENAO_API == 'undefined') return api.sendMessage(`Chưa có api của saucenao!`, event.threadID, event.messageID);
		return search(event.messageReply.attachments[0].url).then(response => {
			let data = response[0];
			let results = {
				similarity: data.similarity,
				material: data.raw.data.material || 'Không có',
				characters: data.raw.data.characters || 'Original',
				creator: data.raw.data.creator || 'Không biết',
				site: data.site,
				url: data.url
			};
			const minSimilarity = 50;
			if (minSimilarity <= ~~results.similarity) {
				api.sendMessage(
					'Đây là kết quả tìm kiếm được\n' +
					'-------------------------\n' +
					'- Độ tương tự: ' + results.similarity + '%\n' +
					'- Material: ' + results.material + '\n' +
					'- Characters: ' + results.characters + '\n' +
					'- Creator: ' + results.creator + '\n' +
					'- Original site: ' + results.site + ' - ' + results.url,
					event.threadID, event.messageID
				);
			}
			else api.sendMessage(`Không thấy kết quả nào trùng với ảnh bạn đang tìm kiếm :'(`, event.threadID, event.messageID);
		});
	}
}