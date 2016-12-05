var mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 2);
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {
    	type: String,
    	validate: [function(name){
            return name.length >= 3 && name.length > 0;
        }, 'Debe ingresar un "Nombre" con tres (3) o más caracteres.']
    },
    code: {
    	type: Number,
    	validate: [function(code){
            return code >= 1;
        }, 'El "Codigo de barra" debe tener uno (1) o más caracteres.']
    },
    price: {
    	type: Float,
    	validate: [function(price){
            return price >= 0;
        }, 'El "Precio" debe ser mayor o igual que 0']
    },
    qty: Number,
    desc: String,
    image: String,
    _motions: [{type: Schema.Types.ObjectId, ref: 'Motion'}]
});

ItemSchema.virtual('motions', {
    ref: 'Motion',
    localField: 'created',
    foreignField: 'type'
})

module.exports = mongoose.model('Item', ItemSchema);