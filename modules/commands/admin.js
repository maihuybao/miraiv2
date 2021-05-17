module.exports.config = {
	name: "admin",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Quản lý admin bot",
	commandCategory: "system",
	usages: "admin [list/add/remove] [args]",
    cooldowns: 5,
    info: [
		{
			key: 'list',
			prompt: 'Xem toàn bộ danh sách admin',
			type: 'String'
		},
        {
			key: 'add',
			prompt: 'Thêm admin vào danh sách admin, có thể sử dụng tag, reply',
			type: 'String',
			example: '10000000'
		},
        {
			key: 'remove',
			prompt: 'Xóa admin khỏi danh sách admin, có thể sử dụng tag, reply',
			type: 'String',
			example: '10000000'
		}
	],
};

module.exports.run = async ({ api, event, global, args, permssion, utils, client, Users }) => {
    const content = args.slice(1, args.length);
    const option = args[0];
    const { writeFileSync } = require("fs-extra");
    delete require.cache[require.resolve(client.dirConfig)];
    var config = require(client.dirConfig);

    if (option == "list") {
        const listAdmin = global.config.ADMINBOT;
        var msg = [];
        for (const id of listAdmin) {
            if (parseInt(id)) {
                const name = await Users.getNameUser(id);
                msg.push(`- ${name} - https://fb.me/${id}`);
            }
        }

        return api.sendMessage(`[Admin] Danh sách toàn bộ admin bot: \n${msg.join("\n")}`, event.threadID, event.messageID);
    }


    else if (option == "add" && permssion == 2) {
        if (event.type == "message_reply") {
            global.config.ADMINBOT.push(event.messageReply.senderID);
            config.ADMINBOT.push(event.messageReply.senderID);
            const name = (await Users.getData(event.messageReply.senderID)).name || "Người dùng facebook";
            writeFileSync(client.dirConfig , JSON.stringify(config, null, 4), 'utf8');
            return api.sendMessage(`[Admin] Đã thêm người dùng vào admin bot:\n+ [ ${event.messageReply.senderID} ] » ${name}`, event.threadID, event.messageID);
        }
        else if (Object.keys(event.mentions).length !== 0) {
            var listAdd = [];
            const mention = Object.keys(event.mentions);
            for (const id of mention) {
                global.config.ADMINBOT.push(id);
                config.ADMINBOT.push(id);
                listAdd.push(`+ [ ${id} ] » ${event.mentions[id]}`);
            }
            writeFileSync(client.dirConfig , JSON.stringify(config, null, 4), 'utf8');
            return api.sendMessage(`[Admin] Đã thêm người dùng vào admin bot:\n${listAdd.join("\n").replace(/\@/g, "")}`, event.threadID, event.messageID);
        }
        else if (content.length != 0 && !isNaN(content)) {
            global.config.ADMINBOT.push(content);
            config.ADMINBOT.push(content);
            const name = (await Users.getData(content)).name || "Người dùng facebook";
            writeFileSync(client.dirConfig , JSON.stringify(config, null, 4), 'utf8');
            return api.sendMessage(`[Admin] Đã thêm người dùng vào admin bot:\n+ [ ${content} ] » ${name}`, event.threadID, event.messageID);
        }
        else return utils.throwError(this.config.name, event.threadID, event.messageID);
    }

    else if (option == "remove" && permssion == 2) {
        if (event.type == "message_reply") {
            const index = config.ADMINBOT.findIndex(item => item == event.messageReply.senderID);
            if (index == -1) return api.sendMessage(`[Admin] Người dùng mang id ${event.messageReply.senderID} không tồn tại trong admin bot!`, event.threadID, event.messageID);
            global.config.ADMINBOT.splice(index, 1);
            config.ADMINBOT.splice(index, 1);
            const name = (await Users.getData(event.messageReply.senderID)).name || "Người dùng facebook";
            writeFileSync(client.dirConfig , JSON.stringify(config, null, 4), 'utf8');
            return api.sendMessage(`[Admin] Đã xóa người dùng khỏi admin bot:\n- [ ${event.messageReply.senderID} ] » ${name}`, event.threadID, event.messageID);
        }
        else if (event.mentions.length != 0) {
            var listAdd = [];
            const mention = Object.keys(event.mentions);
            for (const id of mention) {
                const index = config.ADMINBOT.findIndex(item => item == id);
                if (index == -1) return api.sendMessage(`[Admin] Người dùng mang id ${id} không tồn tại trong admin bot!`, event.threadID, event.messageID);
                global.config.ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                listAdd.push(`- [ ${id} ] » ${event.mentions[id]}`);
            }
            writeFileSync(client.dirConfig , JSON.stringify(config, null, 4), 'utf8');
            return api.sendMessage(`[Admin] Đã xóa người dùng khỏi admin bot:\n${listAdd.join("\n").replace(/\@/g, "")}`, event.threadID, event.messageID);
        }
        else if (!isNaN(content)) {
            const index = config.ADMINBOT.findIndex(item => item == event.messageReply.senderID);
            if (index == -1) return api.sendMessage(`[Admin] Người dùng mang id ${content} không tồn tại trong admin bot!`, event.threadID, event.messageID);
            global.config.ADMINBOT.splice(index, 1);
            config.ADMINBOT.splice(index, 1);
            const name = (await Users.getData(content)).name || "Người dùng facebook";
            writeFileSync(client.dirConfig , JSON.stringify(config, null, 4), 'utf8');
            return api.sendMessage(`[Admin] Đã xóa người dùng khỏi admin bot:\n- [ ${content} ] » ${name}`, event.threadID, event.messageID);
        }
        else return utils.throwError(this.config.name, event.threadID, event.messageID);
    }

    else return utils.throwError(this.config.name, event.threadID, event.messageID);
}