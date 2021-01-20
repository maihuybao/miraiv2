const logger = require("../../utils/log.js");

module.exports = function ({ models }) {
	const Currencies = models.use('Currencies');

	async function getAll(...data) {
		var where, attributes;
		for (let i of data) {
			if (typeof i != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
			if (Array.isArray(i)) attributes = i;
			else where = i;
		}
		try {
			return (await Currencies.findAll({ where, attributes })).map(e => e.get({ plain: true }));
		}
		catch (err) {
			logger(err, 2);
			return [];
		}
	}

	async function getData(userID) {
		const data = (await Currencies.findOne({ where: { userID }}));
		if (data) return data.get({ plain: true });
		else return null;
	}

	async function setData(userID, options = {}) {
		try {
			(await Currencies.findOne({ where: { userID } })).update(options);
			return true;
		}
		catch (e) {
			logger(err, 2);
			return false;
		}
	}

	async function delData(userID) {
		return (await Currencies.findOne({ where: { userID } })).destroy();
	}

	async function createData({ userID, defaults }) {
		if (typeof defaults != 'object') throw 'Phải là 1 Array hoặc Object hoặc cả 2.';
		try {
			(await Currencies.findOrCreate({ where: { userID }, defaults }))
			return true;
		}
		catch (e) {
			logger(e, 2);
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