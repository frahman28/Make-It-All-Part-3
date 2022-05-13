var express = require('express');
var router = express.Router();

var conn = require('../dbconfig')
var {verifySession, checkRoles} = require("./auth.middleware")

//Import all functions from hardware, software, os files to interact with database
var {getAllHardware, getHardwareTypes, getHardwareById, addHardware, updateHardware, deleteHardware} = require('./hardware');
var {getAllSoftware, getSoftwareTypes, getSoftwareById, addSoftware, updateSoftware, deleteSoftware} = require('./software');
var {getAllOS, getOSById, addOS, updateOS, deleteOS} = require('./os');


//Single get route calls functions from all files to display results on single page
//Admin, Specialist, Employee
router.get('/viewEquipment', checkRoles("admin", "specialist", "employee"), async function(req, res) {
    //Save function returns as variables to send to page as array which can be used to display in tables
    var hware = await getAllHardware();
    var hwareTypes = await getHardwareTypes();
    var sware = await getAllSoftware();
    var swareTypes = await getSoftwareTypes();
    var osys = await getAllOS();

    res.render("viewEquipment", { userName: req.session.userName, role: req.session.userRole, hardware: hware, hardwareTypes: hwareTypes, software: sware, softwareTypes: swareTypes, os: osys });
    //Pass user information from session to display and determine functions
});

//Single get route calls functions from all files to display results on single page
//Admin, Specialist, Employee
router.get('/viewEquipment/:id', checkRoles("admin", "specialist", "employee"), async function(req, res) {
    var hware = await getHardwareById(req);
    var hwareTypes = await getHardwareTypes();
    var sware = await getSoftwareById(req);
    var swareTypes = await getSoftwareTypes();
    var osys = await getOSById(req);

    res.render("viewEquipment", { userName: req.session.userName, role: req.session.userRole, hardware: hware, hardwareTypes: hwareTypes, software: sware, softwareTypes: swareTypes, os: osys });
    //Pass user information from session to display and determine functions
});

//Post route specific to adding hardware, calls addHardware function
//Admin
router.post('/addHardware', checkRoles("admin"), async function(req, res) {
    await addHardware(req, res);
    //After delete redirect back to view equipment page
    //Due to timing redirect is called in addHardware function in hardware.js
    //Pass user information from session to display and determine functions
});

//Post route specific to adding Software, calls addSoftware function
//Admin
router.post('/addSoftware', checkRoles("admin"), async function(req, res) {
    await addSoftware(req, res);
    //After delete redirect back to view equipment page
    res.redirect("/viewEquipment");
    //Pass user information from session to display and determine functions
});

//Post route specific to adding os, calls addOS function
//Admin
router.post('/addOS', checkRoles("admin"), async function(req, res) {
    await addOS(req, res);
    //After delete redirect back to view equipment page
    res.redirect("/viewEquipment");
    //Pass user information from session to display and determine functions
});

//Post route specific to updating hardware, calls updateHardware function
//Display submitted data on submitEquipment page
//Admin
router.patch('/updateHardware/:id', checkRoles("admin"), async function(req, res) {
    if (req.body.update) {
        await updateHardware(req, res);
        var columns = ["Name", "Type", "Serial"];
        var data = [req.body.name, req.body.type, req.body.serial];
        //Save table columns with data being added as arrays, passed to submitEquipment page to be displayed
        res.render("submitEquipment", {userName: req.session.userName, role: req.session.userRole, message: "Hardware Updated:", columns: columns, data: data});
        //Pass user information from session to display and determine functions
    } else if (req.body.delete) { //specific to deleting hardware, calls deleteHardware function
        var result = await deleteHardware(req, res);
        if (result.constructor.name == 'OkPacket') {
            //After delete redirect back to view equipment page
            res.redirect("/viewEquipment");
            //Pass user information from session to display and determine functions
        } else {
            res.redirect('/EquipmentCannotDelete'); //If error direct to submit equipment with error message
        }
    }

});

//Post route specific to updating software, calls updateSoftware function
//Display submitted data on submitEquipment page
//Admin
router.patch('/updateSoftware/:id', checkRoles("admin"), async function(req, res) {
    if (req.body.update) {
        await updateSoftware(req, res);
        var columns = ["Name", "Type", "License"];
        var data = [req.body.name, req.body.type, req.body.license];
        //Save table columns with data being added as arrays, passed to submitEquipment page to be displayed
        res.render("submitEquipment", {userName: req.session.userName, role: req.session.userRole, message: "Software Updated:", columns: columns, data: data});
        //Pass user information from session to display and determine functions
    } else if (req.body.delete) { //specific to deleting software, calls deleteSoftware function
        var result = await deleteSoftware(req, res);
        if (result.constructor.name == 'OkPacket') {
            //After delete redirect back to view equipment page
            res.redirect("/viewEquipment");
            //Pass user information from session to display and determine functions
        } else {
            res.redirect('/EquipmentCannotDelete'); //If error direct to submit equipment with error message
        }
    } 
});

//Post route specific to updating os, calls updateOS function
//Display submitted data on submitEquipment page
//Admin
router.patch('/updateOS/:id', checkRoles("admin"), async function(req, res) {
    if (req.body.update) {
        await updateOS(req, res);
        var columns = ["Name"];
        var data = [req.body.name];
        //Save table columns with data being added as arrays, passed to submitEquipment page to be displayed
        res.render("submitEquipment", {userName: req.session.userName, role: req.session.userRole, message: "OS Updated:", columns: columns, data: data});
        //Pass user information from session to display and determine functions
    } else if (req.body.delete) { //specific to deleting os, calls deleteOS function
        var result = await deleteOS(req, res);
        if (result.constructor.name == 'OkPacket') {
            //After delete redirect back to view equipment page
            res.redirect("/viewEquipment");
            //Pass user information from session to display and determine functions
        } else {
            res.redirect('/EquipmentCannotDelete'); //If error direct to submit equipment with error message
        }
    }
});

//Single get route direct to submit equipment and let user know of delete failue
router.get('/EquipmentCannotDelete', async function(req, res) {
    res.render("submitEquipment", {userName: req.session.userName, role: req.session.userRole, message: "Cannot Delete", columns: "Null", data: "null"});
});

module.exports = router;