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
	}).exec(function (err, operation){
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
    		nav: 'operacion',
    		moment: require('moment')
    	});
	});
}

// Guardar nueva operation en la Base de Datos
exports.create = function (req, res, next) {
	var operation = {
		sale: {},
		motions: [],
	};
	var _ItemsCart = JSON.parse(req.body.operation._items);
	var allMotionSaved = [];
	var errors = [];

	//por cada item del carro
	_ItemsCart.forEach(function (_item){

		operation.motions.push(new Motion({
			operation_type: changeType(req.body.operation.type),
			_item: _item._id,
			qty_motion: _item.qty_motion,
   			qty: _item.qty,
			item_price: Number(_item.price)
		})
		//guardar un nuevo movimiento
		.save(function (err, motion){
			if (err) errors.push(err);

			allMotionSaved.push(motion);
			//y lo asociamos a un producto
			Item.findById(_item._id, function (err, item){
				if (err) errors.push(err);

				item.qty = _item.qty;
				item._motions.push(motion._id);
				item.save(function (err, Item){
					if (err) errors.push(err);
				});
			})

	
			//si es el ultimo valor del array (para mantener las variables de entorno)
			if (_ItemsCart[_ItemsCart.length-1]._id == _item._id){
				//obtenemos los ids de los movimientos creados
				var motionsIds = getIds(allMotionSaved);
				//y creamos una nueva operación
				console.log(req.body.operation.date)
				operation.sale = new Operation({
					date: req.body.operation.date,
					type: changeType(req.body.operation.type),
					items_qty: Number(req.body.operation.items_qty),
					sale_value: Number(req.body.operation.sale_value),
					total: Number(req.body.operation.total),
					rem: Number(req.body.operation.rem),
					_motions: motionsIds
				})
				.save(function (err, operation) {
					if (err) next(new Error('No se pudo realizar la operación'));

					motionsIds.forEach(function(id){
						Motion.findOne({
							_id: id
						}).exec(function (err, motion){
							if (err) errors.push(err);
							motion._operation = operation._id;
							motion.save(function (err, Item){
								if (err) errors.push(err);
							});
						});
					});

					if (!errors.length) {
						res.render('admin/operation/success', {
							options: JSON.stringify({
								date: req.body.operation.date,
								type: changeType(req.body.operation.type),
								items_qty: req.body.operation.items_qty,
								sale_value: req.body.operation.sale_value,
								total: req.body.operation.total,
								remarque: req.body.operation.rem,
								_items: _ItemsCart // allMotionSaved
							}),
							nav: 'operacion'
						});
					}
				});
			}


		}));
	});
}


exports.sale = function(req, res) {
	res.render('admin/operation/report_sale', {nav: 'informe', moment: require('moment')});
}

exports.all = function(req, res) {
	Operation
		.find()
		.deepPopulate('_motions._item')
		.exec(function (err, operations){
			res.json(operations);
		});
}