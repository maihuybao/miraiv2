const axios = require('axios');
const request = require('request');
const fs = require('fs')

module.exports.config = {
  name: "gái",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Ngắm gái",
  commandCategory: "general",
  usages: "girl",
  cooldowns: 5,
  dependencies: ["axios","fs","request"]
};

module.exports.run = function({api,event,args,client,__GLOBAL
}) {
  return (async () => {
    let {
      data
    } = await axios.get('https://api.simsimi.tk/girl.php');
    var callback = () => api.sendMessage({
      attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
    return request(encodeURI(`${data.link}`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
  })();
}
