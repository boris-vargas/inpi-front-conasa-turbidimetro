
(function(){
  angular.module('intechApp').controller('popAlteraValorController',[
    '$scope',
    '$uibModalInstance',
    'id',
    'reg',
    'valor',
    'fator',
    'focus',
    popAlteraValorController
  ])

  function popAlteraValorController($scope, $uibModalInstance, id, reg, valor,fator, focus) {

    //============================================================================================
    //Carrega variaveis
    //============================================================================================
    focus('valorinput');
    $scope.id_ = id;
    $scope.reg_ = reg;
    $scope.valor_ = valor*fator;
    $scope.fator_ = fator;
    //============================================================================================
    //Evento click botão OK
    //============================================================================================
    $scope.ok = function(){
      //console.log('fator->',$scope.fator_)
      //console.log('Valor->',$scope.valor_ )
      $uibModalInstance.close({
        id: $scope.id_,
        reg: $scope.reg_,
        valor: $scope.valor_ / $scope.fator_
      });
    }
    //============================================================================================
    //Evento click botão Cancelar
    //============================================================================================
    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
