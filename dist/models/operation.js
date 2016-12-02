var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var Schema = mongoose.Schema;

var OperationSchema = new Schema({
	type: String,
    total: Float,
    // _creator: { type: Schema.Types.ObjectId, ref: 'User' },
    _items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Operation', OperationSchema);