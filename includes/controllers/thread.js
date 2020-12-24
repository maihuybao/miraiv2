const logger = require("../modules/log.js");
module.exports = function ({ models, api, __GLOBAL }) {
	const Thread = models.use('thread');

	async function getInfo(threadID) {
		return await api.getThreadInfo(threadID);
	}

	async function getAll(...data) {
		var where, attributes;
		for (let i of data) {
			if (typeof i != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			return (await Thread.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (err) {
			logger(err, 2);
			return [];
		}
	}

	async function getData(threadID, value) {
		return (await Thread.findOne({ where: { threadID } })).get({ plain: true })[value];
	}

	async function setData(threadID, options = {}) {
		try {
			(await Thread.findOne({ where: { threadID } })).update(options);
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	async function delData(threadID) {
		return (await Thread.findOne({ where: { threadID } })).destroy();
	}

	async function createData({ threadID, defaults }) {
		if (typeof defaults != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
		try {
			(await Thread.findOrCreate({ where: { threadID }, defaults }))
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	return {
		getInfo,
		getAll,
		getData,
		setData,
		delData,
		create
	}

}