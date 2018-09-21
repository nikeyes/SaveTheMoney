const moment = require('moment');
const portaventura = require('./portaventura');
	
async function main()
{
	console.log('['+moment().format('YYYY-MM-DD HH:mm:ss')+']', 'Start...');
	portaventura.start();
	console.log('['+moment().format('YYYY-MM-DD HH:mm:ss')+']', 'End...');
}

main();




