// Controllers
var itemController = require('../controllers/item_controller');
var userController = require('../controllers/user_controller');
var clientController = require('../controllers/client_controller');
var sessionController = require('../controllers/session_controller');

module.exports = function (app, express) {
    // Motor de rutas API
    var api = express.Router();

    // Pagina de inicio
    api.get('/', itemController.public);

    //items
    api.get('/api/itemsRows', itemController.getRowsItems);
    api.get('/api/items', itemController.all);

    // users
    api.get('/users/new', sessionController.isNotLogin, userController.new);
    api.post('/users/new', sessionController.isNotLogin, userController.create);
    api.get('/api/users', userController.all);

    // clients
    api.get('/api/clients', clientController.all);

    // session
    api.get('/session/login', sessionController.isNotLogin, sessionController.new);
    api.post('/session/login', sessionController.isNotLogin, sessionController.create);
    api.get('/session/logout', sessionController.loginRequired, sessionController.delete);
    api.get('/session/me', sessionController.loginRequired, sessionController.me);
    api.get('/session/success', sessionController.success);
    
    return api;
};
