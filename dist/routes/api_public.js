// Controllers
var itemController = require('../controllers/item_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');

module.exports = function (app, express) {
    // Motor de rutas API
    var api = express.Router();

    // Pagina de inicio
    api.get('/', itemController.public);

    //items
    api.get('/itemsRows', itemController.getRowsItems);

    // users
    api.get('/users/new', sessionController.isNotLogin, userController.new);
    api.post('/users/new', sessionController.isNotLogin, userController.create);

    // session
    api.get('/session/login', sessionController.isNotLogin, sessionController.new);
    api.post('/session/login', sessionController.isNotLogin, sessionController.create);
    api.get('/session/logout', sessionController.loginRequired, sessionController.delete);
    api.get('/session/me', sessionController.loginRequired, sessionController.me);
    api.get('/session/success', sessionController.success);
    
    return api;
};