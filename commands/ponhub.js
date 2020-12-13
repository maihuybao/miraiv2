module.exports.config = {
    name: "phub",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "MewMew",
    description: "Commnet trên pỏnhub ( ͡° ͜ʖ ͡°)",
    commandCategory: "group",
    usages: "phub [text]",
    cooldowns: 10,
    dependencies: ["canvas", "axios", "fs-extra"]
};

module.exports.run = async function({ api, event, args, client, __GLOBAL }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios")
  let avatar = __dirname + '/cache/avt.png';
  let pathImg = __dirname + '/cache/porn.png';
  var text = args.join(" ");
  let name = (await api.getUserInfo(senderID))[senderID].name
  var linkAvatar = (await api.getUserInfo(senderID))[senderID].thumbSrc;
  if (!text) return api.sendMessage("Nhập nội dung comment trên pỏnhub", threadID, messageID);
  let getAvatar = (await axios.get(linkAvatar, { responseType: 'arraybuffer' })).data;
  let getPorn = (await axios.get(`https://imgur.com/e74KizU`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));
  fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
  let image = await loadImage(avatar);
  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 30, 310, 70, 70);
  ctx.font = "32px Arial";
  ctx.fillStyle = "#F99600";
  ctx.textAlign = "start";
  ctx.fillText(name, 115, 350);
  ctx.font = "32px Arial";
  ctx.fillStyle = "#CCCCCC";
  ctx.textAlign = "start";
  ctx.fillText(text, 30, 430);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(avatar);
  return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);        
}
