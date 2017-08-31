moment.locale('es');
angular.module('stock-control', [])

  .controller('UsersController', function($scope, $http) {

    $scope.users = [];
    $scope.id = '';

    $scope.setUserId = function(id){
      $scope.id = id;
    }

    function getItems(){
      $http.get('/admin/users').success(function(data){
        $scope.users = data;
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
