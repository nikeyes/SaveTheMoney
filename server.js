const express = require('express');
const app = express();
const _repo = require('./prices_repository');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/', (req, res) => {
    const db = _repo.openDatabaseConnection();

    let sql = `SELECT room as room
                        ,inDate as inDate
                        ,price_type as price_type
                        ,price as price
                        ,adults as adults
                        ,children as children
                        ,child_age1 as child_age1
                        ,child_age2 as child_age2
                        ,child_age3 as child_age3
                        ,tracked_date as tracked_date
                 FROM prices_history where 1=0`;
    db.each(sql, [], (err, row) => {
        if (err) {
          throw err;
        }
       console.log(`{"room": "${row.room}", 
"inDate": "${row.inDate}", 
"priceType": "${row.price_type}", 
"price": "${row.price}", 
"adults": "${row.adults}", 
"children": "${row.children}", 
"childAge1": "${row.child_age1}",
"childAge2": "${row.child_age2}", 
"childAge3": "${row.child_age3}", 
"trackedDate": "${row.tracked_date}"},`);
      });
    _repo.closeDatabaseConnection(db);
    res.send('fin');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;