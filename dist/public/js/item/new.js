angular.module('stock-control', ['angularFileUpload'])

  .controller('StockController', function($scope, $http, $timeout, FileUploader) {

    $scope.uploadProgress = 0;
    $scope.sending = false;
    $scope.result = {};
    $scope.imgUrl = '/img/cover-default.png';
    $scope.itemSearch;
    $scope.stock = {
      items: []
    }

    $scope.setItemSearch = function(value){
      $scope.itemSearch = value;
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