module.exports.config = {
	name: "ioscrash",
	version: "0.0.1",
	hasPermssion: 2,
	credits: "CatalizCS",
	description: "=)))))",
	cooldowns: 5
};

module.exports.run = ({ event, api }) => {
	return api.sendMessage({body: "Your iphone has crashed huh?", mentions: [{ tag: '👀', id: event.senderID}]}, event.threadID, async (err, info) => {
		await new Promise(resolve => setTimeout(resolve, 2000));
		api.unsendMessage(info.messageID);
	});
}