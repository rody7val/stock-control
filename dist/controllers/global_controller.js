var Global = require('../models/global');

exports.init = function (callback) {

	Global.count({}, function (err, count, next){

		if (err) { 
			callback(err);
		} else if (count == 0) {
			new Global({
				title: process.env.TITLE || 'Stock-control',
				desc: process.env.DESC || 'Sistema de administración de stock',
				rem: Number(process.env.REM) || 1.3,
			}).save();
		}

		Global.findOne({}, function (err, global){
			if (err) {
				callback(err);
			} else {
				callback(null, global);
			}
		});

	});

}

// Admin Home
exports.index = function(req, res){
	res.render('admin/', { errors: [], nav: 'general'});
}

// Editar global
exports.update = function (req, res) {

	Global.findOne({_id: req.session.global._id}).exec(function (err, _global){
		if (err){
			next(new Error('No existe globalId = '+ req.session.global._id));
		}else{
			_global.title = req.body.global.title;
			_global.desc = req.body.global.desc;
			_global.rem = Number(req.body.global.rem);

			_global.save(function (err, global){
				if (err) {
					return res.render('admin/', { global: req.body.global, errors: [{message: err.errors}], nav: 'registrar' });
				}else{
					req.session.global = global;
					req.flash('info', 'Cambios realizados con exito!');
					res.redirect('/admin');
				}
			});

		}
	});
	
}
