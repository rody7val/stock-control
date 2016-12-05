// Controllers
var itemController = require('../controllers/item_controller');
var operationController = require('../controllers/operation_controller');

module.exports = function (app, express) {
    // Motor de rutas API
    var api = express.Router();

    // Pagina de inicio
    api.get('/', itemController.index);

    // Autoload de comandos 
    api.param('itemId', itemController.load);
    api.param('operationId', itemController.load);

    // item
    api.get('/item/find', itemController.find);
    api.get('/item/new', itemController.new);
    api.post('/item/new', itemController.create);
    api.get('/item/:itemId', itemController.show);
    api.get('/item/:itemId/edit', itemController.edit);
    api.put('/item/:itemId/edit', itemController.update);
    api.delete('/item/:itemId', itemController.delete);
    api.get('/items', itemController.all);
    api.get('/items/stock', itemController.stock);

    // operation
    // api.get('/operation/find', operationController.find);
    api.get('/operation/new', operationController.new);
    api.post('/operation/new', operationController.create);
    // api.get('/operation/:operationId', operationController.show);
    // api.get('/operation/:operationId/edit', operationController.edit);
    // api.put('/operation/:operationId/edit', operationController.update);
    // api.delete('/operation/:itemId', operationController.delete);
    // api.get('/operations', operationController.all);
    
    // Retornar rutas API.
    return api;
};
