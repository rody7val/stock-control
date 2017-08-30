var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Modelo Proveedor
var ProviderSchema = new Schema({
    name: {
        type: String,
        index: {unique: true},
        validate: [function(name){
            return name.length >= 0;
        }, 'El "Nombre" no puede estar vacio.']
    },
    email: {
        type: String,
        index: {unique: true},
        validate: [function(email){
            return !(!email.match(/.+\@.+\..+/));
        }, 'El "Email" es incorrecto.']
    },
    tel: String,
    address: String,
    note: String,
    created: {
        type: Date,
        default: Date.now
    }
});

ProviderSchema.plugin(uniqueValidator, { message: 'Lo sentimos, el {PATH} ({VALUE}) ya existe. Prueba con otro?' });
ProviderSchema.plugin(deepPopulate);

module.exports = mongoose.model('Provider', ProviderSchema);
