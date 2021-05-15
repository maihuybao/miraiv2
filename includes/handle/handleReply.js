module.exports = function({ api, global, client, models, Users, Threads, Currencies }) {
	return function({ event }) {
		if (!event.messageReply) return;
		const { handleReply } = client;
		if (handleReply.length !== 0) {
			const indexOfHandle = handleReply.findIndex(e => e.messageID == event.messageReply.messageID);
			if (indexOfHandle < 0) return;
			const indexOfMessage = handleReply[indexOfHandle];
			const handleNeedExec = client.commands.get(indexOfMessage.name);
			if (!handleNeedExec) return api.sendMessage("Thiếu dữ kiện để thực thi phản hồi lại câu trả lời của bạn!", event.threadID, event.messageID);
			try {
				handleNeedExec.handleReply({ api, global, client, event, models, Users, Threads, Currencies, handleReply: indexOfMessage, models });
				return;
			}
			catch (e) {
				return api.sendMessage("Đã có lỗi xảy ra khi đang thực thi trả lời câu hỏi của bạn!", event.threadID, event.messageID);
			}
		}
	};
};