module.exports.config = {
	name: "gif",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "CatalizCS",
	description: "lấy ảnh gif",
	commandCategory: "group",
	usages: "gif bomman",
	cooldowns: 5,
	dependencies: ["request","fs-extra"]
};

module.exports.handleReaction = function({ api, event, args, client, __GLOBAL }) {
	//Làm cái gì ở đây tuỳ thuộc vào bạn ¯\_(ツ)_/¯ 
}

module.exports.handleReply = function({ api, event, args, client, __GLOBAL }) {
	//Làm cái gì ở đây tuỳ thuộc vào bạn ¯\_(ツ)_/¯ 
}

module.exports.event = function({ api, event, client, __GLOBAL }) {
	//Làm cái gì ở đây tuỳ thuộc vào bạn ¯\_(ツ)_/¯ 
}

module.exports.run = function({ api, event, args, client, __GLOBAL }) {
        var content = args.join(" ");
        var fs = require("fs-extra");
        var request = require("request");
        var { threadID, messageID } = event
        if (content.length == -1) return api.sendMessage("Chưa nhập đúng tag", threadID, messageID);
        if (content.indexOf(`cat`) !== -1) {
          return request(`https://api.tenor.com/v1/random?key=${__GLOBAL.settings.TENOR}&q=cat&limit=1`, (err, response, body) => {
            if (err) throw err;
            var string = JSON.parse(body);
            var stringURL = string.results[0].media[0].tinygif.url;
            request(stringURL).pipe(fs.createWriteStream(__dirname + `/cache/randompic.gif`)).on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/randompic.gif") }, threadID, () => fs.unlinkSync(__dirname + "/cache/randompic.gif"), messageID));
          });
        }
        else if (content.indexOf(`dog`) == 0) {
          return request(`https://api.tenor.com/v1/random?key=${__GLOBAL.settings.TENOR}&q=dog&limit=1`, (err, response, body) => {
            if (err) throw err;
            var string = JSON.parse(body);
            var stringURL = string.results[0].media[0].tinygif.url;
            request(stringURL).pipe(fs.createWriteStream(__dirname + "/cache/randompic.gif")).on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/randompic.gif") }, threadID, () => fs.unlinkSync(__dirname + "/cache/randompic.gif"), messageID));
          });
        }
        else if (content.indexOf(`capoo`) == 0) {
          return request(`https://api.tenor.com/v1/random?key=${__GLOBAL.settings.TENOR}&q=capoo&limit=1`, (err, response, body) => {
            if (err) throw err;
            var string = JSON.parse(body);
            var stringURL = string.results[0].media[0].tinygif.url;
            request(stringURL).pipe(fs.createWriteStream(__dirname + "/cache/randompic.gif")).on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/randompic.gif") }, threadID, () => fs.unlinkSync(__dirname + "/cache/randompic.gif"), messageID));
          });
        }
        else if (content.indexOf(`mixi`) == 0) {
          return request(`https://api.tenor.com/v1/random?key=${__GLOBAL.settings.TENOR}&q=mixigaming&limit=1`, (err, response, body) => {
            if (err) throw err;
            var string = JSON.parse(body);
            var stringURL = string.results[0].media[0].tinygif.url;
            request(stringURL).pipe(fs.createWriteStream(__dirname + "/cache/randompic.gif")).on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/randompic.gif") }, threadID, () => fs.unlinkSync(__dirname + "/cache/randompic.gif"), messageID));
          });
        }
        else if (content.indexOf(`bomman`) == 0) {
          return request(`https://api.tenor.com/v1/random?key=${__GLOBAL.settings.TENOR}&q=bommanrage&limit=1`, (err, response, body) => {
            if (err) throw err;
            var string = JSON.parse(body);
            var stringURL = string.results[0].media[0].tinygif.url;
            request(stringURL).pipe(fs.createWriteStream(__dirname + "/cache/randompic.gif")).on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/randompic.gif") }, threadID, () => fs.unlinkSync(__dirname + "/cache/randompic.gif"), messageID));
          });
        }
        else return api.sendMessage("Bạn nhập sai tag", threadID, messageID);
}		
