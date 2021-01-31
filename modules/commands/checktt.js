const currencies = require("../../includes/database/models/currencies");

module.exports.config = {
	name: "checktt",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "dik",
	commandCategory: "Group",
	usages: "checktt [args]",
	cooldowns: 5,
	info: [
		{
			key: 'args',
			prompt: ' ¯\\_(ツ)_/¯  ',
			type: 'Văn Bản',
			example: ''
		}
	]
};

module.exports.run = async ({ client, api, event, args, utils, Currencies }) => {
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