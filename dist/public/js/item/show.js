angular.module('stock-control', [])

  .controller('ShowItemController', function($scope) {
  	$scope.currentPage = 1;

  	$scope.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    
    }
  })
