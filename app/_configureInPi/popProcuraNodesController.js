
(function(){
  angular.module('intechApp').controller('popControllerNodesQuant',[
    '$scope',
    '$uibModalInstance',
    'valor',
    'focus',
    'msgs',
    popControllerNodesQuant
  ])

  function popControllerNodesQuant($scope, $uibModalInstance, valor, focus, msgs) {

    focus('valorinput');

    $scope.valor = valor;

    $scope.ok = function(){
      if($scope.valor<0 || $scope.valor>240){
        msgs.addError('O valor deverá estar entre 0 e 240')
      }else{
        $uibModalInstance.close({
          registro: $scope.registro,
          valor: $scope.valor
        });
      }

    }

    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
