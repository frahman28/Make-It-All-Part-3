var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//get all hardware information
//admin, specialist, employee
router.get('/viewEquipment', function(req, res) {
    conn.query(`SELECT 
                hardware.hardware_id, name, type_id, hardware_relation.serial
                FROM
                hardware 
                LEFT JOIN 
                hardware_relation
                ON
                hardware_relation.hardware_id = hardware.hardware_id`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.render('hardware', {page_title: "All Hardware", data: ''});
                    } else {
                        res.render('hardware', {page_title: "All Hardware", data:rows});
                    }
                });
    });

//get hardware info based on inputted id
//admin
router.get('/:id', function(req, res) {
    const id = req.params.id;
    conn.query(`SELECT 
                hardware.hardware_id, name, type_id, hardware_relation.serial
                FROM
                hardware 
                LEFT JOIN 
                hardware_relation
                ON
                hardware_relation.hardware_id = hardware.hardware_id
                WHERE
                hardware.hardware_id = '${id}'`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.render('hardware', {page_title: "All Hardware", data: ''});
                    } else {
                        res.render('hardware', {page_title: "All Hardware", data:rows});
                    }
                });
    });

//add new hardware to hardware table
//admin
router.post('/', function(req, res) {
    const { name, type } = req.body;
    if (name && type) {
        try {
            conn.query(`INSERT INTO
                        hardware
                        (name, type_id)
                        Values
                        ('${name}', '${type}')`);
            res.status(201).send({ msg: 'Added Hardware to database'});
        } catch (err) {
            console.log(err);
        }
    }
});

//update hardware info based on inputted id
//admin
router.patch('/:id', function(req, res) {
    const { name, type, } = req.body;
    const id = req.params.id;
    if (name && type) {
        try {
            conn.query(`UPDATE 
                        hardware
                        SET
                        name = '${name}',
                        type_id = '${type}'
                        WHERE
                        hardware_id = '${id}'`);
            res.status(200).send({ msg: 'Updated Hardware details'});
        } catch (err) {
            console.log(err);
        }
    }
});

//delete hardware row based on inputted id
//admin
router.delete('/:id', function(req, res) {
    const id = req.params.id;
    try {
        conn.query(`DELETE
                    FROM 
                    hardware
                    WHERE
                    hardware_id = '${id}'`);
        res.status(200).send({ msg: 'Deleted Hardware details'});
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;

