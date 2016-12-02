function getIds(motions){
	var _items = [];
	motions.forEach(function(item){
		_items.push(item._id);
	});
	console.log(_items);
	return _items;
}

var Operation = require('../models/operation');
var Motion = require('../models/motion');
var Item = require('../models/item');
var config = require('../../config');

// Autoload - factoriza el código si la ruta incluye :operationId
exports.load = function(req, res, next, operationId) {
	Operation.findOne({
		_id: operationId
	}).select('total _items type created').exec(function (err, operation){
		if (operation){
			req.operation = operation;
			next();
		}else{ next(new Error('No existe operationId = '+ operationId)) }
	});
}

// Formulario new operation
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	var type = (req.query.type == 'sale' ||  req.query.type == 'buy' || req.query.type == 'manual') ? req.query.type : res.redirect('/');

	Operation.find({}, function (err, operations) {
    	res.render('operation/new', { operation: new Operation(), operations: operations, type: type, errors: errors });
	});
}

// Guardar nueva operation en la Base de Datos
exports.create = function (req, res, next) {
	var motions = JSON.parse(req.body.operation._items);
	var _items = getIds(motions);

	var operation = new Operation({
		type: req.body.operation.type,
		total: Number(req.body.operation.total),
		_items: _items
	});

	//una operacion
	operation.save(function (err) {
		if (err) next(new Error('No se pudo realizar la operacion'));
		var errors = [];
		//tiene muchos movimientos
		motions.forEach(function(item){
			var motion = new Motion({
				operation_type: req.body.operation.type,
				_item: item._id,
				qty_motion: item.qty_motion,
    			qty: item.qty
			}).save(function (error){
				if (error) errors.push(error);
				//y cada movimiento, le pertenece a un item
				Item.update({_id: item._id}, {
					qty: item.qty
				}, function (Err, num, raw){
					if (Err) errors.push(Err);
				});
			})
		});
		if (!errors.length) res.render('operation/success');
	});
}