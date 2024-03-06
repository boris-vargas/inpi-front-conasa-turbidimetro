
(function(){
  angular.module('intechApp').controller('scanredeController',[
    '$scope',
    '$uibModalInstance',
    '$interval',
    '$window',
    'getsetmodbus',
    'comandopiplc',
    'nodes',
    scanredeController
  ])

  function scanredeController($scope, $uibModalInstance, $interval, $window, getsetmodbus, comandopiplc, nodes) {
    var vm = this
    //============================================================================================
    //Destroy scope
    //============================================================================================
    $scope.$on("$destroy", function() {
      if (intervalScan) {
        $interval.cancel(intervalScan)

      }
    })
    //============================================================================================
    //Conta tempo para aguardar scan de rede
    //============================================================================================
    console.log(nodes)
    var time = (nodes*426)/240
    console.log(time)
    vm.timeScan = 0
    var intervalScan = $interval(timeScanFunc, time)
    function timeScanFunc(){
			vm.timeScan++
			if (vm.timeScan>=100) {
        vm.timeScan = 0
         $uibModalInstance.close();
			}
		}

    $scope.cancelar = function(){
      comandopiplc.cancelScanNetwork()
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
