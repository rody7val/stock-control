angular.module('stock-control', ['angularFileUpload'])

  .controller('ShowUserController', function($scope, $http, $timeout, FileUploader) {

    $scope.uploadProgress = 0;
    $scope.userImg = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
    $scope.userId = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

    $scope.setUser = function(userImg, userId) {
    	$scope.userImg = userImg ? userImg : $scope.userImg;
    	$scope.userId = userId;
    }

    function saveImg(img, cb){
      $http.post('/admin/users/' + $scope.userId, JSON.stringify({
      	img: img
      })).success(function(data){
        if (data.success) {
        	return cb(img)
        }
        console.log('ERR!')
      });
    }

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
      saveImg(response.data.link, function(img){
      	$scope.userImg = img;
      });
      
    };
    upload.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
      $scope.uploadProgress = 0;
    };

  })