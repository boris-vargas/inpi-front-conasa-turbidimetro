
(function(){
  angular.module('intechApp').controller('popControllerAlert',[
    '$scope',
    'querysql',
    'msgs',
    'obj',
    '$uibModalInstance',
    'focus',
    popController
  ])

  function popController($scope, querysql, msgs, obj, $uibModalInstance, focus) {

    $scope.obj = obj || {}

    $scope.verificarToken = function() {
      if ($scope.obj.tokenBot != "") {
        querysql.verificarToken($scope.obj.tokenBot).then(function(response) {
          msgs.addSuccess("Confirmação Feita")
        }).catch(function(err) {
          console.log(err)
        })
      }else{
        msgs.addError("Token não informado")
      }
    }

    $scope.testeAlarme = function() {
      if ($scope.obj.tokenBot) {
        if ($scope.obj.idchat) {
          querysql.testeAlarme($scope.obj.tokenBot, $scope.obj.idchat).then(function(response) {
            msgs.addSuccess("Confirmação Feita")
          }).catch(function(err) {
            console.log(err)
          })
        }else{
          msgs.addError("ID chat não informado")
        }
      }else{
        msgs.addError("Token não informado")
      }
    }

    $scope.ok = function(){
      $uibModalInstance.close({
        obj: $scope.obj
      });

    }

    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
