var express = require('express');
var router = express.Router();

// Require controller module
var item_controller = require('../controllers/itemController');

/// Routes ///

// GET inventory home page.
router.get('/', item_controller.home);

// GET inventory list.
router.get('/list', item_controller.item_list);

// GET request for creating an inventory item
router.get('/item/create', item_controller.item_create_get);

// POST request for creating an inventory item
router.post('/item/create', item_controller.item_create_post);

// GET request for deleting item directly from home page
router.get('/item/delete', item_controller.item_delete_first_get);

// GET request for deleting an inventory item
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request for deleting an inventory item
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request for updating item directly from home page
router.get('/item/update', item_controller.item_update_first_get);

// GET request for updating an inventory item
router.get('/item/:id/update', item_controller.item_update_get);

// POST request for updating an inventory item
router.post('/item/:id/update', item_controller.item_update_post);



module.exports = router;