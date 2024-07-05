const swaggerAutogen = require('swagger-autogen')();
const doc = {
	info: {
		title: 'OPEN API SPECS',
		description: 'API Documentation'
	},
	host: 'localhost:8080',
	schemes: ['http']
};
const outputFile = './swagger-output.json';
const routes = ['./index.js'];
swaggerAutogen(outputFile, routes, doc);
