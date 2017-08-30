var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var BuySchema = new Schema({
	date: String,
	items_qty: Number,
    total: Float,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
    _motions: [{ type: Schema.Types.ObjectId, ref: 'Motion' }],
    created: {type: Date, default: Date.now}
});

BuySchema.plugin(deepPopulate);

module.exports = mongoose.model('Buy', BuySchema);