const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const moment = require('moment');
const _repo = require('./prices_repository');

class PortAventura {
    constructor() {
      
	}
	
    execute(config) {
		return new Promise(async (resolve, reject) => {
			let startDate = config.inDate.clone();
			let endDate = config.outDate;
			
			console.log('Start:',config);
	
			_repo.createDatabaseStructureIfNotExists();
			const db = _repo.openDatabaseConnection();
			
			while (startDate <= endDate) {
				for(let i=0;i<rooms.length;i++){
					console.log('['+moment().format('DD/MM/YYYY hh:mm:ss')+']','Go to process Day:',startDate.format('DD/MM/YYYY'), '...');
					var price = await this.getPrice(config, startDate, rooms[i])
					_repo.savePriceInDataBase(db, price, config);
				}
	
				startDate.add(1, 'days');
			}
	
			_repo.closeDatabaseConnection(db);
			resolve();
		});
    }

    
    getPrice(config, inDate, room) {
        let url = this.prepareUrl(config, inDate, room);
    
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
    
    prepareUrl(config, inDate,  room) {
    
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
module.exports = new PortAventura();