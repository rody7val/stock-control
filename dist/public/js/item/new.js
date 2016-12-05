angular.module('stock-control', [])

  .controller('StockController', function($scope, $http) {

    $scope.stock = {
      items: []
    }

    $scope.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }

    function getItems(){
      $http.get('/items').success(function(data){
        if (data.length) {
          angular.forEach(data, function(item){
            $scope.stock.items.push(item);
          })
        };
      })
    }
    
    getItems();
  })
