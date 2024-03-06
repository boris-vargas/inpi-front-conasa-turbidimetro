
(function(){
  angular.module('intechApp').controller('popConfigChartController',[
    '$scope',
    '$uibModalInstance',
    'objeto',
    popConfigChartController
  ])

  function popConfigChartController($scope, $uibModalInstance, objeto) {
      //============================================================================================
      //Carrega variaveis
      //============================================================================================
      $scope.objeto = objeto
      $scope.dataInicial = moment(objeto.parameters.dataInicial)
      $scope.dataFinal = moment(objeto.parameters.dataFinal)
      //============================================================================================
      //Evento click botão OK
      //============================================================================================
      $scope.ok = function(){
          $scope.objeto.parameters.dataInicial  =$scope.dataInicial
          $scope.objeto.parameters.dataFinal  =$scope.dataFinal
        $uibModalInstance.close({
          objeto: $scope.objeto
        });
        $scope.objeto = ''
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
