var express = require('express');
var router = express.Router();


var conn  = require('../dbconfig');
 
/* GET user's home page */
router.get('/', function(req, res, next) {
    conn.query(`SELECT * FROM problems ORDER BY id desc`, function(err,rows) {
        if(err){
            req.flash('error', err); 
            res.render('problems',
                        {page_title:"Customers - Node.js",data:''});   
        }else{
            res.render('problems',
                        {page_title:"Customers - Node.js", data:rows});
        }
         });
    });


// SHOW ADD PROBLEM FORM
router.get('/new', function(req, res, next){
    // render to views/problem/new.ejs
    res.render('problem/new', {
        title: 'Submit a new problem',
    })
})

// ADD NEW PROBLEM POST ACTION
router.post('/new', function(req, res, next){    
    req.assert('name', 'Name is required').notEmpty()                   //Validate name
    req.assert('hardware', 'A valid hardware is required').notEmpty()   //Validate hardware
    req.assert('software', 'A valid software is required').notEmpty()   //Validate hardware
    req.assert('os', 'A valid operating system is required').notEmpty()   //Validate hardware
    // TODO add extra fields

    var errors = req.validationErrors()

    if( !errors ) {
        // TODO change to model
        var problem = {
            name: req.sanitize('name').escape().trim(),
            hardware: req.sanitize('hardware').escape().trim(),
            software: req.sanitize('software').escape().trim(),
            os: req.sanitize('os').escape().trim()
        }

        conn.query('INSERT INTO problems SET ?', 
                    problem,
                    function(err, result) {
                if (err) {
                    console.log('error', err)

                    // render to views/problem/add.ejs
                    res.render('customers/add', {
                        title: 'Submit New Problem',
                        name: user.name,
                        // TODO
                    })
                } else {
                    console.log('Data added successfully!');
                    res.redirect('/customers');
                }
            })
    } else {   
        //Display errors
        var error_msg = '';

        errors.forEach(function(error) {
            error_msg += error.msg + '\n'
        })                
        req.flash('error', error_msg)        
         
        res.render('problems/new', { 
            title: 'Submit New Problem',
            name: req.body.name,
            hardware: req.body.hardware,
            software: req.body.software,
            os: req.body.os
        })
    }
})
 
// TODO:
//  restrict to Admin and Specialist only
// EDIT PROBLEM POST ACTION
// SHOW EDIT PROBLEM FORM
router.get('/edit/(:id)', function(req, res, next){
    conn.query('SELECT * FROM problems WHERE id = ' + req.params.id,
                function(err, rows, fields) {
            if(err) throw err

            // if problem not found
            if (rows.length <= 0) {
                req.flash('error', 'Problems not found with id = ' + req.params.id)
                res.redirect('/problems')
            }
            else { 
                // problem exists
                // render to views/problems/edit.ejs
                res.render('problems/edit', {
                    title: 'Edit Problem',
                    id: rows[0].id,
                    name: rows[0].name
                })
            }
        })
})

// TODO:
//  restrict to Admin and Specialist only
// EDIT PROBLEM POST ACTION
router.post('/update/:id', function(req, res, next) {
    req.assert('name', "Problem's name is required").notEmpty()
    // TODO: what other info can be updated?

    var errors = req.validationErrors()

    if( !errors ) {
        var problem = {
            name: req.sanitize('name').escape().trim(),
        }
        conn.query('UPDATE problem SET ? WHERE id = ' + req.params.id, 
                    problem,
                    function(err, result) {

                if (err) {
                    req.flash('error', err)

                    // render to views/problems/new.ejs
                    res.render('problem/edit', {
                        title: 'Edit Problem',
                        id: req.params.id,
                        name: req.body.name,
                        // TODO: add more info
                    })
                } else {
                    console.log('Data updated successfully!');
                    res.redirect('/problems');
                }
            })

    }
    else {
        //Display errors
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '\n'
        })
        console.log('Error: ' + error_msg)
         
        res.render('problem/edit', { 
            title: 'Edit Problem',
            id: req.params.id,
            name: req.body.name
        })
    }
})

module.exports = router;