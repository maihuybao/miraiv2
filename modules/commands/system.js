module.exports.config = {
    name: "system",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "CatalizCS",
    description: "Xem thông tin phần cứng mà bot đang sử dụng",
    commandCategory: "system",
    usages: "system",
    cooldowns: 5,
    dependencies: ["systeminformation"]
};

module.exports.byte2mb = (bytes) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(bytes, 10) || 0;
    while(n >= 1024 && ++l){
        n = n/1024;
    }
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

module.exports.run = async function({ api, event }) {
    const systemInfo = require("systeminformation"),
            timeStart = Date.now();
    
    try {
        var cpuInfo = await systemInfo.cpu(),
                cpuTemperature = await systemInfo.cpuTemperature(),
                currentLoad = await systemInfo.currentLoad(),
                diskInfo = await systemInfo.diskLayout(),
                memInfo = await systemInfo.memLayout(),
                mem = await systemInfo.mem(),
                osInfo = await systemInfo.osInfo()
                time = process.uptime(),
                hours = Math.floor(time / (60 * 60)),
                minutes = Math.floor((time % (60 * 60)) / 60),
                seconds = Math.floor(time % 60);

        if (hours   < 10) hours = "0"+hours;
        if (minutes < 10) minutes = "0"+minutes;
        if (seconds < 10) seconds = "0"+seconds;

        return api.sendMessage(
            "====== System Info ======" +
            "‏‏‎\n‎==== CPU ====" +
            "\nCPU Model: " + cpuInfo.manufacturer + cpuInfo.brand +
            "\nSpeed: " + cpuInfo.speed + "GHz" +
            "\nCores: " + cpuInfo.cores +
            "\nTemperature: " + cpuTemperature.main + "°C" +
            "\nLoad: " + currentLoad.currentLoad.toFixed(1) + "%" +
            "\n==== MEMORY ====" +
            "\nSize: " + this.byte2mb(memInfo[0].size) + 
            "\nType: " + memInfo[0].type +
            "\nTotal: " + this.byte2mb(mem.total) +
            "\nAvailable: " + this.byte2mb(mem.available) +
            "\n==== DISK ====" +
            "\nName: " + diskInfo[0].name +
            "\nSize: " + this.byte2mb(diskInfo[0].size) +
            "\nTemperature: " + diskInfo[0].temperature + "°C" +
            "\n==== OS ====" +
            "\nPlatform: " + osInfo.platform +
            "\nBuild: " + osInfo.build +
            "\nUptime: " + hours + ":" + minutes + ":" + seconds +
            "\nPing: " + (Date.now() - timeStart) + "ms",
        event.threadID, event.messageID)
    }
    catch (e) {
        console.log(e)
    }
}