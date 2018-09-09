const moment = require('moment');
const portaventura = require('./portaventura');
const urlBase = 'https://booking.portaventura.com/desk/nReservations/jsp/C_Rates.jsp?idPartner=PORTAVENTURA&lang=es&inDay=#inDay#&inMonth=#inMonth#&inYear=#inYear#&outDay=#outDay#&outMonth=#outMonth#&outYear=#outYear#&hotelCode=#hotelCode#&rooms=1&adultsRoom1=#adults#&childrenRoom1=#children#&child1Room1=#age1#&child2Room1=#age2#&idPrm=MBAVENTURA&idONg=X80&idNom=PORTAVENTURA&userCurrency=EUR&fromSearchAvailability=Y';
const inDate = moment().add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0});
const outDate = moment('10/09/2018', 'DD/MM/YYYY');

const config  = {
		inDate: inDate, 
		outDate: outDate, 
		adults: '3',
		children: '2',
		age1: '1',
		age2: '4',
		urlBase: urlBase
};

 portaventura.execute(config);







