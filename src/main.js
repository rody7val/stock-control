var shop = require('cornershop');
var cart = shop('mystoreid');

cart.load();

cart.addItem({
    id:10,
    name:'Superman Poster',
    desc:'10x5 - superman logo bottom-right',
    price:12.5,
    qty:2,
    image:'/img/shop/superman.png'
})
 
cart.save();

var items = cart.items;
 
var item = items[0];
console.log(item);