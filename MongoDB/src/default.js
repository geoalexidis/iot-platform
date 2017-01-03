/**
 * Insert Data to the MongoDB for testing purposes
 */


// DROP Database to reset everything
db.dropDatabase();


/**
 * COUNTERS COLLECTION FOR THE _ID FIELD (not every collection has such a filed)
 */

// Name of the collections that will be auto incremented
var autoIncCollections_id = [
    'tool',
    'serviceinstruction',
    'error',
    'servicecase',
    'connection',
    //'machine',
    //'part,'
    'dataset',
    'datarecord'
];

// Create the counter collection for every item inserted in the autoIncCollections_id array
// This Collection will be used to see the current state of the auto incremented _id
autoIncCollections_id.forEach(function (elem) {
    db.counters.insert(
        {
            _id: elem,
            seq: 0
        }
    );
});


/**
 * JAVASCRIPT FUNCTIONS INSIDE MONGODB
 */

// Create a getNextSequence function that accepts a name of the sequence. The function uses the findAndModify()
// method to automically increment the seq value and return this new value:
// Add the create getNextSequence function into Database (store it for later usage)
// Name of collection must be system.js
db.system.js.save(
    {
        _id: "getNextSequence",
        value: function (name) {
            var ret = db.counters.findAndModify(
                {
                    query: {_id: name},
                    update: {$inc: {seq: 1}},
                    new: true
                }
            );

            return ret.seq;
        }
    }
);

// Called from the IoT Cloud to know, which collections have an auto inserted _id
db.system.js.save(
    {
        _id: 'getCounterNames',
        value: function () {
            return db.counters.find({}).toArray();
        }
    }
);

// with entrys of the source_id and the sourceCollection
// choose an target_id and targetCollection
// and retrieve all collections, that are linking to it
db.system.js.save(
    {
        _id: 'getReferencedDocs',
        value: function (source_id, sourceCollection, target_id, targetCollection) {

            var iArray = db[sourceCollection].findOne({_id: source_id}); // get iteration array
            var res = {data: []};               // result JSON Object
            var val;                    // Readed value of other collection

            // functions iterates all indexes and returns all objects from other collection
            iArray[target_id].forEach(function (elem, index) {
                val = db[targetCollection].findOne({'_id': elem});
                res.data[index] = val;
            });

            return (res);
        }
    }
);

/**
 * BEGIN INSERTING ENTRYS TO THE COLLECTIONS
 */
 

// Load stored functions
db.loadServerScripts();

// Seq number variable. Number that will have the current sequence
// of an auto incremented _id collection
var seq = 0;

// Tools
db.tool.insertMany([
    {
        _id: getNextSequence('tool'),
        description: 'Screwdriver Cross 2',
        weight: 0.02,
        unit: 'kg'
    },
    {
        _id: getNextSequence('tool'),
        description: 'Hammer',
        weight: 1.5,
        unit: 'kg'
    },
    {
        _id: getNextSequence('tool'),
        description: 'Configuration Handheld',
        weight: 0.3,
        unit: 'kg'
    }]
);

// Service Instruction
db.serviceinstruction.insertMany([
    {
        _id: getNextSequence('serviceinstruction'),
        instructions: [
            'Restart Machine',
            'Use Screwdriver to adjust IR-Sensor',
            'Use Hammer with random item',
            'Push button X'],
        serviceCases_id: [1,4],
        tools_id: [1, 2]
    },
    {
        _id: getNextSequence('serviceinstruction'),
        instructions: [
            'Use Configuration Handheld to adjust RFID-Data',
            'Push button Y'],
        serviceCases_id: [2],
        tools_id: [3]
    },
    {
        _id: getNextSequence('serviceinstruction'),
        instructions: [
            'Restart Machine',
            'Push button Z',
            'Wait for Response'],
        serviceCases_id: [3],
        tools_id: []
    },
    {
        _id: getNextSequence('serviceinstruction'),
        instructions: [
            'Contact second level support'],
        serviceCases_id: [],
        tools_id: []
    },
    {
        _id: getNextSequence('serviceinstruction'),
        instructions: [
            'Scream for help'],
        serviceCases_id: [],
        tools_id: []
    }
]);


// Error Code
db.errorcode.insertMany([
    {_id: 100, level: 1, errorInformation: 'IR-Sensor reports wrong values', serviceInstruction_id: 1},
    {_id: 200, level: 3, errorInformation: 'RFID-Data corrupted', serviceInstruction_id: 2},
    {_id: 220, level: 4, errorInformation: 'Machine reported crash', serviceInstruction_id: 3},
    {_id: 9001, level: 2, errorInformation: 'Error unknown', serviceInstruction_id: 4}]
);

// Error
db.error.insertMany([
    {
        _id: getNextSequence('error'),
        errorDate: ISODate(),
        errorCode_id: 100,
        machine_id: 1,
        part_id: 1
    },
    {
        _id: getNextSequence('error'),
        errorDate: ISODate(),
        errorCode_id: 200,
        machine_id: 2,
        part_id: 2
    },
    {
        _id: getNextSequence('error'),
        errorDate: ISODate(),
        errorCode_id: 220,
        machine_id: 3,
        part_id: 3
    },
    {
        _id: getNextSequence('error'),
        errorDate: ISODate(),
        errorCode_id: 100,
        machine_id: 1,
        part_id: 1
    }]
);


