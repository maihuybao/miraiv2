module.exports.config = {
	name: "refresh",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Load lại toàn bộ thông tin của nhóm",
	commandCategory: "system",
	usages: "balance",
	cooldowns: 500
};

module.exports.run = async ({ event, api, Threads }) => {
    const threadInfo = await api.getThreadInfo(event.threadID);
	await Threads.createData(event.threadID, { name: threadInfo.name, threadInfo });
    return api.sendMessage("Đã làm mới lại thông tin của nhóm thành công!", event.threadID, event.messageID);
}