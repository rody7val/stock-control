angular.module('stock-control', [])

  .controller('OperationController', function($scope, $http) {
    
    $scope.cart = {
      items: [],      // productos de la base de datos
      selected: [],   // productos del carro
      sale: {
        items: 0,
        sale_value: 0,
        remark: 0,
        total: 0,
        date: moment().format('YYYY-MM-DD')
      }
    }

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
      console.log(typeof sale_value)
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
      calculate();
    }

    $scope.cart.remove = function() {
      cartToItems();
      // filtrar
      $scope.cart.selected = $scope.cart.selected.filter(selected);
      calculate();
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
      calculate();
    }

    function calculate() {
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
      $scope.cart.sale.total = $scope.cart.sale.sale_value * $scope.cart.sale.remark;
    }


    getItems();
  })
