module.exports.config = {
	name: "choose",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Nhờ bot chọn giúp một trong những thứ bạn cần làm ở bên dưới",
	commandCategory: "General",
	usages: "choose text1 | text2",
	cooldowns: 5,
	info: [
		{
			key: "Text1, Text2",
			prompt: "Văn bản bạn cần random",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
	var input = args.join(" ").trim();
	if (!input)return api.sendMessage(`Bạn không nhập đủ thông tin kìa :(`,threadID,messageID);
	var array = input.split(" | ");
	return api.sendMessage(`Hmmmm, em sẽ chọn giúp cho là: ` + array[Math.floor(Math.random() * array.length)] + `.`,event.threadID, event.messageID);
}