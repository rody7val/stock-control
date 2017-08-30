var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var MotionSchema = new Schema({
	operation_type: String,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _item: { type: Schema.Types.ObjectId, ref: 'Item' },
    _sale: { type: Schema.Types.ObjectId, ref: 'Sale' },
    _buy: { type: Schema.Types.ObjectId, ref: 'Buy' },
    qty_motion: Number,
    qty: Number,
    item_price: Float,
    created: {type: Date, default: Date.now}
});

MotionSchema.plugin(deepPopulate);

module.exports = mongoose.model('Motion', MotionSchema);