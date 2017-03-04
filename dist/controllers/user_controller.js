function changeType(type){
	switch(type){
		case 'client':
			return 'Cliente'
			break;
		case 'admin':
			return 'Administrador'
			break;
		case 'provider':
			return 'Proveedor'
			break;
	}
}

var User = require('../models/user');

// Autoload - factoriza el código si la ruta incluye :userId
exports.load = function(req, res, next, userId) {
	User.findOne({
		_id: userId
	}).exec(function (err, user){
		if (user){
			req.user = user;
			next();
		}else{ next(new Error('No existe userId = '+ userId)) }
	});
}

// Formulario nuevo usuario desde el sitio web
exports.new = function(req, res){
    var errors = req.session.errors || {};
    req.session.errors = {};
    User.count({admin: true}, function (err, count){
	    res.render('public/user/new', { user: new User(), count: count, errors: errors});
    });
}

// Guardar nuevo usuario en la BD desde el sitio web
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

// Formulario nuevo usuario desde administración
exports.new_fromAdmin = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	var type = (req.query.type == 'client' ||  req.query.type == 'admin' || req.query.type == 'provider') ? req.query.type : res.redirect('/admin');

	res.render('admin/user/new', { user: new User(), type: type, nav: 'registrar', errors: errors});
}

// Guardar nuevo usuario en la BD desde administración
exports.create_fromAdmin = function (req, res) {
	console.log(req.body.user);
	var user = new User(req.body.user);
	// var toekn = user.createToken();
	user.save(function (err) {
		if (err) { 
			User.count({admin: true}, function (Err, count){
				res.render('admin/user/new', { user: user, count: count, errors: [{message: err.errors}] });
    		});
		} else {
			req.flash('info', 'Usuario Administrador creado con exito!');
			res.redirect('/admin');
			// req.session.msjFlash = [{message: null, model: req.body.user}];
			// res.redirect('/admin/users/new?type='+req.query.type);
		}
	});
}

// Formulario editar usuario
exports.edit = function (req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	var type = (req.query.type == 'admin' || req.query.type == 'client' || req.query.type == 'provider') ? req.query.type : res.redirect('/admin');

	req.user.edit = true;
	console.log(req.user)

	res.render('admin/user/new', { user: req.user, errors: errors, nav: 'registrar' });
}

// Editar un usuario
exports.update = function (req, res) {
	req.user.name = req.body.user.name;
	req.user.email = req.body.user.email;
	req.user.username = req.body.user.username;
	req.user.tel = req.body.user.tel;
	req.user.type = req.body.user.type;
	req.user.admin = req.body.user.admin;

	req.user.save(function (err){
		if (err) {
			req.user.edit = true;
			return res.render('admin/user/new', { user: req.user, errors: [{message: err.errors}], nav: 'registrar' });
		}else{
			req.user = {};
			req.flash('info', 'Usuario editado con exito!');
			res.redirect('/admin');
		}
	});
}

// Mostrar un usuario
exports.show = function(req, res){
	res.json(req.user);
};

// Obtener todos los usuarios de la BD
exports.all = function (req, res) {
	User.find({}, function (err, users) {
		res.json(users);
	});
}

// Borrar un usuario
exports.delete = function (req, res) {
	User.findOne({
		_id: req.user._id
	}).remove().exec(function (err){
		if (err) console.log(err);
		req.flash('info', 'Usuario borrado con exito!');
		res.redirect('/admin');
	});
}

// Verificar un usuario registrado en la Base de Datos
exports.autenticar = function (username, password, callback) {
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

// Buscar un usuario mediante el emial
exports.searchUserWithEmail = function (req, res) {
	User.findOne({email: req.param('email')}, function (err, user) {
		if (err) { res.json({success: false, message: err}) };
		res.json(user);
	});
}