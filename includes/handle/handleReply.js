module.exports = function({ api, models, Users, Threads, Currencies }) {
	return function({ event }) {
		if (!event.messageReply) return;
		
		const { handleReply, commands } = global.client;
		const { messageID, threadID, messageReply } = event;

		if (handleReply.length !== 0) {
			const indexOfHandle = handleReply.findIndex(e => e.messageID == messageReply.messageID);
			if (indexOfHandle < 0) return;
			const indexOfMessage = handleReply[indexOfHandle];
			const handleNeedExec = commands.get(indexOfMessage.name);
			if (!handleNeedExec) return api.sendMessage("Thiếu dữ kiện để thực thi phản hồi lại câu trả lời của bạn!", threadID, messageID);
			try {
				handleNeedExec.handleReply({ api, event, models, Users, Threads, Currencies, handleReply: indexOfMessage, models });
				return;
			}
			catch (e) {
				return api.sendMessage("Đã có lỗi xảy ra khi đang thực thi trả lời câu hỏi của bạn!", threadID, messageID);
			}
		}
	};
};