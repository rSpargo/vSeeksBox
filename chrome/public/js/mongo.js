var mongo = require('mongodb').MongoClient;
var dbURI = 'mongodb://admin:pass@ds113825.mlab.com:13825/vseeks-box';

mongo.connect(dbURI, function(err, db) {
    if (err) {
        console.log("Cannot connect to database! >.<*", err);
        throw err;
    }
    console.log("Successfully connected to database!");
    db.close();
})

function createVSeeks (task) {
    mongo.connect(dbURI, function(err, db) {
        if (err) {
            console.log("Cannot connect to database! >.<*", err);
            throw err;
        }
        var newVSeeks = {task: task};
        db.collection("active-vseeks").insertOne(newVSeeks, function(err, res) {
            if (err) {
                throw err;
            }
            console.log("vSeeks w/ task: " + task + " inserted.");
            db.close();
        })
    })
}

//createVSeeks("Help me study");