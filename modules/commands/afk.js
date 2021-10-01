module.exports.config = {
	name: "afk",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Bật tắt chế độ afk!",
	commandCategory: "other",
	usages: "afk on reason",
    cooldowns: 5,
    info: [
		{
			key: "reason => Để trống",
			prompt: "Để trống nếu như không muốn thông báo nguyên nhân",
            type: "null",
            example: ""
		},
		{
			key: "tag => Nguyên nhân",
			prompt: "Nhập nguyên nhân để thông báo cho người tag",
            type: "string",
            example: "Bận đi ăn"
		}
	],
};

module.exports.event = ({ event, api, client }) => {
    if (!event.mentions || !client.afkList) return;
    const mention = Object.keys(event.mentions);
    if (client.afkList.has(event.senderID.toString())) {
        client.afkList.delete(event.senderID.toString());
        return api.sendMessage(`[ ${event.senderID} ] Đã tắt chế độ afk`, event.threadID, event.messageID);
    }
    for (const id of mention) {
        if (client.afkList.has(id)) {
            const reason = client.afkList.get(id.toString());
            return api.sendMessage(`Hiện tại người dùng ${event.mentions[id]} đang bận ${(typeof reason == "string") ? `với lý do: ${reason}` : ""}`, event.threadID, event.messageID);
        }
    }
}

module.exports.run = ({ event, api, client, args, utils }) => {
    if (!client.afkList) client.afkList = new Map();
    const content = args.slice(1, args.length);
    if (args[0] == "on") {
        client.afkList.set(event.senderID.toString(), content.join(" ") || null);
        return api.sendMessage(`[ ${event.senderID} ] Đã bật chế độ afk`, event.threadID, event.messageID);
    }
    else return utils.throwError("afk", event.threadID, event.messageID);
       
}

