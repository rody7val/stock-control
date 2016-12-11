angular.module('stock-control', [])

  .controller('SuccessController', function($scope) {

    $scope.operation = {
    	type: '',
    	items_qty: 0,
    	sale_value: 0,
    	total: 0,
    	remarque: 0,
    	_items: []
    };

    $scope.setOptions = function(options){
    	$scope.operation = JSON.parse(options);
    }

    $scope.priceFixed = function(num) {
      return parseFloat(Number(num).toFixed(2)).toLocaleString();
    }

  })
