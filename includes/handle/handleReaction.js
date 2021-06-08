module.exports = function({ api, models, Users, Threads, Currencies }) {
	return function({ event }) {
		
		const { handleReaction, commands } = global.client;
		const { messageID, threadID } = event;

		if (handleReaction.length !== 0) {
			const indexOfHandle = handleReaction.findIndex(e => e.messageID == messageID);
			if (indexOfHandle < 0) return;
			const indexOfMessage = handleReaction[indexOfHandle];
			const handleNeedExec = commands.get(indexOfMessage.name);
			if (!handleNeedExec) return api.sendMessage("Thiếu dữ kiện để thực thi phản hồi lại câu trả lời của bạn!", threadID, messageID);
			try {
				handleNeedExec.handleReaction({ api, event, models, Users, Threads, Currencies, handleReaction: indexOfMessage, models });
				return;
			}
			catch (e) {
				console.log(e);
				return api.sendMessage("Đã có lỗi xảy ra khi đang thực thi trả lời câu hỏi của bạn!", threadID, messageID);
			}
		}
	};
};