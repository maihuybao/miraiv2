module.exports.config = {
	name: "setprefix",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "CatalizCS",
	description: "Đặt lại prefix của nhóm",
	commandCategory: "system",
	usages: "setprefix [prefix]",
	cooldowns: 5,
	info: [
		{
			key: "prefix",
			prompt: "prefix bạn muốn thay đổi",
			type: 'Văn bản',
			example: '!'
		}
	]
};

module.exports.handleReaction = async function({ api, event, args, client, __GLOBAL, models, handleReaction }) {
	const thread = models.use("thread");
	if (!await thread.findOne({ where: { event.threadID } })) await thread.findOrCreate({ where: { event.threadID }, defaults: { settings: { "PREFIX": handleReaction.PREFIX } } });
	else await (thread.findOne({ where: { event.threadID } })).update({ settings: { "PREFIX": handleReaction.PREFIX } });
	return api.sendMessage("Đã đổi prefix của nhóm thành: " + handleReaction.PREFIX, event.threadID, event.messageID);
}

module.exports.run = async ({ api, event, args }) => {
return api.sendMessage("Bạn có chắc bạn muốn đổi prefix của nhóm thành: " + args[0], event.threadID, (error, info) => {
		client.handleReply.push({
			name: "setprefix",
			messageID: info.messageID,
			author: event.senderID,
			prefix: args[0]
		})
	})
}