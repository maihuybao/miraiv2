lconst axios = require('axios');
const request = require('request');
const fs = require('fs')

module.exports.config = {
  name: "image",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "trai",
  commandCategory: "random-img",
  usages: "trai",
  cooldowns: 5,
  dependencies: ["axios","fs","request"]
};

module.exports.run = function({api,event,args,client,__GLOBAL
}) {
	
}