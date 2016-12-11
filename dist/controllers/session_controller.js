// MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/session/login');
    }
}

// MW de control de session
exports.isNotLogin = function(req, res, next){
    if(!req.session.user){
        next();
    }else{
        res.redirect('/');
    }
}

// Mensaje usuario creado con exito
exports.success = function (req, res) {
    var msjFlash = req.session.msjFlash || {};
    req.session.msjFlash = {};
    res.render('public/session/success', { msjFlash: msjFlash});
}

// Formulario de login
exports.new = function(req, res){
    var errors = req.session.errors || {};
    req.session.errors = {};
    var session = req.body.session || {username: '', password: ''}
    res.render('public/session/new', {_session: session, errors: errors});
}

// Crear nueva session
exports.create = function(req, res){
    var username = req.body.session.username;
    var password = req.body.session.password;
    var user_controller = require('./user_controller.js');
    user_controller.autenticar(username, password, function (err, user){
        if (err) return res.render('public/session/new', { _session: req.body.session, errors: [{message: err}] });
        req.session.user = user;
        res.redirect('/');
    });
}

// Destruir session
exports.delete = function(req, res){
    delete req.session.user;
    res.redirect('/');
}

// Obtener informacion sobre el usuario registrado.
exports.me = function (req, res) {
    res.json({ user: req.session.user });
}
