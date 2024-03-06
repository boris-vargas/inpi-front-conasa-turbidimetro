
(function(){
  angular.module('intechApp').controller('popInfos',[
    '$scope',
    '$uibModalInstance',
    'infos',
    'infosDatabase',
    'textoPopUp',
    popInfos
  ])

  function popInfos($scope, $uibModalInstance, infos, infosDatabase, textoPopUp) {
      //============================================================================================
      //Carrega variaveis
      //============================================================================================
      $scope.textoPopUp = textoPopUp
      $scope.infos = infos
      $scope.infosDatabase = infosDatabase
      //============================================================================================
      //Evento click botão OK
      //============================================================================================
      $scope.ok = function(){

        $uibModalInstance.close('none');
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
