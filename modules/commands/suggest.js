module.exports.config = {
	name: "suggest",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Gửi tính năng, ý tưởng, ý kiến mới đến author",
	commandCategory: "General",
	usages: "suggest [Text]",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "Ý tưởng, ý kiến, của bạn",
			type: 'Văn bản',
			example: 'fix sing di fu'
		}
	]
};

module.exports.run = async ({ api, event, args }) => {
	api.sendMessage(
		'REQUEST FOR YOU' +
		'\n\nID: ' + event.threadID + 
		'\nREQUEST: ' + args.join(" "),
		100027477920916, () => api.sendMessage("Ý kiến, ý tưởng của bạn đã được gửi đến author thành công!", event.threadID)
	)
}