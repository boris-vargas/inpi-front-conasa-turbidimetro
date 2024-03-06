
(function(){
  angular.module('intechApp').controller('popConfigAlmController',[
    '$scope',
    '$uibModalInstance',
    'id',
    'datainicial',
    'datafinal',
    'modo',
    'indexAlarme',
    'viewmenu',
    'viewequipamento',
    'viewduracao',
    'viewacao',
    'viewvalor',
    'filtermenu',
    'filterequipamento',
    'menus',
    'focus',
    popConfigAlmController
  ])

  function popConfigAlmController($scope, $uibModalInstance, id, datainicial, datafinal, modo, indexAlarme,
    viewmenu, viewequipamento, viewduracao, viewacao, viewvalor, filtermenu, filterequipamento, menus, focus) {
      //============================================================================================
      //Carrega variaveis
      //============================================================================================
      $scope.dataFinal = moment(datafinal)
      $scope.dataInicial = moment(datainicial)//.subtract(1,'days')
      $scope.menus = menus
      $scope.viewmenu = viewmenu
      $scope.viewequipamento = viewequipamento
      $scope.viewduracao = viewduracao
      $scope.viewacao = viewacao
      $scope.viewvalor = viewvalor
      $scope.filtermenu = filtermenu
      $scope.filterequipamento = filterequipamento
      $scope.menu_default = {}
      $scope.menu_default.id = filtermenu
      $scope.modo = modo
      //============================================================================================
      //Evento click botão OK
      //============================================================================================
      $scope.ok = function(){
        $uibModalInstance.close({
          datainicial: $scope.dataInicial,//moment($scope.dataInicial).format('YYYY-MM-DD HH:mm:ss'),
          datafinal: $scope.dataFinal,//moment($scope.dataFinal).format('YYYY-MM-DD HH:mm:ss'),
          modo: $scope.modo,
          indexAlarme: indexAlarme,
          viewmenu : $scope.viewmenu,
          viewequipamento : $scope.viewequipamento,
          viewduracao : $scope.viewduracao,
          viewacao : $scope.viewacao,
          viewvalor : $scope.viewvalor,
          filtermenu : $scope.menu_default.id,
          filterequipamento : $scope.filterequipamento
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
