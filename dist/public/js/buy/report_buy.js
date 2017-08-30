moment.locale('es');
angular.module('stock-control', [])

  .controller('BuysController', function($scope, $http) {

    $scope.buys = [];
    $scope.total = 0;
    $scope.items_qty = 0;
    $scope.buys_qty = 0;
    $scope.buy_promedio = 0;

    function setValues(){
    	angular.forEach($scope.buys, function(buy, key){
    		buy.btn = 'Mas';
    		buy.key = key;
    		$scope.total += buy.total;
			$scope.items_qty += buy.items_qty;
    	});
    	$scope.buys_qty = $scope.buys.length;
		$scope.buy_promedio = $scope.total / $scope.buys_qty;
    }

    $scope.changeBtn = function(key){
    	$scope.buys[key].btn = ($scope.buys[key].btn == 'Mas') ? 'Menos' : 'Mas';
    }

    function getItems(){
      $http.get('/admin/buys').success(function(data){
        $scope.buys = data;
        setValues();
      })
    }

    $scope.setDate = function(date){
    	return moment(date).format('DD/MM/YYYY');
    }
    
    $scope.setDateAndHour = function(date){
        return moment(date).format('lll');
    }

    $scope.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }
    
    getItems();
  })
