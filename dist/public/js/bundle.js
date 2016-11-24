(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Shop(name, autoload){
	this.name = name;
	this.items = [];
	this.extras = {};
	this.settings = {};
	if(autoload){
		this.load();
	}
}

module.exports = Shop;

Shop.prototype.reset = function(item){
	this.items = [];
	this.extras = {};
	this.settings = {};
}


Shop.prototype.addItem = function(item){

	if(!item){
		return;
	}

	if(!item.qty){
		item.qty = 1;
	}
	
	var hit = null;

	this.items.forEach(function(i){
		if((i.name==item.name || i.id==item.id) && !hit){
			hit = true;
			i.qty += item.qty;
		}
	})

	if(!hit){
		this.items.push(item);	
	}
}

Shop.prototype.getItem = function(id){
	var items = this.items.filter(function(item){
		return item.id==id;
	})
	return items.length>0 ? items[0] : null;
}

Shop.prototype.removeItem = function(id){
	this.items = this.items.filter(function(item){
		return item.id!=id;
	})
}

Shop.prototype.getTotal = function(plusextras){
	var total = 0;
	var self = this;
	this.items.forEach(function(item){
		total+=(item.price||0)*(item.qty||0);
	})

	if(plusextras){
		total+=this.getExtraTotal();
	}

	return total;
}

Shop.prototype.load = function(){
	var string = localStorage != null ? localStorage[this.name + "_cornershop"] : null;
	if(string){
		try {
			var data = JSON.parse(string);
      this.items = data.items || [];
      this.settings = data.settings || {};
      this.extras = data.extras || {};
    }
    catch (err) {

    }
	}
}

Shop.prototype.toJSON = function(){
	return {
  	items:this.items,
  	extras:this.extras,
  	settings:this.settings
  }
}

Shop.prototype.save = function(){
	if (localStorage != null){
    localStorage[this.name + "_cornershop"] = JSON.stringify(this.toJSON());
  }
}

Shop.prototype.setting = function(name, val){
	if(arguments.length>=2){
		this.settings[name] = val;
	}
	return this.settings[name];
}

Shop.prototype.setExtra = function(field, obj){
	obj.id = field;
	this.extras[field] = obj;
}

Shop.prototype.getExtra = function(field){
	return this.extras[field];
}

Shop.prototype.getExtras = function(){
	var self = this;
	return Object.keys(this.extras || {}).map(function(prop){
		return self.extras[prop];
	})
}

Shop.prototype.removeExtra = function(field, obj){
	delete(this.extras[field]);
}


Shop.prototype.getExtraTotal = function(){
	var self = this;
	var total = 0;
	Object.keys(this.extras).forEach(function(prop){
		var extra = self.extras[prop];
		total+=((extra.price || 0) * (extra.qty || 1));
	})
	return total;
}

Shop.prototype.qty = function(){
	var total = 0;

	this.items.forEach(function(item){
		total += item.qty || 0;
	})

	return total;
}


module.exports = function(name, autoload){
	return new Shop(name, autoload);
}

module.exports.Class = Shop;
},{}],2:[function(require,module,exports){
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
},{"cornershop":1}]},{},[2]);
