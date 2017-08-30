function getIds(motions){
	var _items = [];
	motions.forEach(function(item){
		_items.push(item._id);
	});
	return _items;
}

var Buy = require('../models/buy');
var Motion = require('../models/motion');
var Item = require('../models/item');
var config = require('../../config');

exports.load = function(req, res, next, buyId) {
	Buy.findOne({ _id: buyId })
	.deepPopulate('_user _provider _motions._item')
	.exec(function (err, buy){
		if (buy){
			req.buy = buy;
			next();
		}else{ next(new Error('No existe buyId = '+ buyId)) }
	});
}

// Formulario new compra
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	Buy.find({}, function (err, buys) {
    	res.render('admin/buy/new', {
    		buy: new Buy(),
    		buys: buys,
    		errors: errors,
    		nav: 'operacion',
    		moment: require('moment')
    	});
	});
}

// Guardar nueva compra en la Base de Datos
exports.create = function (req, res, next) {
	var options = {
		buy: {},
		motions: [],
	};
	var _ItemsCart = JSON.parse(req.body.buy._items);
	var allMotionSaved = [];
	var errors = [];

	//por cada item del carro
	_ItemsCart.forEach(function (_item){

		options.motions.push(new Motion({
			operation_type: "Compra",
			_user: req.body.buy.user,
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
				//y creamos una nueva compra
				console.log(req.body.buy.date)
				options.buy = new Buy({
					date: req.body.buy.date,
					items_qty: Number(req.body.buy.items_qty),
					total: Number(req.body.buy.total),
					_user: req.body.buy.user,
					_provider: req.body.buy.provider,
					_motions: motionsIds
				})
				.save(function (err, buy) {
					if (err) next(new Error('No se pudo realizar la operación'));

					// ahora asociamos el producto a la compra
					motionsIds.forEach(function(id){
						Motion.findOne({
							_id: id
						}).exec(function (err, motion){
							if (err) errors.push(err);
							motion._buy = buy._id;
							motion.save(function (err, Item){
								if (err) errors.push(err);
							});
						});
					});

					if (!errors.length) {
						Buy.findOne(buy)
						.deepPopulate('_user _provider _motions._item')
						.exec(function(err, buy) {

							req.flash('info', 'Compra realizada con exito!');
							res.redirect('/admin/buys/' + buy._id);

						})
					}
				});
			}


		}));
	});
}

exports.show = function(req, res){
	res.render('admin/buy/show', { buy: JSON.stringify(req.buy), nav: 'informe', moment: require('moment') });
};

exports.buy = function(req, res) {
	res.render('admin/buy/report_buy', {nav: 'informe', moment: require('moment')});
}

exports.all = function(req, res) {
	Buy
		.find()
		.deepPopulate('_user _provider _motions._item')
		.exec(function (err, buys){
			res.json(buys);
		});
}