
(function(){
  angular.module('intechApp').controller('popController',[
    '$scope',
    '$uibModalInstance',
    'registro',
    'valorIni',
    'focus',
    popController
  ])

  function popController($scope, $uibModalInstance, registro, valorIni, focus) {

    focus('valorinput');

    $scope.registro = registro;
    $scope.valor = valorIni;

    $scope.ok = function(){
      $uibModalInstance.close({
        registro: $scope.registro,
        valor: $scope.valor
      });

    }

    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
