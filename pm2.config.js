module.exports = {
	apps: [
		{
			name: 'MiraiBot',
			script: './mirai.js',
			autorestart: true,
			exec_mode: 'cluster',
			pmx: false,
			vizion: false,
			cwd: __dirname,
			instances: 1,
			watch: false,
			merge_logs: true,
			log_file: "logs/pm2_child.log",
			error_file: "logs/pm2_error.log",
			out_file: "logs/pm2_child_out.log",
			exec_interpreter: "node",
			args : 'config.json'
		}
	]
};