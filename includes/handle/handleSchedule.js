const moment = require("moment");
module.exports = function({ api, __GLOBAL, client, models, Users, Threads, Currencies }) {
    setInterval(function () {
        const time = new Date(moment.tz("Asia/Ho_Chi_minh").toISOString()).getTime();
        var dataJob = client.schedule || [],
            spliced;

        for (const item of dataJob) {
            if (item.timestamp < time || item.passed) {
                const command = client.commands.get(item.commandName);
                try {
                    command.schedule({ event: item.event, api, __GLOBAL, client, models, Users, Threads, Currencies });
                    spliced = dataJob.filter(n => n.event.messageID !== item.event.messageID);
                    client.schedule = spliced;
                }
                catch (e) {
                    logger(e + " tại schedule: " + command.config.name, "error");
                }
            } else "";
        }
    }, 1000);
    return;
}