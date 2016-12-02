var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var Schema = mongoose.Schema;

var MotionSchema = new Schema({
    created: {type: Date, default: Date.now},
    // _creator: { type: Schema.Types.ObjectId, ref: 'User' },
	operation_type: String,
    _item: { type: Schema.Types.ObjectId, ref: 'Item' },
    qty_motion: Float,
    qty: Float
});

module.exports = mongoose.model('Motion', MotionSchema);