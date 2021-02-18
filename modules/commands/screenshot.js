module.exports.config = {
	name: "screenshot",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Screenshot một trang web nào đó (NOT ALLOW NSFW PAGE)",
	commandCategory: "other",
	usages: "screenshot site",
	cooldowns: 5,
	dependencies: ["request","fs-extra"]
};

module.exports.run = ({ event, api, args, client }) => {
    const request = require("request");
    const fs = require("fs-extra");
    const url = require('url');

    if (!client.pornList) request('https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt', (error, Response, body) => client.pornList = body.split('\n').filter(site => site && !site.startsWith('#')).map(site => site.replace(/^(0.0.0.0 )/, '')));
    
    let pornList = client.pornList;
    let urlParsed = url.parse(args[0]);

    if (pornList.some(pornURL => urlParsed.host == pornURL)) return api.sendMessage("Trang web bạn nhập không an toàn!!(NSFW PAGE)", event.threadID, event.messageID);

    try {
        return request(`https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`)
            .pipe(fs.createWriteStream(__dirname + `/cache/${event.senderID}-ss.png`))
            .on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}-ss.png`) }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}-ss.png`)));
    }
    catch {
        return api.sendMessage("Không tìm thấy url này, định dạng không đúng ?", event.threadID, event.messageID);
    }
}