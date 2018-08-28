const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const moment = require('moment');
const prices_repo = require('./prices_repository');

const config = {
	inDate: moment().add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0}), 
	outDate: moment('15/01/2019', 'DD/MM/YYYY'), 
	adults: '3',
	children: '2',
	age1: '4',
	age2: '1',
	urlBase: 'https://booking.portaventura.com/desk/nReservations/jsp/C_Rates.jsp?idPartner=PORTAVENTURA&lang=es&inDay=#inDay#&inMonth=#inMonth#&inYear=#inYear#&outDay=#outDay#&outMonth=#outMonth#&outYear=#outYear#&hotelCode=#hotelCode#&rooms=1&adultsRoom1=#adults#&childrenRoom1=#children#&child1Room1=#age1#&child2Room1=#age2#&idPrm=MBAVENTURA&idONg=X80&idNom=PORTAVENTURA&userCurrency=EUR&fromSearchAvailability=Y'
}

const rooms = [
	{
		hotelCode: '7241693',
		roomName: 'Mansion Lucy',
		roomDescription: 'Deluxe Superior Lucy'
	},
	{
		hotelCode: '7241689',
		roomName: 'PortAventura Woody',
		roomDescription: 'Deluxe Woody'
	},
	{
		hotelCode: '7241689',
		roomName: 'PortAventura Standard',
		roomDescription: 'Standard'
	},
	{
		hotelCode: '7241688',
		roomName: 'Caribe San Juan',
		roomDescription: 'Deluxe Club San Juan'
	},
	{
		hotelCode: '7241688',
		roomName: 'Caribe Standard',
		roomDescription: 'Standard'
	},
	{
		hotelCode: '7241688',
		roomName: 'Caribe Superior',
		roomDescription: 'Superior'
	},
	{
		hotelCode: '7241691',
		roomName: 'Gold River Callaghan',
		roomDescription: 'Deluxe Callaghan'
	},
	{
		hotelCode: '7241691',
		roomName: 'Gold River Standard',
		roomDescription: 'Standard'
	},
	{
		hotelCode: '7241691',
		roomName: 'Gold River Adaptada',
		roomDescription: 'Adaptada'
	},
	{
		hotelCode: '7241691',
		roomName: 'Gold River Superior',
		roomDescription: 'Superior'
	},
	{
		hotelCode: '7241690',
		roomName: 'El Paso Standard',
		roomDescription: 'Standard'
	},
	{
		hotelCode: '7241690',
		roomName: 'El Paso Adaptada',
		roomDescription: 'Adaptada'
	},
	{
		hotelCode: '7241692',
		roomName: 'Roulette Standard',
		roomDescription: 'Standard'
	}
];


let startDate = config.inDate;
let endDate = config.outDate;

let interval = 0;
let prices = [];
let promisesPrices = [];

prices_repo.createDatabaseStructureIfNotExists();
const db = prices_repo.openDatabaseConnection();

while (startDate <= endDate) {
	//Closure para fijar la fecha en la que estamos buscado el precio.
	(function(inDate){
			let promisePrice;
			for(let i=0;i<rooms.length;i++){
				promisePrice = delay(interval+=500).then(() => {
						console.log('Go to process Day:',inDate.format('DD/MM/YYYY'), '...');
						 getPrice(rooms[i], inDate)
						.then((price) => {
							prices_repo.savePriceInDataBase(db, price, config);
						});	
					});
				promisesPrices.push(promisePrice);
			}
	})(startDate.clone());

	startDate.add(1, 'days');
}

Promise.all(promisesPrices)
	.then(() => {
		delay(interval).then(()=>{
			prices_repo.closeDatabaseConnection(db);
		});
	}).catch((err) => {
		console.error('ERR:',err.message); 
  });

function getPrice(room, inDate) {
	let url = prepareUrl(config, inDate, room);

	return requestPromise(url)
		.then((htmlString) => {
			const $html = cheerio.load(htmlString);		
			let price = $html(`span:contains("${room.roomDescription}")`).parent().parent().parent().find('.price').eq(1).text();

			return {
				roomName: room.roomName,
				inDate: inDate.format('DD/MM/YYYY'),
				price: price.replace(',','.'),
				trackedDate: moment().format('DD/MM/YYYY HH:mm:ss')
			};	
					
		})
		.catch((err) => {
			console.error('ERR:',err);
		});
}

function prepareUrl(config, inDate,  room) {

	let outDate = moment(inDate);
	outDate.add(1, 'days');

	let url = config.urlBase ;
	url = url.replace('#inDay#', inDate.format('DD'));
	url = url.replace('#inMonth#', inDate.format('MM'));
	url = url.replace('#inYear#', inDate.format('YYYY'));
	url = url.replace('#outDay#', outDate.format('DD'));
	url = url.replace('#outMonth#', outDate.format('MM'));
	url = url.replace('#outYear#', outDate.format('YYYY'));
	url = url.replace('#adults#', config.adults);
	url = url.replace('#children#', config.children);
	url = url.replace('#age1#', config.age1);
	url = url.replace('#age2#', config.age2);
	url = url.replace('#hotelCode#', room.hotelCode);
	return url;
}

function delay(interval) {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
}
