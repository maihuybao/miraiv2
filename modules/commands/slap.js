const request = require('request');
const fs = require('fs')
module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Tát người bạn tag",
  commandCategory: "general",
  usages: "slap [tag người bạn cần tát]",
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
  if (!args.join(" ")) return out("Bạn chưa Tag");
  return request('https://nekos.life/api/v2/img/slap', (err, response, body) => {
    let picData = JSON.parse(body);
    let getURL = picData.url;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    var mention = Object.keys(event.mentions)[0];
    let tag = event.mentions[mention].replace("@", "");
    let callback = function() {
      api.sendMessage({
        body: tag + ", take this slap 😈",
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