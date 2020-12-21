module.exports.config = {
    name: "fact",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Sunii",
    description: "Tạo twitter Trum",
    commandCategory: "group",
    usages: "fact [text]",
    cooldowns: 10,
    dependencies: ["canvas", "axios", "fs-extra"]
};

module.exports.run = async function({ api, event, args, client, __GLOBAL }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas, Canvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios")
  let pathImg = __dirname + '/cache/trum.png';
  var text = args.join(" ");
  if (!text) return api.sendMessage("Nhập nội dung cần tạo", threadID, messageID);
  let getTrum = (await axios.get(`https://imgur.com/5kZjo1t.png`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(getTrum, 'utf-8'));
  let baseImage = await loadImage(pathImg);
      let canvas = createCanvas(baseImage.width, baseImage.height);
      let ctx = canvas.getContext("2d");
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
      ctx.font = "400 15px Segoe UI";
      ctx.fillStyle = "#0f1419";
      ctx.textAlign = "start";
			let fontSize = 15;
			while (ctx.measureText(content).width > 650) {
				fontSize--;
				ctx.font = `400 ${fontSize}px Segoe UI, sans-serif`;
			}
			const lines = await Image.wrapText(ctx, text, 580);
			ctx.fillText(lines.join('\n'), 19,91);
      ctx.beginPath();
      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(pathImg, imageBuffer);
  return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);        
}
