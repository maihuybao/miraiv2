module.exports.config = {
    name: "morse",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SpermLord",
    description: "Mã hoá đoạn văn bản của bạn trở thành mã morse",
    commandCategory: "cipher",
    usages: "morse [encode hoặc decode] [đoạn text ASCII cần mã hoá]",
    cooldowns: 5,
    dependencies: ["morsify"],
};

module.exports.run = function({ api, event, args, utils }) {
    /*var content = args.join(" ");
    const morsify = require('morsify');
	if (event.type == "message_reply") (content.indexOf('encode') == 0) ? api.sendMessage(morsify.encode(event.messageReply.body), event.threadID, event.messageID) : (content.indexOf('decode') == 0) ? api.sendMessage(morsify.decode(event.messageReply.body), event.threadID, event.messageID) : utils.throwError("morse", event.threadID, event.messageID);
	else (content.indexOf('encode') == 0) ? api.sendMessage(morsify.encode(`${args.slice(1, args.length)}`), event.threadID, event.messageID) : (content.indexOf('decode') == 0) ? api.sendMessage(morsify.decode(`${args.slice(1, args.length)}`), event.threadID, event.messageID) : utils.throwError("morse", event.threadID, event.messageID);
    */
   const morsify = require("morsify");
   switch (event.type) {
       case "message_reply": {
        const content = event.messageReply.body || "";
           switch (args[0]) {
               case "encode":
                   case "en": {
                       return api.sendMessage(morsify.encode(content), event.threadID, event.messageID);
                   }
                case "decode":
                    case "de": {
                        return api.sendMessage(morsify.decode(content), event.threadID, event.messageID);
                    }
               default:
                    return utils.throwError("morse", event.threadID, event.messageID);
           }
       }
       default: {
           const content = args.slice(1, args.length);
            switch (args[0]) {
                case "encode":
                    case "en": {
                        return api.sendMessage(morsify.encode(content), event.threadID, event.messageID);
                    }
                case "decode":
                    case "de": {
                        return api.sendMessage(morsify.decode(content), event.threadID, event.messageID);
                    }
                default:
                    return utils.throwError("morse", event.threadID, event.messageID);
            }
       }
   }
}