
(function(){
  angular.module('intechApp').controller('popConfigDate',[
    '$scope',
    '$uibModalInstance',
    'nome_tabela_log',
    'textoPopUp',
    popConfigDate
  ])

  function popConfigDate($scope, $uibModalInstance, nome_tabela_log, textoPopUp) {
      //============================================================================================
      //Carrega variaveis
      //============================================================================================
      $scope.textoPopUp = textoPopUp
      $scope.nome_tabela_log = nome_tabela_log
      $scope.dataInicial = moment()
      $scope.dataFinal = moment()
      //============================================================================================
      //Evento click botão OK
      //============================================================================================
      $scope.ok = function(){

        $uibModalInstance.close({dataInicial: $scope.dataInicial, dataFinal: $scope.dataFinal, tabela: $scope.nome_tabela_log });
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
