const request = require('request');
const fs = require('fs')
module.exports.config = {
  name: "meow",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Lệnh random những con mèo :D!",
  commandCategory: "media",
  usages: "meow",
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
  return request('http://aws.random.cat/meow', (err, response, body) => {
    let picData = JSON.parse(body);
    let getURL = picData.file;
    let ext = getURL.substring(getURL.lastIndexOf(".") + 1);
    let callback = function() {
      api.sendMessage({
        attachment: fs.createReadStream(__dirname + `/cache/meow.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/meow.${ext}`), event.messageID);
    };
    request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/meow.${ext}`)).on("close", callback);
  });
}