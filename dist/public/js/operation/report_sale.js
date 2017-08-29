moment.locale('es');
angular.module('stock-control', [])

  .controller('SalesController', function($scope, $http) {

    $scope.sales = [];
    $scope.total = 0;
    $scope.items_qty = 0;
    $scope.sales_qty = 0;
    $scope.sale_promedio = 0;

    function setValues(){
    	angular.forEach($scope.sales, function(sale, key){
    		sale.btn = 'Mas';
    		sale.key = key;
    		$scope.total += sale.total;
			$scope.items_qty += sale.items_qty;
    	});
    	$scope.sales_qty = $scope.sales.length;
		$scope.sale_promedio = $scope.total / $scope.sales_qty;
    }

    $scope.changeBtn = function(key){
    	$scope.sales[key].btn = ($scope.sales[key].btn == 'Mas') ? 'Menos' : 'Mas';
    }

    function getItems(){
      $http.get('/admin/operations').success(function(data){
        $scope.sales = data;
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
