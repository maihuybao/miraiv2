const axios = require('axios');
const fs = require('fs');
const request = require('request')

module.exports.config = {
  name: "box",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Kiểm tra thông tin nhóm chat",
  commandCategory: "general",
  usages: "boxinfo",
  cooldowns: 10,
  dependencies: ["fs","axios"]
};

module.exports.run = async function({
  api,
  event,
  args,
  client,
  __GLOBAL,
  threadID
}) {
  let threadInfo = await api.getThreadInfo(event.threadID);
  var input=args[0]
  if (input==""){api.sendMessage("Bạn chưa nhập thẻ,hãy sử dụng các thẻ sau:name/image/emoji")}
  if (input=="info"){
  let sex = threadInfo.approvalMode;
  var pd = sex == false ? "Đang tắt" : sex == true ? "Đang bật" : "Không phải Thread";
  var callback = () => api.sendMessage({
    body: `Tên: ${threadInfo.threadName}\nID Thread: ${threadInfo.threadID}\nPhê duyệt thành viên: ${pd}\nEmoji: ${threadInfo.emoji}\nThông tin: \n`
    +`+Số thành viên :${threadInfo.participantIDs.length}\n`
    +`+Số quản trị viên ${threadInfo.adminIDs.length}\n`
    +`+Tổng số tin nhắn: ${threadInfo.messageCount}\n`,
    attachment: fs.createReadStream(__dirname + "/src/2.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/src/2.png"));
  	if (ten = threadInfo.threadName == null){var ten = "Chưa đặt tên"}
  	if (emg = threadInfo.emoji == null){var emg = "(y)"}
    var callback2 = () => api.sendMessage({
    body: `Tên: ${ten}\nID Thread: ${threadInfo.threadID}\nPhê duyệt thành viên: ${pd}\nEmoji: ${emg}\nThông tin: \n`
    +`+Số thành viên :${threadInfo.participantIDs.length}\n`
    +`+Số quản trị viên ${threadInfo.adminIDs.length}\n`
    +`+Tổng số tin nhắn: ${threadInfo.messageCount}\n`}, event.threadID)
  if(avt = threadInfo.imageSrc == null)
  	{return callback2()}
  else
  	{return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname+'/src/2.png')).on('close',() => callback())}
}
if (input=="setname"){
clone= args.join(" ");
  api.setTitle(clone.slice(7),event.threadID)
}
if (input=="image"){var cb = () => api.sendMessage({attachment: fs.createReadStream(__dirname + "/src/2.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/src/2.png"))
  request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname+'/src/2.png')).on('close',() => cb())
return cb()
}}