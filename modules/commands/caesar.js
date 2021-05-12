module.exports.config = {
    name: "caesar",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SpermLord",
    description: "Mã hóa đoạn văn bản của bạn trở thành Mật Mã Caesar",
    commandCategory: "cipher",
    usages: "caesar [encode/decode] [đoạn text cần mã hóa]",
    cooldowns: 5,
    dependencies: ["caesar-salad"],
    envConfig: {
        "caeserPassword": "266303"
    }
};

module.exports.run = function({ api, event, args, global, utils }) {
    const Caesar = require('caesar-salad').Caesar;
    var content = args.join(" ");
    if (event.type == "message_reply") (content.indexOf('encode') == 0) ? api.sendMessage(Caesar.Cipher(global["caesar"].caeserPassword).crypt(event.messageReply.body), event.threadID, event.messageID) : (content.indexOf('decode') == 0) ? api.sendMessage(Caesar.Decipher(global["caesar"].caeserPassword).crypt(event.messageReply.body), event.threadID, event.messageID) : utils.throwError("caesar", event.threadID, event.messageID)
    else (content.indexOf('encode') == 0) ? api.sendMessage(Caesar.Cipher(global["caesar"].caeserPassword).crypt(`${args.slice(1, args.length)}`), event.threadID, event.messageID) : (content.indexOf('decode') == 0) ? api.sendMessage(Caesar.Decipher(global["caesar"]).crypt(`${args.slice(1, args.length)}`), event.threadID, event.messageID) : utils.throwError("caesar", event.threadID, event.messageID);
}