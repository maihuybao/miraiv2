module.exports.config = {
	name: "roleplay",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "Hun, ôm, ... đủ thứ trò in here!",
	commandCategory: "random-img",
	usages: "roleplay on/off",
	cooldowns: 1,
	dependencies: ['request', 'fs-extra']
};

module.exports.event = ({ event, api, client }) => {
    const request = require("request");
    const { readFileSync, createReadStream, createWriteStream, unlinkSync } = require("fs-extra");
    let settings = client.threadSetting.get(event.threadID) || {};
    let mention = Object.keys(event.mentions);
    if (!settings["roleplay"] || !settings || mention.length == 0) return;
    let animeData = JSON.parse(readFileSync(__dirname + "/cache/anime.json"));
    if (event.body.indexOf("hug") == 0 || event.body.indexOf("ôm") == 0) {
        for (const id of mention) {
            request(animeData["hug"], (error, response, body) => {
                let picData = JSON.parse(body);
				let getURL = picData.data.response.url;
				let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                request(getURL).pipe(createWriteStream(__dirname + `/cache/${id}.${ext}`)).on("close", () => api.sendMessage({ body: event.mentions[id] + ", I wanna hug you ❤️", mentions: [{ tag: event.mentions[id], id: id }], attachment: createReadStream(__dirname + `/cache/${id}.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.${ext}`), event.messageID));
            })
        }
        return;
    }
    if (event.body.indexOf("kiss") == 0 || event.body.indexOf("hôn") == 0 || event.body.indexOf("hun") == 0) {
        for (const id of mention) {
            request(animeData["kiss"], (error, response, body) => {
                let picData = JSON.parse(body);
				let getURL = picData.data.response.url;
				let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                request(getURL).pipe(createWriteStream(__dirname + `/cache/${id}.${ext}`)).on("close", () => api.sendMessage({ body: event.mentions[id] + ", I wanna kiss you ❤️", mentions: [{ tag: event.mentions[id], id: id }], attachment: createReadStream(__dirname + `/cache/${id}.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.${ext}`), event.messageID));
            })
        }
        return;
    }
    if (event.body.indexOf("feed") == 0 || event.body.indexOf("đút") == 0 || event.body.indexOf("banh họng ra") == 0 || event.body.indexOf("mớm") == 0) {
        for (const id of mention) {
            request(animeData["feed"], (error, response, body) => {
                let picData = JSON.parse(body);
				let getURL = picData.data.response.url;
				let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                request(getURL).pipe(createWriteStream(__dirname + `/cache/${id}.${ext}`)).on("close", () => api.sendMessage({ body: event.mentions[id] + ", say 'Ahhh'", mentions: [{ tag: event.mentions[id], id: id }], attachment: createReadStream(__dirname + `/cache/${id}.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.${ext}`), event.messageID));
            })
        }
        return;
    }
    if (event.body.indexOf("pat") == 0 || event.body.indexOf("xoa đầu") == 0) {
        for (const id of mention) {
            request(animeData["pat"], (error, response, body) => {
                let picData = JSON.parse(body);
				let getURL = picData.data.response.url;
				let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                request(getURL).pipe(createWriteStream(__dirname + `/cache/${id}.${ext}`)).on("close", () => api.sendMessage({ body: event.mentions[id] + ", ...", mentions: [{ tag: event.mentions[id], id: id }], attachment: createReadStream(__dirname + `/cache/${id}.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.${ext}`), event.messageID));
            })
        }
        return;
    }
    if (event.body.indexOf("slap") == 0 || event.body.indexOf("tát") == 0 || event.body.indexOf("vả") == 0) {
        for (const id of mention) {
            request(animeData["slap"], (error, response, body) => {
                let picData = JSON.parse(body);
				let getURL = picData.data.response.url;
				let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                request(getURL).pipe(createWriteStream(__dirname + `/cache/${id}.${ext}`)).on("close", () => api.sendMessage({ body: event.mentions[id] + ", take my slap, b*tch", mentions: [{ tag: event.mentions[id], id: id }], attachment: createReadStream(__dirname + `/cache/${id}.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.${ext}`), event.messageID));
            })
        }
        return;
    }
    if (event.body.indexOf("poke") == 0 || event.body.indexOf("chọc") == 0) {
        for (const id of mention) {
            request(animeData["poke"], (error, response, body) => {
                let picData = JSON.parse(body);
				let getURL = picData.data.response.url;
				let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
                request(getURL).pipe(createWriteStream(__dirname + `/cache/${id}.${ext}`)).on("close", () => api.sendMessage({ body: event.mentions[id] + ", HEHEHE", mentions: [{ tag: event.mentions[id], id: id }], attachment: createReadStream(__dirname + `/cache/${id}.${ext}`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.${ext}`), event.messageID));
            })
        }
        return;
    }
}

module.exports.run = async ({ event, api, args, Threads, client, utils }) => {
    if (args.length == 0) return api.sendMessage("Input không được để trống", event.threadID, event.messageID);
    let settings = (await Threads.getData(event.threadID)).settings;
    switch (args[0]) {
        case "on": {
            settings["roleplay"] = true;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("Đã bật roleplay!", event.threadID);
            break;
        }
        case "off": {
            settings["roleplay"] = false;
            await Threads.setData(event.threadID, options = { settings });
            client.threadSetting.set(event.threadID, settings);
            api.sendMessage("Đã tắt roleplay!", event.threadID);
            break;
        }
    
        default: {
            utils.throwError("roleplay", event.threadID, event.messageID);
            break;
        }
    }
}