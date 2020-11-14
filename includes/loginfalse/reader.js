const { createInterface } = require('readline');
const { once } = require('events');

const reader = async () => {
	var rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});
}