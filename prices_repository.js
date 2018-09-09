const sqlite3 = require('sqlite3').verbose();

class Prices_Repository {
    constructor() {
      this.db = null;
    }
    
    createDatabaseStructureIfNotExists(){
      console.log('Start Create Datebase if required...');
      this.db = this.openDatabaseConnection();
      this.db.serialize(() => {
        this.db.run('CREATE TABLE IF NOT EXISTS PRICES_HISTORY(ID INTEGER PRIMARY KEY AUTOINCREMENT, ROOM VARCHAR(256), INDATE DATETIME, PRICE DECIMAL, ADULTS INTEGER, CHILDREN INTEGER, CHILD_AGE1 INTEGER, CHILD_AGE2 INTEGER, CHILD_AGE3 INTEGER, TRACKED_DATE DATETIME)')
          .run('CREATE UNIQUE INDEX IF NOT EXISTS IDX_PRICES_HISTORY_ROOM_INDATE_PRICE_ADULTS_CHILDREN_CHILD_AGE1_CHILD_AGE2_CHILD_AGE3 ON PRICES_HISTORY (ROOM, INDATE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3)');
          
          console.log('Finish Create Datebase if required.');
          this.closeDatabaseConnection(this.db);
      });
      
    }
    
    savePriceInDataBase(db, priceObject, config) {
      //this.db = this.openDatabaseConnection();
      
      db.run('INSERT OR IGNORE INTO PRICES_HISTORY(ROOM, INDATE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) VALUES(?,?,?,?,?,?,?,?,?)'
          , [priceObject.roomName, priceObject.inDate, priceObject.price || -1, config.adults || -1, config.children || -1, config.age1 || -1, config.age2 || -1, -1, priceObject.trackedDate], (err) => {
      
        //this.closeDatabaseConnection(this.db);
        if (err) {
          return console.error('ERR:',err.message);
        }
      });

     
    };
    
    openDatabaseConnection() {
      return new sqlite3.Database('./db/prices.db', (err) => {
        if (err) {
          return console.error('ERR:',err.message);
        }});
    }
    
    closeDatabaseConnection(db) {
      db.close((err) => {
        if (err) {
          return console.error('ERR:',err.message);
        }});
    }
        
  }

    module.exports = new Prices_Repository();