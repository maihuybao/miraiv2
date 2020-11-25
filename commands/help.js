module.exports.config = {
	name: "help",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Hướng dẫn cho người mới",
	commandCategory: "system",
	usages: "help [Text]",
	cooldowns: 5,
	info: [
		{
			key: 'Text',
			prompt: 'Là lệnh bạn cần biết thêm thông tin chi tiết.',
			type: 'Văn Bản',
			example: 'help'
		}
	]
};

module.exports.run = function({ api, event, args, client }) {
	const nameHelp = client.commands.get(args[0]);
	if (!nameHelp) return api.sendMessage("🤔 hình như lệnh bạn tìm không tồn tại!", event.threadID, event.messageID);
	const infoHelp = nameHelp.config.info;
	var infoText = "";
	if (!infoHelp || infoHelp.length == 0) infoText = 'Không có';
	else {
		for (var i = 0; i < infoHelp.length; i++) {
			infoText +=
				`\n+ key: ${infoHelp[i].key}` + 
				`\n  • Thông tin: ${infoHelp[i].prompt}` + 
				`\n  • Định dạng: ${infoHelp[i].type}` + 
				`\n  • Ví dụ: ${infoHelp[i].example}\n`
		}
	}
	return api.sendMessage(
		'=== Thông tin lệnh bạn đang tìm ===\n' +
		'- Tên lệnh: ' + nameHelp.config.name + '\n' +
		'- Thông tin: ' + nameHelp.config.description + '\n' +
		'- Cách dùng: ' + nameHelp.config.usages + '\n' +
		'- Dữ liệu đầu vào: ' + infoText,
		event.threadID, event.messageID
	);
}