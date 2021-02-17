module.exports.config = {
  name: "randomcolor",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BerVer",
  description: "Đổi màu sắc cuộc trò chuyện thành màu ngẫu nhiên",
  commandCategory: "system",
  usages: "randomcolor",
  cooldowns: 5,
  dependencies: []
};

module.exports.run = function({
  api,
  event,
  args,
  client,
  __GLOBAL
}) {
  var color = ['196241301102133', '169463077092846', '2442142322678320', '234137870477637', '980963458735625', '175615189761153', '2136751179887052', '2058653964378557', '2129984390566328', '174636906462322', '1928399724138152', '417639218648241', '930060997172551', '164535220883264', '370940413392601', '205488546921017', '809305022860427'];
  return api.changeThreadColor(color[Math.floor(Math.random() * color.length)], event.threadID, (err) => (err) ? api.sendMessage(`Đã có lỗi xảy ra!`, event.threadID, event.messageID) : '');
}