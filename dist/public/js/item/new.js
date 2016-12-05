angular.module('stock-control', [])

  .controller('StockController', function($scope, $http) {

    $scope.stock = {
      items: []
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
