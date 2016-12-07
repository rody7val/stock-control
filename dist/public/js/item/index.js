angular.module('stock-control', [])

  .controller('StockController', function($scope, $http) {
    // $scope.currentPage = 0;
    // $scope.pageSize = 5;
    $scope.stock = {
      items: []
    };
    
    // function orderbyName(){
    //   $scope.stock.items = _($scope.stock.items).orderBy('name').value();
    // }

    // $scope.numberOfPages = function(){
    //   return Math.ceil($scope.stock.items.length/$scope.pageSize);
    // }

    $scope.stock.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }

    $scope.stock.getStockTotal = function(){
      var stock_total = 0;
      angular.forEach($scope.stock.items, function(item) {
        stock_total += item.qty;
      });
      return stock_total;
    }

    $scope.stock.getSaleTotal = function(){
      return $scope.stock.getCostTotal() * 1.3;
    }

    $scope.stock.getCostTotal = function(){
      var cost_total = 0;
      angular.forEach($scope.stock.items, function(item) {
        cost_total += item.qty * item.price;
      });
      return cost_total;
    }

    function getItems(){
      $http.get('/admin/items').success(function(data){
        if (data.length) {
          angular.forEach(data, function(item){
            $scope.stock.items.push(item);
          })
          // orderbyName();
        };
      })
    }
    
    getItems();
  })

  // .filter('startFrom', function() {
  //     return function(input, start) {
  //         start = +start; //parse to int
  //         return input.slice(start);
  //     }
  // });