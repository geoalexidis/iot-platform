// A simple query using findOne


// Parse Body into JSON Format
var query = JSON.parse(msg.req.body);

var MongoClient = global.get('mongodb').MongoClient,
    test = global.get('assert');

try {
    MongoClient.connect('mongodb://localhost:27017/batest', function (err, db) {

        // Load saved mongodb Scripts
        try {
            db.eval('db.loadServerScripts()', function (err, result) {
                //...crash if failed
            });
        }
        catch (e) {
        }

        // Get next Sequence
        try {
            db.eval(get_id, msg.collection, function (err, seq) {

                // assign seq number to the _id
                query._id = seq;
                msg.payload._id = seq;

                // Connect to collection
                var collection = db.collection(msg.collection);
                // Insert the Query
                collection.insert(query, function (err, result) {
                    test.equal(null, err);
                    db.close();
                });


            });
        }
        catch (e) {
        }
    });
}
catch (e) {
}

// Extract the collection name from the URL
var backslash = msg.req.url.indexOf("/", 1);
msg.collection = msg.req.url.substring(1, backslash);

// Answer
msg.operation = 'findOne';
msg.payload = query;

// Declare the sequence _id function
var get_id = function (name) {
    var ret = db.counters.findAndModify(
        {
            query: {_id: name},
            update: {$inc: {seq: 1}},
            new: true
        }
    );

    return ret.seq;
};

//return msg;

setTimeout(function () {
        node.warn('warn');
        return msg;
    }, 1000);
