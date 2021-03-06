// Obtener dependencias
var express = require('express'),
    flash = require('express-flash'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    qs = require('querystring');

require('dotenv').config();         // Obtener variables de entorno (.env)
var config = require('./config');   // Configuraciones del sitio

// Instancia de nueva applicacion
var app = express();

// Rutas API
var api_admin = require('./dist/routes/api_admin')(app, express);
var api_public = require('./dist/routes/api_public')(app, express);

// Motor de vistas
app.set('views', path.join(__dirname, 'dist/views'));
app.set('view engine', 'jade');

// Conexión a la base de datos
mongoose.connect(config.database, function (err) {
    if (err) return console.error(err);
    console.log('Conectado a la Base de Datos');
});

// Configuraciones del servidor
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser(config.cookie));
app.use(session({
    secret: config.session,
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Definir directorio publico
app.use(express.static(path.join(__dirname, 'dist/public')));

// Ayuda dinámica para el control de sesión
app.use(function (req, res, next){
    var global_controller = require('./dist/controllers/global_controller.js');

    global_controller.init(function (err, global){
        if (err) console.log(err);

        // guardar path en session.redir para despues de login
        if ( !req.path.match(/\/session\/login|\/session\/logout|\/api|\/session\/success/) && !req.path.match(/^.*\.[^\\]+$/) ){ 
            var search = req.query ? '?' + qs.stringify(req.query) : '';
            req.session.redir = search == '?' ? req.path : req.path + search;
        }else{
            req.session.redir = '/';
        }
        req.session.global = global;
        // hacer visible req.session en las vistas
        res.locals.session = req.session;
        next();
    });
});

// Usar rutas API
app.use('/admin', api_admin);
app.use('/', api_public);

// Manejo de errores en desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            status: err.status || 500,
            error: err
        });
    });
}

// Manejo de errores en producción
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status || 500,
        error: ''
    });
});

// Puerto de escucha
app.listen(config.port, "0.0.0.0", function (err){
    if (err) console.log(err);
    else console.log('Servidor escuchando en el puerto '+config.port);
});  