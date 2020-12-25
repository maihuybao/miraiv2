const logger = require("../../utils/log.js");
module.exports = function ({ models, api, __GLOBAL }) {
	const Currency = models.use('currency');

	async function getAll(...data) {
		var where, attributes;
		for (let i of data) {
			if (typeof i != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			return (await Currency.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (err) {
			logger(err, 2);
			return [];
		}
	}

	async function getData({ threadID, userID, value }) {
		return (await Currency.findOne({ where: { threadID, userID } })).get({ plain: true })[value];
	}

	async function setData(threadID, userID, options = {}) {
		try {
			(await Currency.findOne({ where: { threadID, userID } })).update(options);
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	async function delData(threadID, userID) {
		return (await Currency.findOne({ where: { threadID, userID } })).destroy();
	}

	async function createData({ threadID, userID, defaults }) {
		if (typeof defaults != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
		try {
			(await Currency.findOrCreate({ where: { threadID, userID }, defaults }))
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	return {
		getAll,
		getData,
		setData,
		delData,
		createData
	}

}