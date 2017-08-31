function getIds(motions){
	var _items = [];
	motions.forEach(function(item){
		_items.push(item._id);
	});
	return _items;
}

var Sale = require('../models/sale');
var Motion = require('../models/motion');
var Item = require('../models/item');
var config = require('../../config');

// Autoload - factoriza el código si la ruta incluye :operationId
exports.load = function(req, res, next, saleId) {
	Sale.findOne({ _id: saleId })
	.deepPopulate('_user _client _motions._item')
	.exec(function (err, sale){
		if (sale){
			req.sale = sale;
			next();
		}else{ next(new Error('No existe saleId = '+ saleId)) }
	});
}

// Formulario new venta
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	Sale.find({}, function (err, sales) {
    	res.render('admin/sale/new', {
    		sale: new Sale(),
    		sales: sales,
    		errors: errors,
    		nav: 'operacion',
    		moment: require('moment')
    	});
	});
}

// Guardar nueva venta en la Base de Datos
exports.create = function (req, res, next) {
	var options = {
		sale: {},
		motions: [],
	};
	var _ItemsCart = JSON.parse(req.body.sale._items);
	var allMotionSaved = [];
	var errors = [];

	//por cada item del carro
	_ItemsCart.forEach(function (_item){

		options.motions.push(new Motion({
			operation_type: "Venta",
			_user: req.body.sale.user,
			_item: _item._id,
			qty_motion: _item.qty_motion,
   			qty: _item.qty,
			item_price: Number(_item.price),
			item_rem: Number(_item.rem)
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
				//y creamos una nueva venta
				console.log(req.body.sale.date)
				options.sale = new Sale({
					date: req.body.sale.date,
					items_qty: Number(req.body.sale.items_qty),
					sale_value: Number(req.body.sale.sale_value),
					total: Number(req.body.sale.total),
					rem: Number(req.body.sale.rem),
					_user: req.body.sale.user,
					_client: req.body.sale.client,
					_motions: motionsIds
				})
				.save(function (err, sale) {
					if (err) next(new Error('No se pudo realizar la operación'));

					// ahora asociamos el producto a la venta
					motionsIds.forEach(function(id){
						Motion.findOne({
							_id: id
						}).exec(function (err, motion){
							if (err) errors.push(err);
							motion._sale = sale._id;
							motion.save(function (err, Item){
								if (err) errors.push(err);
							});
						});
					});

					if (!errors.length) {
						Sale.findOne(sale)
						.deepPopulate('_user _client _motions._item')
						.exec(function(err, sale) {

							req.flash('info', 'Venta realizada con exito!');
							res.redirect('/admin/sales/' + sale._id);

						})
					}
				});
			}


		}));
	});
}

exports.show = function(req, res){
	res.render('admin/sale/show', { sale: JSON.stringify(req.sale), nav: 'informe', moment: require('moment') });
};

exports.sale = function(req, res) {
	res.render('admin/sale/report_sale', {nav: 'informe', moment: require('moment')});
}

exports.all = function(req, res) {
	Sale
		.find()
		.deepPopulate('_user _client _motions._item')
		.exec(function (err, sales){
			res.json(sales);
		});
}