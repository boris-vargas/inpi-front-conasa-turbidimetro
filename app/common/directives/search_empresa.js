var module = angular.module( "intechApp" )


module.directive('meuOpa', [function() {
    return {
        restrict: 'E',
        template: '<h1> opa esta é uma diretiva valor:{{valor}} </h1>',
        scope: {valor:'@'}
    }
}])
