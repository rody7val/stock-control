var Item = require('../models/item');
var Motion = require('../models/motion');
var config = require('../../config');

// Autoload - factoriza el código si la ruta incluye :itemId
exports.load = function(req, res, next, itemId) {
	Item.findOne({
		_id: itemId
	}).exec(function (err, item){
		if (item){
			req.item = item;
			next();
		}else{ next(new Error('No existe itemId = '+ itemId)) }
	});
}

// Public Home
exports.public = function(req, res){
	res.render('public/');
}

// Informe Stock
exports.stock = function(req, res){
	res.render('admin/item/report_stock', {nav: 'informe'});
}

// Devuelve un json con arrays de a 3 items
exports.getRowsItems = function(req, res){

	function getRows(items) {
	    return items.reduce(function (prev, item, i) {
	        if(i % 3 === 0)
	            prev.push([item]);
	        else
	            prev[prev.length - 1].push(item);
	        return prev;
	    }, []);
	}

	Item.find({}).exec(function (err, items){
		res.json( getRows(items) );
	});

}

// Formulario new item
exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};
	res.render('admin/item/new', { item: new Item(), errors: errors, nav: 'registrar' });
}

// Guardar nuevo item en la Base de Datos
exports.create = function (req, res) {
	var item = new Item({
		name: req.body.item.name,
		code: Number(req.body.item.code),
		price: Number(req.body.item.price),   //to number
		qty: Number(req.body.item.qty),
		desc: req.body.item.desc
	})

	item.save(function (err) {
		if (err) {
			item._price = req.body.item.price;   // to string
			return res.render('admin/item/new', { item: item, errors: [{message: err.errors}], nav: 'registrar'});
		}
		res.redirect('/admin/item/new');
	});
}

// Muestra un item
exports.show = function(req, res){
	
	Motion
	.find({ _id: { $in: req.item._motions } })
	.sort({created: -1})
	.exec(function (err, motions){
		if (err) console.log(err);
		res.render('admin/item/show', { item: req.item, motions: motions, nav: 'informe', moment: require('moment') });
	});

};

// Formulario edit item
exports.edit = function (req, res) {
	var errors = req.session.errors || {};
  	req.session.errors = {};

	req.item.edit = true;
	req.item._price = req.item.price;

	res.render('admin/item/new', { item: req.item, errors: errors, nav: 'registrar' });
}

// Editar un item
exports.update = function (req, res) {
	req.item.name = req.body.item.name;
	req.item.code = Number(req.body.item.code);
	req.item.price = Number(req.body.item.price);
	req.item.qty = Number(req.body.item.qty);
	req.item.desc = req.body.item.desc;

	req.item.save(function (err){
		if (err) {
			req.item.edit = true;
			req.item._price = req.body.item.price;
			return res.render('admin/item/new', { item: req.item, errors: [{message: err.errors}], nav: 'registrar' });
		}else{
			req.item = {};
			res.redirect('/admin/item/new');
		}
	});
}

// Obtener todos los items en json
exports.all = function (req, res) {
	Item.find({}, function (err, items) {
		res.json(items);
	});
}

// Obtener todos los items en cuotas
exports.load_items = function (req, res, next) {
	var skip = Number(req.query.skip) || 0;
	var limit = Number(req.query.limit) || 50;

	Item
		.find({})
		.lean()
		.skip(skip)
		.limit(limit)
		.exec(function (err, items) {
			if (err) next(new Error('a ver que onda los parametros. limit='+ limit + ' skip='+skip+'\n'+err))
		res.json(items);
	})
}

// Borrar un item
exports.delete = function (req, res) {
	Item.findOne({
		_id: req.item._id
	}).remove().exec(function (err){
		if (err) console.log(err);
		res.redirect('/admin/item/new');
	});
}

// Stock excel-exports
exports.stock_exports = function(req, res){
	var nodeExcel = require('excel-export');

	Item.find({}, function (err, items) {
  		var conf = {};
    	conf.name = "Insumax";

  		conf.cols = [
    	  { caption:'Nombre', type:'string' },
    	  { caption:'Stock', type:'number'},
    	  { caption:'Precio', type:'number' },
    	  { caption:'Código', type:'number'}
    	];

    	conf.rows = [];

    	items.forEach(function(item, key){
			conf.rows.push([ 
				item.name, 
				item.qty,
				item.price, 
				item.code
			]);
    	});

  		var result = nodeExcel.execute(conf);
  		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  		res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx');
  		res.end(result, 'binary');
	});
}