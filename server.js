// const cluster = require('cluster');
// const os = require('os');
// const express = require('express');
// const totalCPUs = os.cpus().length;
// if(cluster.isPrimary) {
// 	for(let i = 0; i <= totalCPUs - 1; ++i) {
// 		cluster.fork();
// 	}
// }
// else {
// 	require('./index.js');
// }
// cluster.on('exit', (worker, code, signal) => {
// 	console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
// 	console.log('Starting a new worker');
// 	cluster.fork();
// });