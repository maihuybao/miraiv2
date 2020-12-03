module.exports = {
	apps: [
		{
			name: 'SpermLiz Client ', 
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
			env: {
				"NODE_ENV": "production"
			}
		}
	]
};