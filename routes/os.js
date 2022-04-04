var express = require('express');
var router = express.Router();

var conn = require('../dbconfig');

//get all os information
//admin, specialist, employee
router.get('/equipment/os', function(req, res) {
    conn.query(`SELECT 
                *
                FROM
                os`,
                function(err, rows) {
                    if (err) {
                        console.error('Error: ' + err);
                        res.render('os', {page_title: "All Operating Systems", data: ''});
                    } else {
                        res.render('os', {page_title: "All Operating Systems", data:rows});
                    }
                });
    });

//get os info based on inputted id
//admin
router.get('/equipment/os/:id', function(req, res) {
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
                        res.render('os', {page_title: "All Operating Systems", data: ''});
                    } else {
                        res.render('os', {page_title: "All Operating Systems", data:rows});
                    }
                });
    });

//add new os to os table
//admin
router.post('/equipment/os', function(req, res) {
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
        }
    }
});

//update os info based on inputted id
//admin
router.patch('/equipment/os/:id', function(req, res) {
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
        }
    }
});

//delete os row based on inputted id
//admin
router.delete('/equipment/os/:id', function(req, res) {
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
    }
});

module.exports = router;
