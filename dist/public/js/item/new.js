angular.module('stock-control', [])

  .controller('StockController', function($scope, $http) {

    $scope.stock = {
      items: []
    }
    $scope.itemSearch;

    $scope.setItemSearch = function(value){
      $scope.itemSearch = value;
    }

    $scope.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }

    function getItems(){
      $http.get('/admin/items').success(function(data){
        if (data.length) {
          angular.forEach(data, function(item){
            $scope.stock.items.push(item);
          })
        };
      })
    }
    
    getItems();
  })
