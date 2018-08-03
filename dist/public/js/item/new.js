angular.module('stock-control', ['angularFileUpload'])

  .controller('StockController', function($scope, $http, $timeout, FileUploader) {

    $scope.uploadProgress = 0;
    $scope.count = 1;
    $scope.sending = false;
    $scope.result = {};
    $scope.imgUrl = '/img/cover-default.png';
    $scope.itemSearch;
    $scope.stock = {
      items: []
    }
    $scope.id;
    $scope.item;
    $scope.buyPrice = 0;
    $scope.salePrice = 0;
    // $scope._id = '';
    // $scope.item = {
    //   name: '',
    //   qty: 0,
    //   price: 0,
    //   salePrice: 0,
    //   code: '',
    //   desc: ''
    // };

    $scope.getItem = function(){
      $http.get('/api/items/'+$scope.id).success(function(data){
        $socpe.item = data;
      });
    }

    $scope.getId = function(id){
      $scope.id = id;
      if ($scope.count === 1) {
        $scope.getItem();
        console.log($socpe.item);
        $scope.count--;
      }
    }

    
    $scope.setItemSearch = function(value){
      $scope.itemSearch = value;
      console.log($scope.itemSearch)
    }


    $scope.changeSalePrice = function() {
      var dif = Number(Number($scope.salePrice - $scope.buyPrice).toFixed(2));
      var porcentaje = Number(Number(dif / $scope.salePrice).toFixed(2));
      $scope.gain = porcentaje > 0 ? Number(Number(porcentaje * 100).toFixed(2)) : 0;
      console.log($scope.gain)
    }

    $scope.priceFixed = function(num) {
      return parseFloat(num.toFixed(2)).toLocaleString();
    }

    function getItems(){
      $http.get('/api/items').success(function(data){
        if (data.length) {
          angular.forEach(data, function(item){
            $scope.stock.items.push(item);
          })
        };
      })
    }
    
    getItems();

    var upload = $scope.upload = new FileUploader({
      url: 'https://api.imgur.com/3/image',
      alias: 'image',
      headers: {
          Authorization: 'Client-ID 3631cecbf2bf2cf',
      },
      autoUpload: true
    })
    
    upload.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
      $scope.uploadProgress = progress;
    };
    upload.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      $scope.imgUrl = response.data.link;
    };
    upload.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
      $scope.uploadProgress = 0;
    };

  })