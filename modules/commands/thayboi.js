module.exports.config = {
	name: "boi",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Kiểm tra số tiền của bản thân hoặc người được tag",
	commandCategory: "Economy",
	usages: "balance [Tag]",
	cooldowns: 5,
	dependencies: ["request"],
	info: [
		{
			key: 'Tag',
			prompt: 'Để trống hoặc tag một người nào đó, có thể tag nhiều người',
			type: 'Văn Bản',
			example: '@Mirai-chan'
		}
	]
}

module.exports.run = ({event, api}) => {
	require("request")("https://minecvn.com/admin/thayboi.php", (err,Response, body) => {
		body = JSON.parse(body);
		return api.sendMessage(`${decodeURIComponent(body.body)}`, event.threadID, event.messageID);
	})
}