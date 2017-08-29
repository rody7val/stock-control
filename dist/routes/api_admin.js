// Controllers
var userController = require('../controllers/user_controller');
var clientController = require('../controllers/client_controller');
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
    api.get('/report/stock', sessionController.loginRequired, itemController.stock);
    api.get('/report/sale', sessionController.loginRequired, operationController.sale);
    // api.get('/buy', operationController.buy);

    // Autoload de comandos 
    api.param('itemId', itemController.load);
    api.param('operationId', operationController.load);
    api.param('userId', userController.load);
    api.param('clientId', clientController.load);
    // api.param('motionId', itemController.load);

    // users
    api.get('/users/new', sessionController.loginRequired, userController.new_fromAdmin);
    api.post('/users/new', sessionController.loginRequired, userController.create_fromAdmin);
    api.get('/users/:userId', sessionController.loginRequired, userController.show);
    api.get('/users/:userId/edit', sessionController.loginRequired, userController.edit);
    api.put('/users/:userId/edit', sessionController.loginRequired, userController.update);
    api.delete('/users/:userId', sessionController.loginRequired, userController.delete);

    // clients
    api.get('/clients/new', sessionController.loginRequired, clientController.new);
    api.post('/clients/new', sessionController.loginRequired, clientController.create);
    api.get('/clients/:clientId', sessionController.loginRequired, clientController.show);
    api.get('/clients/:clientId/edit', sessionController.loginRequired, clientController.edit);
    api.put('/clients/:clientId/edit', sessionController.loginRequired, clientController.update);
    api.delete('/clients/:clientId', sessionController.loginRequired, clientController.delete);

    // item
    api.get('/item/new', sessionController.loginRequired, itemController.new);
    api.post('/item/new', sessionController.loginRequired, itemController.create);
    api.get('/item/:itemId', sessionController.loginRequired, itemController.show);
    api.get('/item/:itemId/edit', sessionController.loginRequired, itemController.edit);
    api.put('/item/:itemId/edit', sessionController.loginRequired, itemController.update);
    api.delete('/item/:itemId', sessionController.loginRequired, itemController.delete);
    api.get('/items/load_items', itemController.load_items);
    api.get('/items/stock_exports', sessionController.loginRequired, itemController.stock_exports);

    // operation
    api.get('/operation/new', sessionController.loginRequired, operationController.new);
    api.post('/operation/new', sessionController.loginRequired, operationController.create);
    // api.get('/operation/:operationId', operationController.show);
    // api.get('/operation/:operationId/edit', operationController.edit);
    // api.put('/operation/:operationId/edit', operationController.update);
    // api.delete('/operation/:operationId', operationController.delete);
    api.get('/operations', operationController.all);

    // Retornar rutas API.
    return api;
};
