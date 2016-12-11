function getIds(motions){
	var _items = [];
	motions.forEach(function(item){
		_items.push(item._id);
	});
	return _items;
}

function changeType(type){
	var _type;
	switch(type){
		case 'sale':
			_type = 'Venta'
			break;
		case 'buy':
			_type = 'Compra'
			break;
		default:
			_type = 'Registro manual'
	}
	return _type;
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
    	res.render('admin/operation/new', {
    		operation: new Operation(),
    		operations: operations,
    		type: type,
    		errors: errors,
    		nav: 'operacion'
    	});
	});
}

// Guardar nueva operation en la Base de Datos
exports.create = function (req, res, next) {
	var _Motions = JSON.parse(req.body.operation._items);
	var _Items = getIds(_Motions);

	//una operacion
	new Operation({
		type: changeType(req.body.operation.type),
		total: Number(req.body.operation.total),
		_items: _Items
	})
	.save(function (err, operation) {
		if (err) next(new Error('No se pudo realizar la operacion'));
		var errors = [];
		//tiene muchos movimientos
		_Motions.forEach(function (_motion){
			new Motion({
				operation_type: changeType(req.body.operation.type),
				_item: _motion._id,
				qty_motion: _motion.qty_motion,
    		qty: _motion.qty
			})
			.save(function (err, motion){
				if (err) errors.push(err);
				//y cada movimiento, le pertenece a un item
				Item.findById(_motion._id, function (err, item){
					if (err) errors.push(err);
					item.qty = _motion.qty;
					item._motions.push(motion._id);
					item.save(function (err, Item){
						if (err) errors.push(err);
					});
				})
			})
		});
		if (!errors.length) {

			res.render('admin/operation/success', {
				options: JSON.stringify({
					type: changeType(req.body.operation.type),
					items_qty: req.body.operation.items_qty,
					sale_value: req.body.operation.sale_value,
					total: req.body.operation.total,
					remarque: req.body.operation.rem,
					_items: _Motions
				})
			});
		}
	});
}