angular.module('stock-control', [])

  .controller('SuccessController', function($scope) {

    $scope.operation = {};

    $scope.setOptions = function(options){
    	$scope.operation = JSON.parse(options);
        console.log($scope.operation);
    }

    $scope.priceFixed = function(num) {
      return parseFloat(Number(num).toFixed(2)).toLocaleString();
    }

  })
