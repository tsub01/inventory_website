var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
    {
        name: {type: String, required: true, min: 3, max: 50},
        price: {type: Number, required: true, min: 0},
        quantity: {type: Number, required: true, min: 0}
    }
);

// Virtual for item's URL
ItemSchema
.virtual('url')
.get(function () {
    return '/inventory/item/' + this._id;
});

ItemSchema
.virtual('price_formatted')
.get(function () {
    var priceExp1 = RegExp('^[0-9]*\.[0-9][0-9]$');
    var priceExp2 = RegExp('^[0-9]*$');
    
    if( priceExp1.test(this.price)) { return this.price; }
    else if( priceExp2.test(this.price)) { return this.price+'.00'; }
    return this.price+'0';
});


// Export model
module.exports = mongoose.model('Item', ItemSchema);