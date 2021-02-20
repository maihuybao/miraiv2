const axios = require('axios');
const request = require('request');
const fs = require('fs')

module.exports.config = {
  name: "cosplay",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Ngắm cosplay",
  commandCategory: "general",
  usages: "cosplay",
  cooldowns: 5,
  dependencies: ["axios","fs","request"]
};

module.exports.run = function({api,event,args,client,__GLOBAL
}) {
  return (async () => {
    let {
      data
    } = await axios.get('https://api.simsimi.tk/cosplay.php');
    var callback = () => api.sendMessage({
      attachment: fs.createReadStream(__dirname + "/src/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/src/1.png"));
    return request(encodeURI(`${data.link}`)).pipe(fs.createWriteStream(__dirname + '/src/1.png')).on('close', () => callback());
  })();
}