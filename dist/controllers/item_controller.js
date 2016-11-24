var Item = require('../models/item');
var config = require('../../config');

// Autoload - factoriza el código si la ruta incluye :itemId
exports.load = function(req, res, next, itemId) {
	Item.findOne({
		_id: itemId
	}).select('name code price qty desc image created').exec(function (err, item){
		if (item){
			req.item = item;
			next();
		}else{ next(new Error('No existe itemId = '+ itemId)) }
	});
}

// find intem
exports.find = function(req, res) {
	var query,
		key = req.query.key || '',
		value = req.query.value || '';

	switch(key){
		case 'name':
			query = Item.find({ name: new RegExp(value, 'i') })
				.select('name code price qty desc image created');
			break;

		case 'code':
			query = Item.find({ code: value })
				.select('name code price qty desc image created');
			break;

		default:
			query = Item.find({ name: new RegExp(value, 'i') })
				.select('name code price qty desc image created');
	}

	query.exec(function (err, items){
		if (err) return res.redirect('/');
		else res.render('index', { items: items, key: key, value: value});
	});

}

// Home
exports.index = function(req, res){
	Item.find({}, function (err, items) {
		res.render('index', { items: items });
	});
}

// Formulario new item y devuelve todos los items
exports.new = function(req, res){
	var errors = req.session.errors || {};
  req.session.errors = {};

	Item.find({}, function (err, items) {
    	res.render('item/new', { item: new Item(), items: items, errors: errors });
	});
}

// Guardar nuevo item en la Base de Datos y devuelve todos los items
exports.create = function (req, res) {
	var item = new Item({
		name: req.body.item.name,
		code: Number(req.body.item.code),
		price: Number(req.body.item.price),
		qty: Number(req.body.item.qty),
		desc: req.body.item.desc
	});

	item.save(function (err) {
		Item.find({}, function (errors, items) {
			if (err) return res.render('item/new', { item: item, items: items, errors: [{message: err.errors}] });
			else res.redirect('/item/new');
		});
	});
}

// Muestra un item
exports.show = function(req, res){
	res.render('item/show', { item: req.item });
};

// Formulario edit item
exports.edit = function (req, res) {
	var errors = req.session.errors || {};
  req.session.errors = {};

	var item = req.item;
	item.edit = true;

	Item.find({}, function (err, items) {
		res.render('item/new', { item: item, items: items, errors: errors });
	});
}

// Editar un item
exports.update = function (req, res) {
	req.item.name = req.body.item.name;
	req.item.code = Number(req.body.item.code);
	req.item.price = Number(req.body.item.price);
	req.item.qty = Number(req.body.item.qty);
	req.item.desc = req.body.item.desc;

	req.item.save(function (err){
		Item.find({}, function (errors, items) {
			if (err) return res.render('item/new', { item: item, items: items, errors: [{message: err.errors}] });
				req.item = {};
				res.redirect('/item/new');
		});
	});
}

// Obtener todos los items
exports.all = function (req, res) {
	Item.find({}, function (err, items) {
		res.json(items);
	});
}

// Borrar un item
exports.delete = function (req, res) {
	Item.findOne({
		_id: req.item._id
	}).remove().exec(function (err){
		if (err) console.log(err);
		res.redirect('/item/new');
	});
}