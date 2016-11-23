var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// Modelo User
var UserSchema = new Schema({
    name: {
        type: String,
        index: true,
        validate: [function(name){
            return name.length >= 3;
        }, 'El "Nombre" debe tener tres o más caracteres.']
    },
    email: {
        type: String,
        index: {unique: true},
        validate: [function(email){
            return !(!email.match(/.+\@.+\..+/));
        }, 'El "Email" es incorrecto.']
    },
    username: {
        type: String,
        index: {unique: true},
        validate: [function(username){
            return username.length >= 3;
        }, 'El "Usuario" debe tener tres o más caracteres.']
    },
    password: {
        type: String,
        select: false,
        validate: [function(password){
            return password.length >= 6;
        }, 'La "Contraseña" debe tener seis o mas caracteres.']
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Cifrar la contraseña del usuario antes de guardarlo en la BD
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

// Comparar contraseñas
UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

UserSchema.plugin(uniqueValidator, { message: 'Lo sentimos, el {PATH} ({VALUE}) ya existe. Prueba con otro?' });

module.exports = mongoose.model('User', UserSchema);
