var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var Schema = mongoose.Schema;

var GlobalSchema = new Schema({
	title: {
		type: String,
		validate: [function(title){
			return title.length > 0;
		}, 'El "Titulo" no puede estar vacio.']
	},
	desc: {
		type: String,
		validate: [function(desc){
			return desc.length > 0;
		}, 'La "Descripción" no puede estar vacia.']
	}
});

GlobalSchema.plugin(deepPopulate);

module.exports = mongoose.model('Global', GlobalSchema);;