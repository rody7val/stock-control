angular.module('stock-control', [])

  .controller('ShowBuyController', function($scope) {

    $scope.buy = {};

    $scope.setBuy = function(buy){
    	$scope.buy = JSON.parse(buy);
    }
    
    $scope.setDate = function(date){
    	return moment(date).format('DD/MM/YYYY');
    }

    $scope.priceFixed = function(num) {
      return parseFloat(Number(num).toFixed(2)).toLocaleString();
    }

  })