
(function(){
  angular.module('intechApp').controller('rebootController',[
    '$scope',
    '$uibModalInstance',
    '$interval',
    '$window',
    rebootController
  ])

  function rebootController($scope, $uibModalInstance, $interval, $window) {
    var vm = this

    vm.timeReboot = 0

    var intervalReboot = $interval(timeRebootFunc, 1200)


    function timeRebootFunc(){
			vm.timeReboot++
			//console.log(vm.timeReboot);
			if (vm.timeReboot>=100) {
				$window.location.reload();
			}
		}


  }
  //------------------------------------
})()
