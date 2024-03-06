var module = angular.module( "intechApp" )


module.directive('olaMundo', function() {
    return  {
    restrict: 'E',
    template: '<p>Olá mundo</p>'
  }
})
