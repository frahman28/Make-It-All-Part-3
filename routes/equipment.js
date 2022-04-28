var express = require('express');
var router = express.Router();

var conn = require('../config')
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

    res.render("viewEquipment", { userName: req.session.userName, hardware: hware, hardwareTypes: hwareTypes, software: sware, softwareTypes: swareTypes, os: osys });
});

//Single get route calls functions from all files to display results on single page
//Admin, Specialist, Employee
router.get('/viewEquipment/:id', checkRoles("admin", "specialist", "employee"), async function(req, res) {
    var hware = await getHardwareById(req);
    var hwareTypes = await getHardwareTypes();
    var sware = await getSoftwareById(req);
    var swareTypes = await getSoftwareTypes();
    var osys = await getOSById(req);

    res.render("viewEquipment", { userName: req.session.userName, hardware: hware, hardwareTypes: hwareTypes, software: sware, softwareTypes: swareTypes, os: osys });
});

//Post route specific to adding hardware, calls addHardware function
//Admin
router.post('/addHardware', checkRoles("admin"), async function(req, res) {
    await addHardware(req, res);
});

//Post route specific to adding Software, calls addSoftware function
//Admin
router.post('/addSoftware', checkRoles("admin"), async function(req, res) {
    await addSoftware(req, res);
});

//Post route specific to adding os, calls addOS function
//Admin
router.post('/addOS', checkRoles("admin"), async function(req, res) {
    await addOS(req, res);
});

//Post route specific to updating hardware, calls updateHardware function
//Admin
router.patch('/updateHardware/:id', checkRoles("admin"), async function(req, res) {
    await updateHardware(req, res);
});

//Post route specific to updating software, calls updateSoftware function
//Admin
router.patch('/updateSoftware/:id', checkRoles("admin"), async function(req, res) {
    await updateSoftware(req, res);
});

//Post route specific to updating os, calls updateOS function
//Admin
router.patch('/updateOS/:id', checkRoles("admin"), async function(req, res) {
    await updateOS(req, res);
});

//Post route specific to deleting hardware, calls deleteHardware function
//Admin
router.delete('/deleteHardware/:id', checkRoles("admin"), async function(req, res) {
    await deleteHardware(req, res);
});

//Post route specific to deleting software, calls deleteSoftware function
//Admin
router.delete('/deleteSoftware/:id', checkRoles("admin"), async function(req, res) {
    await deleteSoftware(req, res);
});

//Post route specific to deleting os, calls deleteOS function
//Admin
router.delete('/deleteOS/:id', checkRoles("admin"), async function(req, res) {
    await deleteOS(req, res);
});

module.exports = router;