module.exports = function({ api, global, client, models, Users, Threads, Currencies }) {
    const moment = require("moment-timezone");
    const logger = require("../../utils/log");
    
    setInterval(function () {
        const time = moment().utcOffset("+07:00").unix();
        var dataJob = client.schedule || [],
            spliced;

        for (const scheduleItem of dataJob) {
            if (scheduleItem.timestamp < time || scheduleItem.passed) {
                const command = client.commands.get(scheduleItem.commandName);
                try {
                    command.schedule({ event: scheduleItem.event, api, global, client, models, Users, Threads, Currencies, scheduleItem });
                    spliced = dataJob.filter(function (item) { return item.event.messageID !== item.event.messageID });
                    client.schedule = spliced;
                }
                catch (e) {
                    logger(e + " tại schedule: " + command.config.name, "error");
                    spliced = dataJob.filter(function (item) { return item.event.messageID !== item.event.messageID });
                    client.schedule = spliced;
                }
            }
        }
    }, 1000);
    return;
};