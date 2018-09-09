const moment = require('moment');
const portaventura = require('./portaventura');
const urlBase = 'https://booking.portaventura.com/desk/nReservations/jsp/C_Rates.jsp?idPartner=PORTAVENTURA&lang=es&inDay=#inDay#&inMonth=#inMonth#&inYear=#inYear#&outDay=#outDay#&outMonth=#outMonth#&outYear=#outYear#&hotelCode=#hotelCode#&rooms=1&adultsRoom1=#adults#&childrenRoom1=#children#&child1Room1=#age1#&child2Room1=#age2#&idPrm=MBAVENTURA&idONg=X80&idNom=PORTAVENTURA&userCurrency=EUR&fromSearchAvailability=Y';
const inDate = moment().add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0});
const outDate = moment('10/09/2018', 'DD/MM/YYYY');


const configs = [
	
	configPortAventura_1_0 = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '1',
		children: '-1',
		age1: '-1',
		age2: '-1',
		urlBase: urlBase
	}, 
	
	configPortAventura_2_0 = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '2',
		children: '-1',
		age1: '-1',
		age2: '-1',
		urlBase: urlBase
	},
	
	configPortAventura_3_0 = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '3',
		children: '-1',
		age1: '-1',
		age2: '-1',
		urlBase: urlBase
	},
	
	configPortAventura_1_1_menos = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '1',
		children: '1',
		age1: '1',
		age2: '-1',
		urlBase: urlBase
	},
	
	configPortAventura_1_1_mas = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '1',
		children: '1',
		age1: '4',
		age2: '-1',
		urlBase: urlBase
	},
	
	configPortAventura_2_1_menos = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '2',
		children: '1',
		age1: '1',
		age2: '-1',
		urlBase: urlBase
	},
	
	configPortAventura_2_1_mas = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '2',
		children: '1',
		age1: '4',
		age2: '-1',
		urlBase: urlBase
	},
	
	configPortAventura_2_2 = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '2',
		children: '2',
		age1: '4',
		age2: '4',
		urlBase: urlBase
	},
	
	configPortAventura_3_2 = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '3',
		children: '2',
		age1: '4',
		age2: '4',
		urlBase: urlBase
	},
	
	configPortAventura_3_2_menos = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '3',
		children: '2',
		age1: '1',
		age2: '4',
		urlBase: urlBase
	}
];
	
async function main()
{
	console.log('['+moment().format('DD/MM/YYYY hh:mm:ss')+']', 'Start...');

	for(let i=0; i<configs.length; i+=5){
		 portaventura.execute(configs[i]);
		 portaventura.execute(configs[i+1]);
		 portaventura.execute(configs[i+2]);
		 portaventura.execute(configs[i+3]);
		 await portaventura.execute(configs[i+4]);
	}

	console.log('['+moment().format('DD/MM/YYYY hh:mm:ss')+']', 'End...');
}

main();




