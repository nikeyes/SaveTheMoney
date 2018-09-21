const express = require('express');
const app = express();
const repo = require('./prices_repository');
const portaventura = require('./portaventura');
const moment = require('moment');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.get('/prices', async (req, res) => {   
    const db = repo.openDatabaseConnection();

    let sql = `SELECT id as id 
                ,room as room
                ,inDate as inDate
                ,price_type as price_type
                ,price as price
                ,adults as adults
                ,children as children
                ,child_age1 as child_age1
                ,child_age2 as child_age2
                ,child_age3 as child_age3
                ,tracked_date as tracked_date
            FROM prices_history
            WHERE price > -1`;

      db.all(sql, function(err, rows) {
        res.json(rows);
    });
      
    repo.closeDatabaseConnection(db);

});

app.get('/get_redirect', async (req, res) => { 
    let url = portaventura.prepareUrl(7241693, 
                                    moment(req.query.inDate), 
                                    req.query.adults,
                                    req.query.children,
                                    req.query.child_age1,
                                    req.query.child_age2,
                                    req.query.child_age3);
    res.end(url);
}); 



app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

app.use(express.static('webui'))

module.exports = app;