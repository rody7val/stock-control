angular.module('stock-control', [])

  .controller('BuyController', function($scope, $http) {
    
    $scope.cart = {
      user: null,
      items: [],      // productos de la base de datos
      selected: [],
      providers: [],
      client: null,   // productos del carro
      buy: {
        items: 0,
        total: 0,
        date: moment().format('YYYY-MM-DD')
      }
    }

    function getProviders(){
      $http.get('/api/providers').success(function(data){
        $scope.cart.providers = data;
      });
    }
    
    getProviders();

    function selected(item){
      var ret = item.done == false;
      if(item.done == true) {
        item.done = false;
        item.qty = item.qty_ref;
        item.qty_motion = 0;
      }
      return ret;
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
        item.qty = item.qty_ref + item.qty_motion;
        items_motions += item.qty_motion;
      });
      // cantidad de productos
      $scope.cart.buy.items = items_motions;
      $scope.cart.cartCalculate();
    }

    function buy_value(items){
      var buy_value = 0;
      angular.forEach(items, function(item){
        buy_value += item.qty_motion * item.price;
      });
      console.log(typeof buy_value)
      return buy_value;
    }

    $scope.cart.cartCalculate = function() {
      var items_motions = 0;
      angular.forEach($scope.cart.selected, function(item) {
        item.qty = item.qty_ref + item.qty_motion;
        items_motions += item.qty_motion;
      });
      // cantidad de productos
      $scope.cart.buy.items = items_motions;
      // venta total
      $scope.cart.buy.total = buy_value($scope.cart.selected);
    }

    getItems();
  })
