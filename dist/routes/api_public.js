// Controllers
var itemController = require('../controllers/item_controller');

module.exports = function (app, express) {
    // Motor de rutas API
    var api = express.Router();

    // Pagina de inicio
    api.get('/', itemController.public);

    api.get('/itemsRows', itemController.getRowsItems);

    return api;
};
