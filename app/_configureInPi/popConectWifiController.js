
(function(){
  angular.module('intechApp').controller('popControllerWifi',[
    '$scope',
    '$uibModalInstance',
    'ssid',
    'password',
    'focus',
    popController
  ])

  function popController($scope, $uibModalInstance, ssid, password, focus) {

    focus('valorinput');
    $scope.ssid = ssid;
    $scope.password = '';
    //console.log('ssid: ', ssid);
    //console.log('password: ', password);

    $scope.ok = function(){
      $uibModalInstance.close({
        ssid:$scope.ssid,
        password: $scope.password
      });

    }

    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
