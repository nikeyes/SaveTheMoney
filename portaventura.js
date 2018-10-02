const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const moment = require('moment');
const _repo = require('./prices_repository');

class PortAventura {
    constructor() {
		_repo.createDatabaseStructureIfNotExists();
	}
	
	async start(){
		let trackedDate = moment().format('YYYY-MM-DD HH:mm:ss');
		for(let i=0; i<configs.length; i+2){
			this.execute(configs[i], trackedDate);
		 	await this.execute(configs[i+1], trackedDate);
		}

	}

	execute(config, trackedDate) {
		return new Promise(async (resolve, reject) => {
			let startDate = inDate.clone();
			let endDate = outDate;

			const db = _repo.openDatabaseConnection();
			
			while (startDate <= endDate) {
				for(let i=0;i<rooms.length;i++){
					console.log('['+moment().format('YYYY-MM-DD HH:mm:ss')+']','Go to process Day:',startDate.format('YYYY-MM-DD'), '...');
					var price = await this.getPrice(config, startDate, rooms[i], trackedDate);
					if (price != null) {
						_repo.savePriceInDataBase(db, price, config);
					}
				}
	
				startDate.add(1, 'days');
			}
	
			_repo.closeDatabaseConnection(db);
			resolve();
		});
    }

    
    getPrice(config, inDate, room, trackedDate) {

		let url = this.prepareUrl(room.hotelCode, 
									inDate, 
									config.adults, 
									config.children, 
									config.child_age1, 
									config.child_age2, 
									config.child_age3);
    
        return requestPromise(url)
            .then((htmlString) => {
                const $html = cheerio.load(htmlString);		
				let priceRoomOnly = $html(`span:contains("${room.roomDescription}")`).parent().parent().parent().find("span:contains('Sólo alojamiento')").parent().parent().parent().find('td').eq(1).find('.price').text()
				let priceBedAndBreakfast = $html(`span:contains("${room.roomDescription}")`).parent().parent().parent().find("span:contains('Alojamiento y desayuno')").parent().parent().parent().find('td').eq(1).find('.price').text()
				let priceHalfBoard = $html(`span:contains("${room.roomDescription}")`).parent().parent().parent().find("span:contains('Media pensión')").parent().parent().parent().find('td').eq(1).find('.price').text()
				let priceFullBoard = $html(`span:contains("${room.roomDescription}")`).parent().parent().parent().find("span:contains('Pensión completa')").parent().parent().parent().find('td').eq(1).find('.price').text()
                return {
                    roomName: room.roomName,
                    inDate: inDate.format('YYYY-MM-DD'),
					priceRoomOnly: priceRoomOnly.replace(',','.'),
					priceBedAndBreakfast: priceBedAndBreakfast.replace(',','.'),
					priceHalfBoard: priceHalfBoard.replace(',','.'),
					priceFullBoard: priceFullBoard.replace(',','.'),
                    trackedDate: trackedDate
                };	
                        
            })
            .catch((err) => {
				console.error('ERR:',err);
				return null;
            });
    }
    
    prepareUrl(hotelCode, inDate, adults, children, child_age1, child_age2, child_age3) {
    
        let outDate = moment(inDate);
        outDate.add(1, 'days');
    
		let url = urlBase ;
		url = url.replace('#hotelCode#', hotelCode);
        url = url.replace('#inDay#', inDate.format('DD'));
        url = url.replace('#inMonth#', inDate.format('MM'));
        url = url.replace('#inYear#', inDate.format('YYYY'));
        url = url.replace('#outDay#', outDate.format('DD'));
        url = url.replace('#outMonth#', outDate.format('MM'));
        url = url.replace('#outYear#', outDate.format('YYYY'));
        url = url.replace('#adults#', adults);
        url = url.replace('#children#', children==-1?0:children);
        url = url.replace('#child_age1#', child_age1==-1?0:child_age1);
		url = url.replace('#child_age2#', child_age2==-1?0:child_age2);
		url = url.replace('#child_age3#', child_age3==-1?0:child_age3);
        return url;
	}
	
	getHotelCode(roomDesc){
		for(var i = 0; i < rooms.length; i++)
		{
			if(rooms[i].roomName == roomDesc)
			{
				return rooms[i].hotelCode;
			}
		}
	}
}

const urlBase = 'https://booking.portaventura.com/desk/nReservations/jsp/C_Rates.jsp?idPartner=PORTAVENTURA&lang=es&inDay=#inDay#&inMonth=#inMonth#&inYear=#inYear#&outDay=#outDay#&outMonth=#outMonth#&outYear=#outYear#&hotelCode=#hotelCode#&rooms=1&adultsRoom1=#adults#&childrenRoom1=#children#&child1Room1=#child_age1#&child2Room1=#child_age2#&child3Room1=#child_age3#&idPrm=MBAVENTURA&idONg=X80&idNom=PORTAVENTURA&userCurrency=EUR&fromSearchAvailability=Y';
const inDate = moment().add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0});
const outDate = moment('2020-01-15', 'YYYY-MM-DD');

const configs = [
	
	configPortAventura_1_0 = { 
		adults: '1',
		children: '-1',
		child_age1: '-1',
		child_age2: '-1',
		child_age3: '-1'
	}, 
	
	configPortAventura_2_2_menos = { 
		adults: '2',
		children: '2',
		child_age1: '1',
		child_age2: '4',
		child_age3: '-1'
	},

	configPortAventura_2_2_mayores = { 
		adults: '2',
		children: '2',
		child_age1: '2',
		child_age2: '5',
		child_age3: '-1'
	},
	
	configPortAventura_3_2_menos = { 
		adults: '3',
		children: '2',
		child_age1: '1',
		child_age2: '4',
		child_age3: '-1'
	},

	configPortAventura_3_2_mayores = {
		adults: '3',
		children: '2',
		child_age1: '2',
		child_age2: '5',
		child_age3: '-1'
	}
];

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
