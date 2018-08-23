const sqlite3 = require('sqlite3').verbose();

class Prices_Repository {
    constructor() {}
    
    createDatabaseStructureIfNotExists(){
      console.log('Start Create Datebase if required...');
      const db = this.openDatabaseConnection();
      db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS PRICES_BULK(ROOM VARCHAR(256), INDATE DATETIME, PRICE DECIMAL, ADULTS INTEGER, CHILDREN INTEGER, CHILD_AGE1 INTEGER, CHILD_AGE2 INTEGER, CHILD_AGE3 INTEGER, TRACKED_DATE DATETIME)')
          .run('CREATE TABLE IF NOT EXISTS PRICES_HISTORY(ID INTEGER PRIMARY KEY AUTOINCREMENT, ROOM VARCHAR(256), INDATE DATETIME, PRICE DECIMAL, ADULTS INTEGER, CHILDREN INTEGER, CHILD_AGE1 INTEGER, CHILD_AGE2 INTEGER, CHILD_AGE3 INTEGER, TRACKED_DATE DATETIME)')
          .run('CREATE TABLE IF NOT EXISTS PRICES(ID INTEGER PRIMARY KEY AUTOINCREMENT, ROOM VARCHAR(256), INDATE DATETIME, PRICE DECIMAL, ADULTS INTEGER, CHILDREN INTEGER, CHILD_AGE1 INTEGER, CHILD_AGE2 INTEGER, CHILD_AGE3 INTEGER, TRACKED_DATE DATETIME)')
          .run('DELETE FROM PRICES_BULK')
          console.log('Finish Create Datebase if required.');
          this.closeDatabaseConnection(db);
      });
    }
    
    savePriceInDataBase(db, priceObject, config) {
    
      db.run('INSERT INTO PRICES_BULK(ROOM, INDATE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) VALUES(?,?,?,?,?,?,?,?,?)'
          , [priceObject.roomName, priceObject.inDate, priceObject.price, config.adults, config.children, config.age1, config.age2, null, priceObject.trackedDate], function(err) {
      if (err) {
        return console.error('ERR:',err.message);
      }});	
    };
    
    savePriceHistoryInDataBase() {
      console.log('Start Price Hisotry...');
      const db = this.openDatabaseConnection();

      db.run(`INSERT INTO PRICES_HISTORY(ROOM, INDATE, PRICE, ADULTS, CHILDREN, CHILD_AGE1, CHILD_AGE2, CHILD_AGE3, TRACKED_DATE) 
          SELECT PB.ROOM, PB.INDATE, PB.PRICE, PB.ADULTS, PB.CHILDREN, PB.CHILD_AGE1, PB.CHILD_AGE2, PB.CHILD_AGE3, PB.TRACKED_DATE
          FROM PRICES_BULK PB
            LEFT JOIN PRICES_HISTORY PH ON PB.ROOM = PH.ROOM AND PB.INDATE = PH.INDATE AND PB.PRICE = PH.PRICE
          WHERE PH.ID IS NULL`, function(err) {
          if (err) {
            return console.error('ERR:',err.message);
          }
        });
      console.log('Finish Price Hisotry.');
      this.closeDatabaseConnection(db);	
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
        }
        console.log('Close the database connection.');
        });
    }
    
    /*savePricesInDataBase(prices) {
      let db = new sqlite3.Database('./db/prices.db', (err) => {
        if (err) {
          return .error(err.message);
        }
        .log('Connected to the Prices SQlite database.');
      });
    
      prices.forEach(function(priceObject) {
        db.run(`INSERT INTO PRICES(ROOM, INDATE, PRICE, TRACKED_DATE) VALUES(?,?,?,?)`
            , [priceObject.roomName, priceObject.inDate, priceObject.price, priceObject.trackedDate], function(err) {
        if (err) {
          return .log(err.message);
        }
          .log(`A row has been inserted with rowid ${this.lastID}`);
        });
        });
      
      db.close((err) => {
        if (err) {
          return .error(err.message);
        }
        .log('Close the database connection.');
        });
    };*/
    
    }

    module.exports = new Prices_Repository();