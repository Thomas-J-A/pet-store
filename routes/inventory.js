const express = require('express');
const router = express.Router();

// Load controller modules
const species_controller = require('../controllers/speciesController');
const animal_controller = require('../controllers/animalController');

// Setup species routes
router.get('/species/create', species_controller.species_create_get);

router.post('/species/create', species_controller.species_create_post);

router.get('/species/:species_name/update', species_controller.species_update_get);

router.post('/species/:species_name/update', species_controller.species_update_post);

router.get('/species/:species_name/delete', species_controller.species_delete_get);

router.post('/species/:species_name/delete', species_controller.species_delete_post);

router.get('/species/:species_name', species_controller.species_detail);

router.get('/species', species_controller.species_list);

// Setup animal routes
router.get('/species/:species_name/create', animal_controller.animal_create_get);

router.post('/species/:species_name/create', animal_controller.animal_create_post);

router.get('/species/:species_name/:animal_id/update', animal_controller.animal_update_get);

router.post('/species/:species_id/:animal_id/update', animal_controller.animal_update_post);

router.get('/species/:species_name/:animal_id/delete', animal_controller.animal_delete_get);

router.post('/species/:species_name/:animal_id/delete', animal_controller.animal_delete_post);

router.get('/species/:species_name/:animal_id', animal_controller.animal_detail);

// Export router object
module.exports = router;
