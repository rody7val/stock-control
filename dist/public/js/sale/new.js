angular.module('stock-control', [])

  .controller('SaleController', function($scope, $http) {
    
    $scope.cart = {
      user: null,
      items: [],      // productos de la base de datos
      selected: [],
      clients: [],
      client: null,   // productos del carro
      sale: {
        items: 0,
        sale_value: 0,
        // remark: 1.3,
        total: 0,
        date: moment().format('YYYY-MM-DD')
      }
    }

    function getClients(){
      $http.get('/api/clients').success(function(data){
        $scope.cart.clients = data;
      });
    }
    
    getClients();

    function selected(item){
      var ret = item.done == false;
      if(item.done == true) {
        item.done = false;
        item.qty = item.qty_ref;
        item.qty_motion = 0;
      }
      return ret;
    }

    function sale_value(items){
      var sale_value = 0;
      angular.forEach(items, function(item){
        sale_value += item.qty_motion * item.price;
      });
      return sale_value;
    }

    function sale_value_total(items){
      var sale_value = 0;
      angular.forEach(items, function(item){
        sale_value += item.qty_motion * (item.price * item.rem);
      });
      return sale_value;
    }

    function getItems(){
      $http.get('/api/items').success(function(data){
        if (data.length) {
          angular.forEach(data, function(item){
            item.done = false;
            item.qty_ref = item.qty;
            item.qty_motion = 0;
            $scope.cart.items.push(item);
          })
        };
      })
    }
    
    function itemsToCart(){
      // var items_motions = 0;
      angular.forEach($scope.cart.items, function(item) {
        if (item.done) {
          $scope.cart.selected.push(item);
          // item.qty = item.qty_ref - item.qty_motion;
          // items_motions += item.qty_motion;
        }
      });
      // $scope.cart.sale.items = items_motions;
    }

    function cartToItems(){
      angular.forEach($scope.cart.selected, function(item) {
        if (item.done) {
          $scope.cart.items.push(item);
        }
      });
    }

    $scope.cart.getOperationType = function(){
      var operation = window.location.search.match(/type=([^&]*)/)[1];
      switch(operation){
        case 'sale':
          return 'Nueva venta';
          break;
        case 'buy':
          return 'Nueva compra';
          break;
        case 'manual':
          return 'Registro manual';
          break;
      }
    }

    $scope.cart.setRemarque = function(remarque){
      $scope.cart.sale.remark = remarque;
    }

    $scope.cart.setUserId = function(id){
      $scope.cart.user = id;
    }

    $scope.cart.setDate = function(date){
      console.log(date)
      $scope.cart.sale.date = date;
    }

    $scope.cart.getSelected = function(){
      console.log($scope.cart.selected);
      return JSON.stringify($scope.cart.selected);
    }

    $scope.cart.archive = function() {
      itemsToCart();
      // filtrar
      $scope.cart.items = $scope.cart.items.filter(selected);
      $scope.cart.cartCalculate();
    }

    $scope.cart.remove = function() {
      cartToItems();
      // filtrar
      $scope.cart.selected = $scope.cart.selected.filter(selected);
      $scope.cart.cartCalculate();
    }

    $scope.cart.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }

    $scope.cart.calculate = function(Item) {
      var items_motions = 0;
      angular.forEach($scope.cart.selected, function(item) {
        item.qty = item.qty_ref - item.qty_motion;
        items_motions += item.qty_motion;
      });
      // cantidad de productos
      $scope.cart.sale.items = items_motions;
      $scope.cart.cartCalculate();
    }

    $scope.cart.cartCalculate = function() {
      var items_motions = 0;
      angular.forEach($scope.cart.selected, function(item) {
        item.qty = item.qty_ref - item.qty_motion;

        items_motions += item.qty_motion;
      });
      // cantidad de productos
      $scope.cart.sale.items = items_motions;
      // valor de la venta
      $scope.cart.sale.sale_value = sale_value($scope.cart.selected);
      // venta total
      $scope.cart.sale.total = sale_value_total($scope.cart.selected);
    }


    getItems();
  })
