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

    $scope.getType = function(value){
      switch(value){
        case 'Cliente':
          return 'client';
          break;
        case 'Proveedor':
          return 'provider';
          break;
        case 'Administrador':
          return 'admin';
          break;
      }
    }

    $scope.getUserType = function(){
      var operation = window.location.search.match(/type=([^&]*)/)[1];
      switch(operation){
        case 'client':
          return 'Cliente';
          break;
        case 'provider':
          return 'Proveedor';
          break;
        case 'admin':
          return 'Administrador';
          break;
      }
    }

    $scope.getUserTypeForm = function(){
      var operation = window.location.search.match(/type=([^&]*)/)[1];
      switch(operation){
        case 'client':
          return operation;
          break;
        case 'provider':
          return operation;
          break;
        case 'employee':
          return operation;
          break;
      }
    }

    function getItems(){
      $http.get('/api/users').success(function(data){
        $scope.users = data;
      });
    }
    
    getItems();
  })