angular.module('stock-control', [])

  .controller('ProviderController', function($scope, $http) {

    $scope.providers = [];
    $scope.provider = null;
    $scope.providerSearch;
    $scope.idProviderSearch;

    $scope.setProvider = function(provider){
      $scope.provider = provider;
    }

    $scope.setProviderSearch = function(name, id){
      $scope.providerSearch = name;
      $scope.idProviderSearch = id;
    }

    function getItems(){
      $http.get('/api/providers').success(function(data){
        $scope.providers = data;
      });
    }
    
    getItems();
  })