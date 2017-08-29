angular.module('stock-control', [])

  .controller('ClientController', function($scope, $http) {

    $scope.clients = [];
    $scope.client = null;
    $scope.clientSearch;
    $scope.idClientSearch;

    $scope.setClient = function(client){
      $scope.client = client;
    }

    $scope.setClientSearch = function(name, id){
      $scope.clientSearch = name;
      $scope.idClientSearch = id;
    }

    function getItems(){
      $http.get('/api/clients').success(function(data){
        $scope.clients = data;
      });
    }
    
    getItems();
  })