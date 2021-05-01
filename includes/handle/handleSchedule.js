module.exports = function({ api, __GLOBAL, client, models, Users, Threads, Currencies }) {
    const moment = require("moment-timezone");
    const logger = require("../../utils/log");
    
    setInterval(function () {
        const time = moment().utcOffset("+07:00").unix();
        var dataJob = client.schedule || [],
            spliced;

        for (const item of dataJob) {
            if (item.timestamp < time || item.passed) {
                const command = client.commands.get(item.commandName);
                try {
                    command.schedule({ event: item.event, api, __GLOBAL, client, models, Users, Threads, Currencies, schedule: item });
                    spliced = dataJob.filter(n => n.event.messageID !== item.event.messageID);
                    client.schedule = spliced;
                }
                catch (e) {
                    logger(e + " tại schedule: " + command.config.name, "error");
                    spliced = dataJob.filter(n => n.event.messageID !== item.event.messageID);
                    client.schedule = spliced;
                }
            } else "";
        }
    }, 1000);
    return;
}