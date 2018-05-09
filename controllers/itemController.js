const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Item = require('../models/item');

var async = require('async');

var debug = require('debug')('item');

// Display inventory home page.
exports.home = function(req, res, next) {
    res.render('home');
};

// Display inventory list page.
exports.item_list = function(req, res, next) {
    
    Item.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_items) {
            if(err) {
                debug('list error:' + err); 
                return next(err); 
            }
            //Successful, so render
            res.render('item_list', { title: 'Inventory List', item_list: list_items});
        });
};

// Display item create form on GET.
exports.item_create_get = function(req, res, next) {
    res.render('add_edit_form', {title: 'Add Item', submit_name: 'CREATE'});
};

// Handle item create on POST.
exports.item_create_post = [

    // Validate fields
    body('name').isLength({min: 1}).withMessage('Item name must be specified.')
        .isLength({min: 3}).trim().withMessage('Item name must be at least 3 characters long.')
        .matches('^[A-Za-z0-9 ]+$').withMessage('Name has non-alphanumeric characters.'),
    body('price').isLength({min: 1}).trim().withMessage('Item price must be specified.')
        .matches('^[ ]*([0-9]*\.[0-9][0-9]?)|([0-9]*\.?)[ ]*$', 'g').withMessage('Item price must be in the format 9999.99 or 9999'),
    body('quantity').isLength({min: 1}).trim().withMessage('Item quantity must be specified.')
        .isInt().withMessage('Item quantity must be an integer.'),

    // Sanitize fields
    sanitizeBody('name').trim().escape(),
    sanitizeBody('price').trim().escape(),
    sanitizeBody('quantity').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from request
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('add_edit_form', {title: 'Add Item', submit_name: 'CREATE', item: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Item object with escaped and trimmed data
            var item = new Item(
                {
                    name: req.body.name,
                    price: req.body.price,
                    quantity: req.body.quantity,
                }
            );

            item.save(function(err) {
                if(err) { 
                    return next(err); 
                }
                // Successful - redirect to list.
                res.redirect('/inventory/list');
            });
        }
    }
];

// Display item delete on GET.
exports.item_delete_get = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { 
            debug('delete error:' + err);
            return next(err); 
        }
        if (results.item==null) { // No results.
            res.redirect('/inventory/list');
        }
        // Successful, so render.
        res.render('item_delete', { title: 'Delete Item', item: results.item } );
    }); 
};

// Redirects to delete after finding first item alphabetically in the inventory
exports.item_delete_first_get = function(req, res, next) {
    Item.findOne()
        .sort('name')
        .exec(function (err, item) {
            if(err) { 
                debug('delete error:' + err);
                return next(err); 
            }
            //Successful, so render
            res.redirect(item.url+'/delete');
        });
};

// Handle Item delete on POST.
exports.item_delete_post = function (req, res, next) {

    async.parallel({
        item: function (callback) {
            Item.findById(req.body.itemid).exec(callback)
        },
    }, function (err, results) {
        if (err) { 
            debug('update error:' + err);
            return next(err); 
        }
        // Success, so delete object and redirect to the list of items.
        Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
            if (err) { 
                debug('delete error:' + err);
                return next(err); 
            }
            // Success - go to item list.
            res.redirect('/inventory/list')
        })
    });
};


// Display item update form on GET.
exports.item_update_get = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { 
            debug('update error:' + err);
            return next(err); 
        }
        if (results.item==null) { // No results.
            res.redirect('/inventory/list');
        }
        // Successful, so render.
        res.render('add_edit_form', { title: 'Edit Item', submit_name: 'UPDATE', item: results.item } );
    });
};


// Redirects to update after finding first item alphabetically in list
exports.item_update_first_get = function(req, res, next) {
    Item.findOne()
        .sort('name')
        .exec(function (err, item) {
            if(err) {
                debug('update error:' + err);
                return next(err); 
            }
            //Successful, so render
            res.redirect(item.url+'/update');
        });
};

// Handle item update on POST.
exports.item_update_post = [

    // Validate fields
    body('name').isLength({min: 1}).withMessage('Item name must be specified.')
        .isLength({min: 3}).trim().withMessage('Item name must be at least 3 characters long.')
        .matches('^[A-Za-z0-9 ]+$').withMessage('Name has non-alphanumeric characters.'),
    body('price').isLength({min: 1}).trim().withMessage('Item price must be specified.')
        .matches('^[ ]*([0-9]*\.[0-9][0-9]?)|([0-9]*\.?)[ ]*$', 'g').withMessage('Item price must be in the format 9999.99 or 9999'),
    body('quantity').isLength({min: 1}).trim().withMessage('Item quantity must be specified.')
        .isInt().withMessage('Item quantity must be an integer.'),

    // Sanitize fields
    sanitizeBody('name').trim().escape(),
    sanitizeBody('price').trim().escape(),
    sanitizeBody('quantity').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from request
        const errors = validationResult(req);

        // Create an Item object with escaped/trimmed data and old id.
        var item = new Item(
            {
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                _id:req.params.id
            }
        );

        if(!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('add_edit_form', {title: 'Edit Item', submit_name: 'UPDATE', item: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Item.findByIdAndUpdate(req.params.id, item, {}, function(err, theitem) {
                if(err) { 
                    debug('update error:' + err);
                    return next(err);
                }
                    // Successful - redirect to book detail page.
                    res.redirect('/inventory/list');
            });
        }
    }
];