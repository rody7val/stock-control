// Controllers
var userController = require('../controllers/user_controller');
var clientController = require('../controllers/client_controller');
var providerController = require('../controllers/provider_controller');
var sessionController = require('../controllers/session_controller');
var itemController = require('../controllers/item_controller');
var saleController = require('../controllers/sale_controller');
var globalController = require('../controllers/global_controller');

module.exports = function (app, express) {
    // Motor de rutas API
    var api = express.Router();

    //global
    api.get('/', sessionController.loginRequired, globalController.index);
    api.put('/global/edit', sessionController.loginRequired, globalController.update);

    // Informes
    api.get('/report/stock', sessionController.loginRequired, itemController.stock);
    api.get('/report/sale', sessionController.loginRequired, saleController.sale);
    // api.get('/buy', saleController.buy);

    // Autoload de comandos 
    api.param('itemId', itemController.load);
    api.param('saleId', saleController.load);
    api.param('userId', userController.load);
    api.param('clientId', clientController.load);
    api.param('providerId', providerController.load);
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

    // provider
    api.get('/providers/new', sessionController.loginRequired, providerController.new);
    api.post('/providers/new', sessionController.loginRequired, providerController.create);
    api.get('/providers/:providerId', sessionController.loginRequired, providerController.show);
    api.get('/providers/:providerId/edit', sessionController.loginRequired, providerController.edit);
    api.put('/providers/:providerId/edit', sessionController.loginRequired, providerController.update);
    api.delete('/providers/:providerId', sessionController.loginRequired, providerController.delete);

    // item
    api.get('/item/new', sessionController.loginRequired, itemController.new);
    api.post('/item/new', sessionController.loginRequired, itemController.create);
    api.get('/item/:itemId', sessionController.loginRequired, itemController.show);
    api.get('/item/:itemId/edit', sessionController.loginRequired, itemController.edit);
    api.put('/item/:itemId/edit', sessionController.loginRequired, itemController.update);
    api.delete('/item/:itemId', sessionController.loginRequired, itemController.delete);
    api.get('/items/load_items', itemController.load_items);
    api.get('/items/stock_exports', sessionController.loginRequired, itemController.stock_exports);

    // sales
    api.get('/sales/new', sessionController.loginRequired, saleController.new);
    api.post('/sales/new', sessionController.loginRequired, saleController.create);
    api.get('/sales/:saleId',sessionController.loginRequired ,saleController.show);
    // api.get('/sales/:saleId/edit', saleController.edit);
    // api.put('/sales/:saleId/edit', saleController.update);
    // api.delete('/sales/:saleId', saleController.delete);
    api.get('/sales', saleController.all);

    // Retornar rutas API.
    return api;
};
