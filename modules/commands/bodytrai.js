const axios = require('axios');
const request = require('request');
const fs = require('fs')

module.exports.config = {
  name: "bodytrai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Ngắm Body trai",
  commandCategory: "general",
  usages: "bodytrai",
  cooldowns: 5,
  dependencies: ["axios","fs","request"]
};

module.exports.run = function({api,event,args,client,__GLOBAL
}) {
  return (async () => {
    let data = (await axios.get('https://api.sunii.ml/api/trai')).data;
    let getUrl = data.data.url;

    var callback = () => api.sendMessage({
      attachment: fs.createReadStream(__dirname + "/src/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/src/1.png"));
    return request(encodeURI(`${getUrl}`)).pipe(fs.createWriteStream(__dirname + '/src/1.png')).on('close', () => callback());
    console.log(rq)
  })();
}