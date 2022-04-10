var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//Get all os information
//admin, specialist, employee
router.get('/os', function(req, res) {
    conn.query(`SELECT 
                *
                FROM
                os`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.json({ message: "Error in request" });
                    } else {
                        res.json({ data:rows });
                    }
                });
    });

//Get os info based on inputted id
//admin
router.get('/os/:id', function(req, res) {
    const id = parseInt(req.params.id);
    conn.query(`SELECT 
                *
                FROM
                os
                WHERE
                os_id = ?`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.json({ message: "Error in request" });
                    } else {
                        res.json({ data:rows });
                    }
                });
    });

//Add new os to os table
//admin
router.post('/os', function(req, res) {
    const name = req.body.name;
    if (name) {
        try {
            conn.query(`INSERT INTO
                        os
                        (name)
                        Values
                        ('${name}')`);
            res.status(201).send({ msg: 'Added Operating System to database'});
        } catch (err) {
            console.log(err);
            res.json({ message: "Error in request" });
        }
    }
});

//Update os info based on inputted id
//admin
router.patch('/os/:id', function(req, res) {
    const name = req.body.name;
    const id = parseInt(req.params.id);
    if (name) {
        try {
            conn.query(`UPDATE 
                        os
                        SET
                        name = '${name}'
                        WHERE
                        os_id = '${id}'`);
            res.status(200).send({ msg: 'Updated Operating System details'});
        } catch (err) {
            console.log(err);
            res.json({ message: "Error in request" });
        }
    }
});

//Delete os row based on inputted id
//admin
router.delete('/os/:id', function(req, res) {
    const id = parseInt(req.params.id);
    try {
        conn.query(`DELETE
                    FROM 
                    os
                    WHERE
                    os_id = '${id}'`);
        res.status(200).send({ msg: 'Deleted Operating System details'});
    } catch (err) {
        console.log(err);
        res.json({ message: "Error in request" });
    }
});

module.exports = router;
