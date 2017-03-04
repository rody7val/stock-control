angular.module('items-control', [])

  .controller('ItemsController', function($scope, $http, $document) {

    $scope.items = { 
      all: [],
      isLoad: 400,
      currentLoad: 0
    };

    // var itemsDiv = document.getElementById('items');

    // $document.on('scroll', function() {
    //   if ($scope.items.currentLoad >= $scope.items.isLoad ) {
    //     $scope.items.isLoad += $scope.items.currentLoad;
    //     console.log("Buscar items! volvieron: ")
    //     $scope.getItems();
    //   };

    //   console.log($document.scrollTop())
    //   $scope.items.currentLoad = $document.scrollTop();
    //   itemsDiv.style.height = $scope.items.isLoad + "px";
    // });

    $scope.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }

    $scope.getItems = function() {
      $http.get('/api/itemsRows', {
        // params: {limit: 6, skip: $scope.items.all.length}
      }).success(function(data){
        $scope.items.all = data;
        console.log($scope.items.all)
      })
    }
    
    $scope.getItems();

  })