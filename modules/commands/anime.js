module.exports.config = {
	name: "anime",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Mirai Team",
	description: "Random lấy ảnh anime! (Safe For Work)",
	commandCategory: "random-img",
	usages: "[tag]",
    cooldowns: 5,
	dependencies: {
        "request": "",
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = async function () {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, readFileSync } = global.nodemodule["fs-extra"];

    const path = resolve(__dirname, 'cache', 'anime.json');
    const url = "https://raw.githubusercontent.com/catalizcs/storage-data/master/anime/anime.json";

    try {
        if (!existsSync(path)) await global.client.utils.downloadFile(url, path);

        const data = JSON.parse(readFileSync(path));

        if (data.length == 0) await global.client.utils.downloadFile(url, path);
        return;
    } catch (error) { await global.client.utils.downloadFile(url, path) };
    
};

module.exports.run = function({ event, api, args }) {
    const { readFileSync, createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const { threadID, messageID, senderID } = event;
    const animeData = JSON.parse(readFileSync(__dirname + "/cache/anime.json"));

    if (!animeData.hasOwnProperty(args[0])) {
        var list = [];
        Object.keys(animeData).forEach(endpoint => list.push(endpoint));
        return api.sendMessage(`=== Tất cả các tag của Anime ===\n${list.join(", ")}`, event.threadID, event.messageID);
    }

    else return request(animeData[args[0]], async (error, response, body) => {
        const { resolve } = global.nodemodule["path"];
        const picData = JSON.parse(body);

        var urlGet = "";

        (!picData.data) ? urlGet = picData.url : urlGet = picData.data.response.url;
        const ext = urlGet.substring(urlGet.lastIndexOf(".") + 1);
        const path = resolve(__dirname, 'cache', `${threadID}_${senderID}.${ext}`);
        
        await global.client.utils.downloadFile(urlGet, path);

        return api.sendMessage({
            attachment: createReadStream(path)
        }, threadID,  function () { return unlinkSync(path) }, messageID);

    });
};