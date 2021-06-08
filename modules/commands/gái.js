const axios = require('axios');
const request = require('request');
const fs = require('fs')

module.exports.config = {
  name: "gai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Ngắm gái",
  commandCategory: "random-img",
  usages: "gai",
  cooldowns: 5,
  dependencies: ["axios","fs","request"]
};

module.exports.run = function({api,event,args,client,__GLOBAL
}) {


return api.sendMessage({data:'Ảnh của bạn đây',attachment:(await axios({url: (await axios("https://api.vangbanlanhat.tk/image?type=gai")).data.data, method: "GET", responseType: "stream"})).data})

}