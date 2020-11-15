module.exports.config = {
	name: "trans",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "SpermLord",
	description: "Dịch văn bản",
	commandCategory: "general",
	usages: "trans [Text]",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "Văn bản cần dịch, có thể reply tin",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
	const request = require("request");
	var content = args.join(" ");
	if (content.length == 0 && event.type != "message_reply") return api.sendMessage(`Bạn chưa nhập thông tin, vui lòng đọc ${prefix}help để biết thêm chi tiết!`, event.threadID,event.messageID);
	var translateThis = content.slice(0, content.indexOf(" ->"));
	var lang = content.substring(content.indexOf(" -> ") + 4);
	if (event.type == "message_reply") {
		translateThis = event.messageReply.body
		if (content.indexOf(" -> ") != -1) lang = content.substring(content.indexOf(" -> ") + 4);
		else lang = 'vi';
	}
	else if (content.indexOf(" -> ") == -1) {
		translateThis = content.slice(0, content.length)
		lang = 'vi';
	}
	return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${translateThis}`), (err, response, body) => {
		if (err) return api.sendMessage("Đã có lỗi xảy ra!", event.threadID, event.messageID)
		var retrieve = JSON.parse(body);
		var fromLang = retrieve[0][0][8][0][0][1].split("_")[0];
		api.sendMessage(`Bản dịch: ${retrieve[0][0][0]}\n - được dịch từ ${fromLang} sang ${lang}`, event.threadID, event.messageID);
	});
}