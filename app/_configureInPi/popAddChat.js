
(function(){
  angular.module('intechApp').controller('popAddChat',[
    '$scope',
    'querysql',
    'msgs',
    'obj',
    '$uibModalInstance',
    'focus',
    popAddChat
  ])

  function popAddChat($scope, querysql, msgs, obj, $uibModalInstance, focus) {

    $scope.obj = obj || {}

    var sql = ("SELECT token FROM telegram")
    querysql.queryGeral(sql).then(function(response) {
      $scope.obj.tokenBot = response.data[0].token
    })

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
