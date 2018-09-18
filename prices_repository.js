const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');

class Prices_Repository {
    constructor() {
      this.db = null;
    }
    
    createDatabaseStructureIfNotExists(){
      console.log('Start Create Datebase if required...');
      this.db = this.openDatabaseConnection();
      this.db.serialize(() => {
        this.db.run('CREATE TABLE IF NOT EXISTS PRICES_HISTORY(ID INTEGER PRIMARY KEY AUTOINCREMENT, ROOM VARCHAR(256), INDATE DATETIME, PRICE_TYPE VARCHAR(256), PRICE DECIMAL, ADULTS INTEGER, CHILDREN INTEGER, CHILD_AGE1 INTEGER, CHILD_AGE2 INTEGER, CHILD_AGE3 INTEGER, TRACKED_DATE DATETIME)')
          .run('CREATE UNIQUE INDEX IF NOT EXISTS IDX_PRICES_HISTORY_ROOM_INDATE_PRICE_TYPE_PRICE_ADULTS_CHILDREN_CHILD_AGE1_CHILD_AGE2_CHILD_AGE3 ON PRICES_HISTORY (ROOM, INDATE, PRICE_TYPE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3)');
          
          console.log('Finish Create Datebase if required.');
          this.closeDatabaseConnection(this.db);
      });
      
    }
    
    savePriceInDataBase(db, priceObject, config) {

      db.run('INSERT OR IGNORE INTO PRICES_HISTORY(ROOM, INDATE, PRICE_TYPE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) VALUES(?,?,?,?,?,?,?,?,?,?)'
          , [priceObject.roomName, priceObject.inDate, 'RoomOnly', priceObject.priceRoomOnly || -1, config.adults || -1, config.children || -1, config.age1 || -1, config.age2 || -1, -1, priceObject.trackedDate], (err) => {
            if (err) {
              return console.error('ERR:',err.message);
            }
          });
      db.run('INSERT OR IGNORE INTO PRICES_HISTORY(ROOM, INDATE, PRICE_TYPE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) VALUES(?,?,?,?,?,?,?,?,?,?)'
          , [priceObject.roomName, priceObject.inDate, 'BedAndBreakfast', priceObject.priceBedAndBreakfast || -1, config.adults || -1, config.children || -1, config.age1 || -1, config.age2 || -1, -1, priceObject.trackedDate], (err) => {
            if (err) {
              return console.error('ERR:',err.message);
            }
          });
      db.run('INSERT OR IGNORE INTO PRICES_HISTORY(ROOM, INDATE, PRICE_TYPE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) VALUES(?,?,?,?,?,?,?,?,?,?)'
          , [priceObject.roomName, priceObject.inDate, 'HalfBoard', priceObject.priceHalfBoard || -1, config.adults || -1, config.children || -1, config.age1 || -1, config.age2 || -1, -1, priceObject.trackedDate], (err) => {
            if (err) {
              return console.error('ERR:',err.message);
            }
          });
      db.run('INSERT OR IGNORE INTO PRICES_HISTORY(ROOM, INDATE, PRICE_TYPE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) VALUES(?,?,?,?,?,?,?,?,?,?)'
          , [priceObject.roomName, priceObject.inDate, 'FullBoard', priceObject.priceFullBoard || -1, config.adults || -1, config.children || -1, config.age1 || -1, config.age2 || -1, -1, priceObject.trackedDate], (err) => {
            if (err) {
              return console.error('ERR:',err.message);
            }
          }); 
    };
 
    openDatabaseConnection() {
      let dbPath = './db/prices.db';
      if (process.env.OPENSHIFT_SERVER === 'YES') {
        dbPath = '/data/db/prices.db'; 
      }

      console.log('['+moment().format('DD/MM/YYYY hh:mm:ss')+']', 'Open:',dbPath);

      return new sqlite3.Database(dbPath, (err) => {
        if (err) {
          return console.error('ERR:',err.message);
        }});
    }
    
    closeDatabaseConnection(db) {
      console.log('['+moment().format('DD/MM/YYYY hh:mm:ss')+']', 'Close.');

      db.close((err) => {
        if (err) {
          return console.error('ERR:',err.message);
        }});
    }
        
  }

    module.exports = new Prices_Repository();