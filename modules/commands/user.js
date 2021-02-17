module.exports.config = {
	name: "user",
	version: "0.0.1",
	hasPermssion: 2,
	credits: "CatalizCS",
	description: "Cấm hoặc gỡ cấm người dùng",
	commandCategory: "System",
	usages: "user args input",
	cooldowns: 5,
	info: [
		{
			key: 'args => ban',
			prompt: 'Nhập input là ID người dùng cần ban',
			type: 'Number',
			example: '100000'
		},
		{
			key: 'args => unban',
			prompt: 'Nhập input là ID người dùng cần unban',
			type: 'Number',
			example: '100000'
		},
		{
			key: 'args => search',
			prompt: 'Nhập input là từ khoá cần tìm người dùng',
			type: 'String',
			example: 'khu'
		}
	]
};

module.exports.handleReaction = async ({ event, api, Users, client, handleReaction }) => {
	if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
	switch (handleReaction.type) {
		case "ban": {
            var name;
            try {
                name = (await Users.getData(handleReaction.target)).name;
            }
            catch {
                name = (await api.getUserInfo(handleReaction.target))[handleReaction.target].name;
            }
            await Users.setData(handleReaction.target, options = { banned: 1 });
			let dataUser = client.userBanned.get(handleReaction.target.toString()) || {};
			dataUser["banned"] = 1;
			client.userBanned.set(handleReaction.target, dataUser);
			api.sendMessage(`[${handleReaction.target} | ${name}] Đã ban thành công!`, event.threadID);
			break;
		}
		case "unban": {
            var name;
            try {
                name = (await Users.getData(handleReaction.target)).name;
            }
            catch {
                name = (await api.getUserInfo(handleReaction.target))[handleReaction.target].name;
            }
			await Users.setData(handleReaction.target, options = { banned: 0 });
			client.userBanned.delete(handleReaction.target.toString());
			api.sendMessage(`[${handleReaction.target} | ${name}] Đã unban thành công!`, event.threadID);
			break;
		}
		default:
			break;
	}
}

module.exports.run = async ({ event, api, args, Users, client }) => {
    let content = args.slice(1, args.length);
	switch (args[0]) {
		case "ban": {
			if (content.length == 0) return api.sendMessage("Bạn cần phải nhập ID người dùng cần ban!", event.threadID);
			for (let idUser of content) {
				idUser = parseInt(idUser);
				if (isNaN(idUser)) return api.sendMessage(`[${idUser}] không phải là IDUser!`, event.threadID);
				let dataUser = (await Users.getData(idUser.toString()));
				if (!dataUser) return api.sendMessage(`[${idUser}] người dùng không tồn tại trong database!`, event.threadID);
				if (dataUser.banned) return api.sendMessage(`[${idUser}] Người dùng đã bị ban từ trước`, event.threadID);
				return api.sendMessage(`[${idUser}] Bạn muốn ban người dùng này ?\n\nHãy reaction vào tin nhắn này để ban!`, event.threadID, (error, info) => {
					client.handleReaction.push({
						name: "user",
						messageID: info.messageID,
						author: event.senderID,
						type: "ban",
						target: idUser
					});
				})
			}
			break;
		}
		case "unban": {
			if (content.length == 0) return api.sendMessage("Bạn cần phải nhập ID thread cần ban!", event.threadID);
			for (let idUser of content) {
				idUser = parseInt(idUser);
				if (isNaN(idUser)) return api.sendMessage(`[${idUser}] không phải là ID người dùng!`, event.threadID);
				let dataUser = (await Users.getData(idUser.toString()));
				if (!dataUser) return api.sendMessage(`[${idUser}] người dùng không tồn tại trong database!`, event.threadID);
				if (!dataUser.banned) return api.sendMessage(`[${idUser}] người dùng không bị ban từ trước`, event.threadID);
				return api.sendMessage(`[${idUser}] Bạn muốn unban người dùng này ?\n\nHãy reaction vào tin nhắn này để ban!`, event.threadID, (error, info) => {
					client.handleReaction.push({
						name: "user",
						messageID: info.messageID,
						author: event.senderID,
						type: "unban",
						target: idUser
					});
				})
			}
			break;
		}
		case "search": {
			let contentJoin = content.join(" ");
			let getUsers =  (await Users.getAll(['userID', 'name'])).filter(item => !!item.name);
			let matchUsers = [], a = '', b = 0;
			getUsers.forEach(i => {
				if (i.name.toLowerCase().includes(contentJoin.toLowerCase())) {
					matchUsers.push({
						name: i.name,
						id: i.userID
					});
				}
			});
			matchUsers.forEach(i => a += `\n${b += 1}. ${i.name} - ${i.id}`);
			(matchUsers.length > 0) ? api.sendMessage(`Đây là kết quả phù hợp: \n${a}`, event.threadID) : api.sendMessage("Không tìm thấy kết quả dựa vào tìm kiếm của bạn!", event.threadID);
			break;
		}
		default:
			break;
	}
}