(function(){
  angular.module('intechApp').controller('popConfirmacao',[
    '$scope',
    '$uibModalInstance',
    'querysql',
    'titulo',
    'msg',
    'icon',
    'iconColor',
    popConfirmacao
    ])

  function popConfirmacao($scope, $uibModalInstance, querysql, titulo, msg, icon, iconColor) {

    $scope.titulo = titulo
    $scope.msg = msg
    $scope.icon = icon
    $scope.iconColor = iconColor

    $scope.ok = function(){
      $uibModalInstance.close({
        resultado: "ok",
      });

    }

    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()