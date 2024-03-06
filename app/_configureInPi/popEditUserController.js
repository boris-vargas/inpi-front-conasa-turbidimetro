
(function(){
  angular.module('intechApp').controller('popControllerEditUser',[
    '$scope',
    '$uibModalInstance',
    'nome',
    'email',
    'acesso',
    'editar',
    'titulo',
    'sistemas',
    'focus',
    'msgs',
    popControllerEditUser
  ])

  function popControllerEditUser($scope, $uibModalInstance, nome, email, acesso, editar, titulo, sistemas, focus, msgs) {

    focus('nome');
    $scope.nome = nome;
    $scope.email = email;
    $scope.acesso = acesso;
    $scope.editar = editar;
    $scope.titulo = titulo;
    $scope.sistemas = sistemas;

    $scope.ok = function(){
      if ((typeof $scope.senha == 'undefined') || (typeof $scope.resenha == 'undefined')) {msgs.addError('As senhas não podem ser indefinidas');return}
      if ($scope.senha===$scope.resenha) {
        $uibModalInstance.close({
          nome:$scope.nome,
          email: $scope.email,
          acesso: $scope.acesso,
          senha:$scope.senha,
          editar:$scope.editar,
          sistema:$scope.sistema_nome
        });
      }else{
        msgs.addError('As senhas não conferem')
      }
    }
    $scope.cancelar = function(){
      $uibModalInstance.close();
    }
  }
  //------------------------------------
})()
