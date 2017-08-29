var Client = require('../models/client');

exports.load = function(req, res, next, clientId) {
	Client.findOne({
		_id: clientId
	}).exec(function (err, client){
		if (client){
			req.client = client;
			next();
		}else{ next(new Error('No existe clientId = '+ clientId)) }
	});
}

// Nuevo cliente
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('admin/client/new', { client: new Client(), nav: 'registrar', errors: errors});
}

// Guardar nuevo cliente
exports.create = function (req, res) {
	var client = new Client(req.body.client);

	client.save(function (err) {
		if (err) { 
			return res.render('admin/client/new', { client: client, errors: [{message: err.errors}] });
		}
		req.flash('info', 'Cliente creado con exito!');
		res.redirect('/admin/clients/new');
	});
}

// Formulario editar cliente
exports.edit = function (req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	req.client.edit = true;

	res.render('admin/client/new', { client: req.client, errors: errors, nav: 'registrar' });
}

// Editar un cliente
exports.update = function (req, res) {
	req.client.name = req.body.client.name;
	req.client.email = req.body.client.email;
	req.client.tel = req.body.client.tel;
	req.client.address = req.body.client.address;
	req.client.note = req.body.client.note;

	req.client.save(function (err){
		if (err) {
			req.client.edit = true;
			return res.render('admin/client/new', { client: req.client, errors: [{message: err.errors}], nav: 'registrar' });
		}else{
			req.client = {};
			req.flash('info', 'Cliente editado con exito!');
			res.redirect('/admin/clients/new');
		}
	});
}

// Mostrar un cliente
exports.show = function(req, res){
	res.json(req.client);
};

// Obtener todos los clientes de la BD
exports.all = function (req, res) {
	Client.find({}, function (err, clients) {
		res.json(clients);
	});
}

// Borrar un cliente
exports.delete = function (req, res) {
	Client.findOne({
		_id: req.client._id
	}).remove().exec(function (err){
		if (err) console.log(err);
		req.flash('info', 'Cliente borrado con exito!');
		res.redirect('/admin/clients/new');
	});
}