module.exports = function({ api, models, Users, Threads, Currencies }) {
    const moment = require("moment-timezone");
    const logger = require("../../utils/log");
    
    setInterval(function () {
        const time = moment().utcOffset("+07:00").unix();

        const { handleSchedule, commands } = global.client;

        var dataJob = handleSchedule,
            spliced;

        for (const scheduleItem of dataJob) {
            if (scheduleItem.timestamp < time || scheduleItem.passed) {
                const command = commands.get(scheduleItem.commandName);
                try { command.handleSchedule({ event: scheduleItem.event, api, models, Users, Threads, Currencies, scheduleItem }) }
                catch (e) { logger(e + " tại schedule: " + command.config.name, "error") }
                
                spliced = dataJob.filter(function (item) { return item.event.messageID !== item.event.messageID });
                handleSchedule = spliced;
            }
        }
    }, 1000);
    return;
};