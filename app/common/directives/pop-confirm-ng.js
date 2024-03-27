var module = angular.module( "intechApp" );
module.directive( "popConfirm", ['$uibModal','consts',
  function($uibModal, consts) {
    return {
      priority: -1,
      restrict: 'A',
      scope: { 
        confirmFunction: "&popConfirm"
      },
      link: function( scope, element, attrs ){
        element.bind( 'click', function( e ){
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: consts.vFolder+'/_popUps/popConfirmacao.html',
            controller: 'popConfirmacao',
            controllerAs: 'popConfirmacao',
            size: 'sm',
            resolve: {
              titulo: function () { return attrs.popConfirmTitle ? attrs.popConfirmTitle : 'Confirmar ação'}, 
              msg: function () { return attrs.popConfirmMessage ? attrs.popConfirmMessage : 'Tem certeza que deseja realizar esta ação?'  },
              icon: function () { return attrs.popConfirmIcon ? attrs.popConfirmIcon :'fa fa-exclamation-triangle fa-2x' },
              iconColor: function () { return attrs.popConfirmIconStyle ? attrs.popConfirmIconStyle :'color: #333333;' },
            }
          });
          modalInstance.result.then(function(response){
            if(response){
              if(response.resultado=='ok'){
                scope.confirmFunction();
              }
            }
          })
        });
      }
    }
  }
  ]);