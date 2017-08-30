var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var SaleSchema = new Schema({
	date: String,
	items_qty: Number,
	sale_value: Float,
    total: Float,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _client: { type: Schema.Types.ObjectId, ref: 'Client' },
    _motions: [{ type: Schema.Types.ObjectId, ref: 'Motion' }],
    rem: Float,
    created: {type: Date, default: Date.now}
});

SaleSchema.plugin(deepPopulate);

module.exports = mongoose.model('Operation', SaleSchema);