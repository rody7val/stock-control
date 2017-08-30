var Provider = require('../models/provider');

exports.load = function(req, res, next, providerId) {
	Provider.findOne({
		_id: providerId
	}).exec(function (err, provider){
		if (provider){
			req.provider = provider;
			next();
		}else{ next(new Error('No existe providerId = '+ providerId)) }
	});
}

// Nuevo proveedor
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('admin/provider/new', { provider: new Provider(), nav: 'registrar', errors: errors});
}

// Guardar nuevo proveedor
exports.create = function (req, res) {
	var provider = new Provider(req.body.provider);

	provider.save(function (err) {
		if (err) { 
			return res.render('admin/provider/new', { provider: provider, errors: [{message: err.errors}] });
		}
		req.flash('info', 'Proveedor creado con exito!');
		res.redirect('/admin/providers/new');
	});
}

// Formulario editar cliente
exports.edit = function (req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	req.provider.edit = true;

	res.render('admin/provider/new', { provider: req.provider, errors: errors, nav: 'registrar' });
}

// Editar un cliente
exports.update = function (req, res) {
	req.provider.name = req.body.provider.name;
	req.provider.email = req.body.provider.email;
	req.provider.tel = req.body.provider.tel;
	req.provider.address = req.body.provider.address;
	req.provider.note = req.body.provider.note;

	req.provider.save(function (err){
		if (err) {
			req.provider.edit = true;
			return res.render('admin/provider/new', { provider: req.provider, errors: [{message: err.errors}], nav: 'registrar' });
		}else{
			req.provider = {};
			req.flash('info', 'Proveedor editado con exito!');
			res.redirect('/admin/providers/new');
		}
	});
}

// Mostrar un cliente
exports.show = function(req, res){
	res.json(req.provider);
};

// Obtener todos los clientes de la BD
exports.all = function (req, res) {
	Provider.find({}, function (err, providers) {
		res.json(providers);
	});
}

// Borrar un cliente
exports.delete = function (req, res) {
	Provider.findOne({
		_id: req.provider._id
	}).remove().exec(function (err){
		if (err) console.log(err);
		req.flash('info', 'Proveedor borrado con exito!');
		res.redirect('/admin/providers/new');
	});
}