// Service Case
db.servicecase.insertMany([
    {
        _id: getNextSequence('servicecase'),
        technician: 1,
        error_id: 1,
        status: 'finished',
        serviceReport: {},
        machine_id: 1,
        part_id: 4
    },
    {
        _id: getNextSequence('servicecase'),
        technician: undefined,
        error_id: 2,
        status: 'created',
        serviceReport: {},
        machine_id: 2,
        part_id: 7
    },
    {
        _id: getNextSequence('servicecase'),
        technician: 3,
        error_id: 3,
        status: 'assigned',
        serviceReport: {},
        machine_id: 3,
        part_id: 8
    },
    {
        _id: getNextSequence('servicecase'),
        technician: 1,
        error_id: 4,
        status: 'finished',
        serviceReport: {},
        machine_id: 1,
        part_id: 1
    }
]);

// Connection
db.connection.insertOne({
    _id: getNextSequence('connection'),
    machine_id: 1,
    protocol: 'http',
    ipv4: '172.16.60.139',
    ipv6: '2a02:120b:2c7d:3e70:d5b:935b:4c91:de94',
    port: 1680,
    password: '91kyklj2lmlnan2d'
});

// Machine
db.machine.insertMany([
    {
        _id: 1,
        instance_id: 1,
        machineType: 'Pick & Place Machine',
        customer: 'HSR Rapperswil',
        part_id: 1,
        geodata: {
            lat: 47.2231495,
            long: 8.8184658
        }
    },
    {
        _id: 2,
        instance_id: 2,
        machineType: 'Pick & Place Machine',
        customer: 'Intelliact AG',
        part_id: 2,
        geodata: {
            lat: 47.4120165,
            long: 8.5471497
        }
    },
    {
        _id: 3,
        instance_id: 3,
        machineType: 'Rheinbraun 256',
        customer: 'Haudegen AG',
        part_id: 3,
        geodata: {
            lat: 18.0386484,
            long: -76.8950262
        }
    }
]);

// Part
db.part.insertMany([
    {
        _id: 1,
        instance_id: 1,
        name: 'Assembly Top Pick & Place Machine',
        state: 'In Use',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                machine_id: 1,
                dateStart: ISODate()
            }
        ]
    },
    {
        _id: 2,
        instance_id: 2,
        name: 'Assembly Top Pick & Place Machine',
        state: 'In Use',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                machine_id: 2,
                dateStart: ISODate()
            }
        ]
    },
    {
        _id: 3,
        instance_id: 3,
        name: 'Assembly Top Rheinbraun 256',
        state: 'In Use',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                machine_id: 3,
                dateStart: ISODate()
            }
        ]
    },
    {
        _id: 4,
        instance_id: 4,
        name: 'Irgendwas',
        state: 'In Use',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                part_id: 2,
                dateStart: ISODate(),
                dateEnd: ISODate()
            },
            {
                part_id: 1,
                dateStart: ISODate()
            }
        ]
    },
    {
        _id: 5,
        instance_id: 5,
        name: 'Wegstück',
        state: 'In Use',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                part_id: 1,
                dateStart: ISODate()
            }
        ]
    },
    {
        _id: 6,
        instance_id: 6,
        name: 'Wegstück',
        state: 'At Stock',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                part_id: 2,
                dateStart: ISODate(),
                dateEnd: ISODate()
            }
        ]
    },
    {
        _id: 7,
        instance_id: 7,
        name: 'Sägeblatt',
        state: 'disposed',
        plmNumber: '828392',
        plmRevision: 'A',
        usage: [
            {
                part_id: 3,
                dateStart: ISODate(),
                dateEnd: ISODate()
            }
        ]
    }
]);

// Data Set
db.dataset.insertMany([
    {
        _id: getNextSequence('dataset'),
        datatype: 'Int',
        description: 'Times Machine restarted',
        part_id: 1
    },
    {
        _id: getNextSequence('dataset'),
        datatype: 'Double',
        description: 'Noise of the machine in dB',
        part_id: 1
    },
    {
        _id: getNextSequence('dataset'),
        datatype: 'String',
        description: 'Status Log from the machine',
        part_id: 1
    }
]);

// Data Record
db.datarecord.insertMany([
    {
        _id: getNextSequence('datarecord'),
        timestamp: ISODate(),
        value: 10,
        dataSet_id: 1
    },
    {
        _id: getNextSequence('datarecord'),
        timestamp: ISODate(),
        value: 20,
        dataSet_id: 1
    },
    {
        _id: getNextSequence('datarecord'),
        timestamp: ISODate(),
        value: 50.87,
        dataSet_id: 2
    },
    {
        _id: getNextSequence('datarecord'),
        timestamp: ISODate(),
        value: 80.23,
        dataSet_id: 2
    },
    {
        _id: getNextSequence('datarecord'),
        timestamp: ISODate(),
        value: 'Machine working properly',
        dataSet_id: 3
    },
    {
        _id: getNextSequence('datarecord'),
        timestamp: ISODate(),
        value: 'Machine working properly',
        dataSet_id: 3
    }
]);



// PLM Item, only here for testing purpose. This db collection may be deleted later
db.plmitem.insertOne(
    {
        plmNumber: 'L-3005740',
        plmRevision: 'A',
        name: 'Round Plate 1X1 - Tr.',
        type: 'Part',
        state: 'Released',
        system: {
            name: 'Aras',
            version: 3.2
        },
        relation: {
            sourcePlmNumber: '226542',
            sourcePlmRevision: 'C',
            targetPlmNumber: '165431',
            targetPlmRevision: 'B'
        },
        attributes: [
            {
                key: 'Make or Buy',
                value: 'Buy',
                dataType: 'String'
            },
            {
                key: 'Weight in kg',
                value: 3.14159265,
                dataType: 'Double'
            }
        ]
    }
);