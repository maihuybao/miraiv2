module.exports.config = {
	name: "test",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Trò chuyện cùng con sim mất dạy nhất quả đất",
	commandCategory: "general",
	usages: "sim [Text]",
	cooldowns: 5,
	dependencies: ["request"],
	info: [
		{
			key: "Text",
			prompt: "Lời muốn nói chuyện với em ấy",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args, models }) => {
	const thread = models.use("thread");
	var threadSetting = (await thread.findAll());
	return console.log(threadSetting);
}