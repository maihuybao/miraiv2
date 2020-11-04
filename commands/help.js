module.exports.config = {
	name: "help",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Hướng dẫn cho người mới",
	commandCategory: "system",
	usages: "help Text",
	cooldowns: 5,
	args: [
		{
			key: 'Text',
			prompt: 'Là lệnh bạn cần biết thêm thông tin chi tiết.',
			type: 'Văn Bản',
			example: 'help'
		}
	]
};


module.exports.run = function(api, event, args, client) {
	const nameHelp = client.commands.get(args[0]);
	
	if (!nameHelp) return api.sendMessage("Lệnh bạn nhập không tồn tại trong hệ thống ;w;", event.threadID, event.messageID);
	const argsHelp = nameHelp.config.args;
	//console.log(nameHelp);
	var argsText = "";
	for (var i = 0; i < argsHelp.length; i++) {
		argsText +=
			`\n + key: ${argsHelp[i].key}` + 
			`\n   • Là: ${argsHelp[i].prompt}` + 
			`\n   • Định dạng: ${argsHelp[i].type}` + 
			`\n   • Ví dụ: ${argsHelp[i].example}\n`
	}
	return api.sendMessage(
	'=== Thông tin lệnh bạn đang tìm ===\n' +
	'- Tên lệnh: ' + nameHelp.config.name + '\n' +
	'- Thông tin: ' + nameHelp.config.description + '\n' +
	'- Cách dùng: ' + nameHelp.config.usages + '\n' +
	'- Dữ liệu đầu vào: ' + argsText,
	event.threadID, event.messageID
	);
}