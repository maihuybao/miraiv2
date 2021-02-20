const request = require('request');
const fs = require('fs')

module.exports.config = {
  name: "hug",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Ôm người bạn tag",
  commandCategory: "general",
  usages: "hug [tag người bạn cần ôm]",
  cooldowns: 5,
  dependencies: ["request","fs"]
};

module.exports.run = function({
  api,
  event,
  args,
  client,
  __GLOBAL
}) {
  var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  if (!args.join(" ")) return out("Bạn chưa nhập tin nhắn");
  else
  return request('https://nekos.life/api/v2/img/hug', (err, response, body) => {
    let picData = JSON.parse(body);
    var mention = Object.keys(event.mentions)[0];
    let getURL = picData.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    let tag = event.mentions[mention].replace("@", "");
    let callback = function() {
      api.sendMessage({
        body: tag + ", I wanna hug you ❤️",
        mentions: [{
          tag: tag,
          id: Object.keys(event.mentions)[0]
        }],
        attachment: fs.createReadStream(__dirname + `/src/anime.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/src/anime.${ext}`), event.messageID);
    };
    request(getURL).pipe(fs.createWriteStream(__dirname + `/src/anime.${ext}`)).on("close", callback);
  });
}