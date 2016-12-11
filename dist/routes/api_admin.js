// Controllers
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
var itemController = require('../controllers/item_controller');
var operationController = require('../controllers/operation_controller');
var globalController = require('../controllers/global_controller');

module.exports = function (app, express) {
    // Motor de rutas API
    var api = express.Router();

    //global
    api.get('/', sessionController.loginRequired, globalController.index);
    api.put('/global/edit', sessionController.loginRequired, globalController.update);

    // Informes
    api.get('/stock', sessionController.loginRequired, itemController.stock);
    // api.get('/sale', operationController.sale);
    // api.get('/buy', operationController.buy);

    // Autoload de comandos 
    api.param('itemId', itemController.load);
    api.param('operationId', itemController.load);
    api.param('userId', itemController.load);
    // api.param('motionId', itemController.load);

    // users
    // api.get('/users/new', sessionController.isNotLogin, userController.new);
    // api.post('/users/new', sessionController.isNotLogin, userController.create);
    // api.get('/users/:userId', sessionController.loginRequired, userController.show);
    // api.delete('/users/:id', sessionController.isNotLogin, userController.delete);
    // api.get('/users', userController.all);

    // item
    api.get('/item/new', sessionController.loginRequired, itemController.new);
    api.post('/item/new', sessionController.loginRequired, itemController.create);
    api.get('/item/:itemId', sessionController.loginRequired, itemController.show);
    api.get('/item/:itemId/edit', sessionController.loginRequired, itemController.edit);
    api.put('/item/:itemId/edit', sessionController.loginRequired, itemController.update);
    api.delete('/item/:itemId', sessionController.loginRequired, itemController.delete);
    api.get('/items', itemController.all);
    api.get('/items/load_items', itemController.load_items);
    api.get('/items/stock_exports', sessionController.loginRequired, itemController.stock_exports);

    // operation
    api.get('/operation/new', sessionController.loginRequired, operationController.new);
    api.post('/operation/new', sessionController.loginRequired, operationController.create);
    // api.get('/operation/:operationId', operationController.show);
    // api.get('/operation/:operationId/edit', operationController.edit);
    // api.put('/operation/:operationId/edit', operationController.update);
    // api.delete('/operation/:itemId', operationController.delete);
    // api.get('/operations', operationController.all);

    // Retornar rutas API.
    return api;
};
