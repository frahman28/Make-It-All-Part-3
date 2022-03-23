var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//get all software information
//admin, specialist, employee
router.get('/viewEquipment', function(req, res) {
    conn.query(`SELECT 
                software.software_id, name, type_id, software_relation.license
                FROM
                software 
                LEFT JOIN 
                software_relation
                ON
                software_relation.software_id = software.software_id`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.render('software', {page_title: "All Software", data: ''});
                    } else {
                        res.render('software', {page_title: "All Software", data:rows});
                    }
                });
    });

//get software info based on inputted id
//admin
router.get('/:id', function(req, res) {
    const id = req.params.id;
    conn.query(`SELECT 
                software.software_id, name, type_id, software_relation.license
                FROM
                software 
                LEFT JOIN 
                software_relation
                ON
                software_relation.software_id = software.software_id
                WHERE
                software.software_id = '${id}'`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.render('software', {page_title: "All Software", data: ''});
                    } else {
                        res.render('software', {page_title: "All Software", data:rows});
                    }
                });
    });

//add new software to software table
//admin
router.post('/', function(req, res) {
    const { name, type } = req.body;
    if (name && type) {
        try {
            conn.query(`INSERT INTO
                        software
                        (name, type_id)
                        Values
                        ('${name}', '${type}')`);
            res.status(201).send({ msg: 'Added Software to database'});
        } catch (err) {
            console.log(err);
        }
    }
});

//update software info based on inputted id
//admin
router.patch('/:id', function(req, res) {
    const { name, type, } = req.body;
    const id = req.params.id;
    if (name && type) {
        try {
            conn.query(`UPDATE 
                        software
                        SET
                        name = '${name}',
                        type_id = '${type}'
                        WHERE
                        software_id = '${id}'`);
            res.status(200).send({ msg: 'Updated Software details'});
        } catch (err) {
            console.log(err);
        }
    }
});

//delete software row based on inputted id
//admin
router.delete('/:id', function(req, res) {
    const id = req.params.id;
    try {
        conn.query(`DELETE
                    FROM 
                    software
                    WHERE
                    software_id = '${id}'`);
        res.status(200).send({ msg: 'Deleted Software details'});
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
