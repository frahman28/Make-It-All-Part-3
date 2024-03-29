var express = require('express');
var router = express.Router();

var conn = require('../dbconfig')
var {verifySession, checkRoles} = require("../utils/auth.utils")

//Import all functions from hardware, software, os files to interact with database
var {getAllHardware, getHardwareTypes, getHardwareById, addHardware, updateHardware, deleteHardware} = require('../utils/hardware.utils');
var {getAllSoftware, getSoftwareTypes, getSoftwareById, addSoftware, updateSoftware, deleteSoftware} = require('../utils/software.utils');
var {getAllOS, getOSById, addOS, updateOS, deleteOS} = require('../utils/os.utils');


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
        res.redirect("/viewEquipment");
        //Pass user information from session to display and determine functions
    } else if (req.body.delete) { //specific to deleting hardware, calls deleteHardware function
        var result = await deleteHardware(req, res);
        if (result.constructor.name == 'OkPacket') {
            //After delete redirect back to view equipment page
            res.redirect("/viewEquipment");
            //Pass user information from session to display and determine functions
        } else {
            var string = encodeURIComponent("CannotDelete");
            res.redirect("/viewEquipment" + string);
        }
    }

});

//Post route specific to updating software, calls updateSoftware function
//Display submitted data on submitEquipment page
//Admin
router.patch('/updateSoftware/:id', checkRoles("admin"), async function(req, res) {
    if (req.body.update) {
        await updateSoftware(req, res);
        res.redirect("/viewEquipment");
        //Pass user information from session to display and determine functions
    } else if (req.body.delete) { //specific to deleting software, calls deleteSoftware function
        var result = await deleteSoftware(req, res);
        if (result.constructor.name == 'OkPacket') {
            //After delete redirect back to view equipment page
            res.redirect("/viewEquipment");
            //Pass user information from session to display and determine functions
        } else {
            var string = encodeURIComponent("CannotDelete");
            res.redirect("/viewEquipment" + string);
        }
    } 
});

//Post route specific to updating os, calls updateOS function
//Display submitted data on submitEquipment page
//Admin
router.patch('/updateOS/:id', checkRoles("admin"), async function(req, res) {
    if (req.body.update) {
        await updateOS(req, res);
        res.redirect("/viewEquipment");
        //Pass user information from session to display and determine functions
    } else if (req.body.delete) { //specific to deleting os, calls deleteOS function
        var result = await deleteOS(req, res);
        if (result.constructor.name == 'OkPacket') {
            //After delete redirect back to view equipment page
            res.redirect("/viewEquipment");
            //Pass user information from session to display and determine functions
        } else {
            var string = encodeURIComponent("CannotDelete");
            res.redirect("/viewEquipment" + string);
        }
    }
});

//Single get route calls functions from all files to display results on single page
//For if an error in deleting an equipment
//Admin, Specialist, Employee
router.get('/viewEquipmentCannotDelete', checkRoles("admin", "specialist", "employee"), async function(req, res) {
    //Save function returns as variables to send to page as array which can be used to display in tables
    var hware = await getAllHardware();
    var hwareTypes = await getHardwareTypes();
    var sware = await getAllSoftware();
    var swareTypes = await getSoftwareTypes();
    var osys = await getAllOS();

    res.render("viewEquipment", { userName: req.session.userName, role: req.session.userRole, hardware: hware, hardwareTypes: hwareTypes, software: sware, softwareTypes: swareTypes, os: osys });
    //Pass user information from session to display and determine functions
});

module.exports = router;