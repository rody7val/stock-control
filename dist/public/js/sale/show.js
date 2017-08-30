angular.module('stock-control', [])

  .controller('ShowSaleController', function($scope) {

    $scope.sale = {};

    $scope.setSale = function(sale){
    	$scope.sale = JSON.parse(sale);
    }

    $scope.priceFixed = function(num) {
      return parseFloat(Number(num).toFixed(2)).toLocaleString();
    }

  })
