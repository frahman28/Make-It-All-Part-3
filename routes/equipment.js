var express = require('express');
var router = express.Router();

var conn = require('../config');

//Import all functions from hardware, software, os files to interact with database
var {getAllHardware, getHardwareTypes, getHardwareById, addHardware, updateHardware, deleteHardware} = require('./hardware');
var {getAllSoftware, getSoftwareTypes, getSoftwareById, addSoftware, updateSoftware, deleteSoftware} = require('./software');
var {getAllOS, getOSById, addOS, updateOS, deleteOS} = require('./os');


//Single get route calls functions from all files to display results on single page
router.get('/viewEquipment', async function(req, res) {
    //Save function returns as variables to send to page as array which can be used to display in tables
    var hware = await getAllHardware();
    var hwareTypes = await getHardwareTypes();
    var sware = await getAllSoftware();
    var swareTypes = await getSoftwareTypes();
    var osys = await getAllOS();

    res.render("viewEquipment", { hardware: hware, hardwareTypes: hwareTypes, software: sware, softwareTypes: swareTypes, os: osys });
});

//Single get route calls functions from all files to display results on single page
router.get('/viewEquipment/:id', async function(req, res) {
    var hware = await getHardwareById(req);
    var sware = await getSoftwareById(req);
    var osys = await getOSById(req);

    res.render("viewEquipment", { hardware: hware, software: sware, os: osys });
});

//Post route specific to adding hardware, calls addHardware function
router.post('/addHardware', async function(req, res) {
    await addHardware(req, res);  
});

//Post route specific to adding Software, calls addSoftware function
router.post('/addSoftware', async function(req, res) {
    await addSoftware(req, res);
});

//Post route specific to adding os, calls addOS function
router.post('/addOS', async function(req, res) {
    await addOS(req, res);
});

//Post route specific to updating hardware, calls updateHardware function
router.patch('/updateHardware', async function(req, res) {
    await updateHardware(req, res);
});

//Post route specific to updating software, calls updateSoftware function
router.patch('/updateSoftware', async function(req, res) {
    await updateSoftware(req, res);
});

//Post route specific to updating os, calls updateOS function
router.patch('/updateOS', async function(req, res) {
    await updateOS(req, res);
});

//Post route specific to deleting hardware, calls deleteHardware function
router.delete('/deleteHardware', async function(req, res) {
    await deleteHardware(req, res);
});

//Post route specific to deleting software, calls deleteSoftware function
router.delete('/deleteSoftware', async function(req, res) {
    await deleteSoftware(req, res);
});

//Post route specific to deleting os, calls deleteOS function
router.delete('/deleteOS', async function(req, res) {
    await deleteOS(req, res);
});

module.exports = router;