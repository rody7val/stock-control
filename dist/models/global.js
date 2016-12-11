var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
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
	},
	rem: {
		type: Float,
		validate: [function(rem){
			return typeof rem === 'number' && rem >= 0;
		}, 'El "Remarque" debe ser un número entero o decimal separado por un punto (ejemplo: "1.3").']
	}
});

module.exports = mongoose.model('Global', GlobalSchema);;