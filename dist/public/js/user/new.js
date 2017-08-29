angular.module('stock-control', [])

  .controller('UsersController', function($scope, $http) {

    $scope.users = [];
    $scope.user = null;
    $scope.userSearch;
    $scope.idUserSearch;

    $scope.setUser = function(user){
      $scope.user = user;
    }

    $scope.setUserSearch = function(name, id){
      $scope.userSearch = name;
      $scope.idUserSearch = id;
    }

    function getItems(){
      $http.get('/api/users').success(function(data){
        $scope.users = data;
      });
    }
    
    getItems();
  })