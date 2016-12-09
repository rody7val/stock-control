var User = require('../models/user');

// Autoload - factoriza el código si la ruta incluye :userId
exports.load = function(req, res, next, userId) {
	User.findOne({
		_id: userId
	}).select('name lastname username email password created').exec(function (err, user){
		if (user){
			req.user = user;
			next();
		}else{ next(new Error('No existe userId = '+ userId)) }
	});
}

// Formulario new user
exports.new = function(req, res){
    var errors = req.session.errors || {};
    req.session.errors = {};
    User.count({admin: true}, function (err, count){
	    res.render('public/user/new', { user: new User(), count: count, errors: errors});
    });
}

// Guardar nuevo usuario en la Base de Datos
exports.create = function (req, res) {
	var user = new User(req.body.user);
	// var toekn = user.createToken();
	user.save(function (err) {
		if (err) { 
			User.count({admin: true}, function (Err, count){
				res.render('public/user/new', { user: user, count: count, errors: [{message: err.errors}] });
    		});
		} else {
			req.session.msjFlash = [{message: null, model: req.body.user}];
			res.redirect('/session/success');
		}
	});
}

// Muestra un user
exports.show = function(req, res){
	res.json(req.user);
};

// Obtener todos los usuarios de la Base de Datos
exports.all = function (req, res) {
	User.find({}, function (err, users) {
		if (err) { res.json({success: false, message: err}) };
		res.json({success: true, users: users});
	});
}

// Verificar un usuario registrado en la Base de Datos
exports.autenticar = function (username, password, callback, next) {
	User.findOne({
		username: username
	}).select('name username email password admin created').exec(function (err, user) {
		if (err) {
			return callback( {db: 'Error interno de la base de datos. Contacte al administrador del sitio.\n'+err} );
		} else if (!user) {
			return callback( {username: 'No existe el usuario ('+username+').'} );
		} else{
			var validPassword = user.comparePassword(password);
			if (!validPassword) return callback( {password: 'Contraseña incorrecta.'} );
			else callback(null, user);
		}
	});
}

// Buscar un usuario mediante el emial.
exports.searchUserWithEmail = function (req, res) {
	User.findOne({email: req.param('email')}, function (err, user) {
		if (err) { res.json({success: false, message: err}) };
		res.json(user);
	});
}

// Borrar un usuario de la BD.
exports.delete = function (req, res, id) {
	User.find({_id: id}).remove().exec(function (err){
		if (err) { res.json({success: false, message: err}) };
		res.json({success: true, users: users});
	});
}