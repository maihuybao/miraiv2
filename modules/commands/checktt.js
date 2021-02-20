module.exports.config = {
	name: "checktt",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "dik",
	commandCategory: "Group",
	usages: "checktt args",
	cooldowns: 5,
	info: [
		{
			key: 'args => all',
			prompt: 'Kiểm tra lượt tương tác của toàn bộ thành viên',
			type: 'String',
			example: ''
		},
        {
            key: "args => Tag một người nào đó!",
            prompt: "Kiểm tra lượt tương tác người bạn tag",
            type: "Mention",
            example: "@MiraiBot"
        },
        {
            key: "args => để trống",
            prompt: "Kiểm tra lượt tương tác của bản thân",
            type: "AIR",
            example: ""
        }
	],
    envConfig: {
        "maxColumn": 10
    }
};

module.exports.run = async ({ args, api, event, __GLOBAL, Currencies }) => {
    var mention = Object.keys(event.mentions);
    if (args[0] == "all") {
        let data = await api.getThreadInfo(event.threadID);
        let number = 0, msg = "", storage = [], exp = [];
        for (const value of data.userInfo) {
            storage.push({"id" : value.id, "name": value.name});
            //console.log(value.id);
        }
        for (const user of storage) {
            const countMess = await Currencies.getData(user.id);
            exp.push({"name" : user.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp});
        }
        exp.sort((a, b) => {
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
        });
        for (const lastData of exp) {
            number++;
            msg += `${number}. ${lastData.name} với ${lastData.exp} tin nhắn \n`;
        }
        return api.sendMessage(msg, event.threadID);
    }
    else if (mention[0]) {
        let data = await api.getThreadInfo(event.threadID);
        let storage = [], exp = [];
        for (const value of data.userInfo) {
            storage.push({"id" : value.id, "name": value.name});
            //console.log(value.id);
        }
        for (const user of storage) {
            const countMess = await Currencies.getData(user.id);
            exp.push({"name" : user.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp, "uid": user.id});
        }
        exp.sort((a, b) => {
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
            if (a.id > b.id) return 1;
		    if (a.id < b.id) return -1;
        });
        console.log(JSON.stringify(exp, null, 4))
        let rank = exp.findIndex(info => parseInt(info.uid) == parseInt(mention[0])) + 1;
        let infoUser = exp[rank - 1];
        return api.sendMessage(`${infoUser.name} đứng hạng ${rank} với ${infoUser.exp} tin nhắn`, event.threadID);
    }
    else {
        let data = await api.getThreadInfo(event.threadID);
        let storage = [], exp = [];
        for (const value of data.userInfo) {
            storage.push({"id" : value.id, "name": value.name});
            //console.log(value.id);
        }
        for (const user of storage) {
            const countMess = await Currencies.getData(user.id);
            exp.push({"name" : user.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp, "uid": user.id});
        }
        exp.sort((a, b) => {
            if (a.exp > b.exp) return -1;
            if (a.exp < b.exp) return 1;
            if (a.id > b.id) return 1;
		    if (a.id < b.id) return -1;
        });
        let rank = exp.findIndex(info => parseInt(info.uid) == parseInt(event.senderID)) + 1;
        let infoUser = exp[rank - 1];
        return api.sendMessage(`Bạn đứng hạng ${rank} với ${infoUser.exp} tin nhắn`, event.threadID);
    }
}