
(function(){
  angular.module('intechApp').controller('popAlteraIpController',[
    '$scope',
    '$uibModalInstance',
    'ipwifi',
    'gatewaywifi',
    'dnswifi',
    'ipeth',
    'gatewayeth',
    'dnseth',
    'focus',
    'msgs',
    'modo',
    'dhcpwifi',
    'dhcpeth',
    popAlteraIpController
  ])

  function popAlteraIpController($scope, $uibModalInstance, ipwifi, gatewaywifi, dnswifi,ipeth, gatewayeth, dnseth, focus, msgs,modo, dhcpwifi, dhcpeth) {

    focus('valorinput');


    $scope.dhcpwifi = dhcpwifi
    $scope.ipwifi = ipwifi
    $scope.gatewaywifi = gatewaywifi
    $scope.dnswifi = dnswifi
    $scope.modo = modo
 
    $scope.dhcpeth = dhcpeth
    $scope.ipeth = ipeth
    $scope.gatewayeth = gatewayeth
    $scope.dnseth = dnseth

    $scope.ok = function(){
      if ($scope.ipwifi.match(/\w+\.\w+\.\w+\.\w+/g) && $scope.gatewaywifi.match(/\w+\.\w+\.\w+\.\w+/g) && $scope.dnswifi.match(/\w+\.\w+\.\w+\.\w+/g) &&
            $scope.ipeth.match(/\w+\.\w+\.\w+\.\w+/g) && $scope.gatewayeth.match(/\w+\.\w+\.\w+\.\w+/g) && $scope.dnseth.match(/\w+\.\w+\.\w+\.\w+/g)) {
        msgs.addSuccess('Endereços alterados')
      }else{
        msgs.addError('Endereço inválido')
        return
      }

      $uibModalInstance.close({
        dhcpwifi: $scope.dhcpwifi,
        ipwifi: $scope.ipwifi,
        gatewaywifi: $scope.gatewaywifi,
        dnswifi: $scope.dnswifi,

        dhcpeth: $scope.dhcpeth,
        ipeth: $scope.ipeth,
        gatewayeth: $scope.gatewayeth,
        dnseth: $scope.dnseth,
        modo:$scope.modo
      });

    }

    $scope.cancelar = function(){
      $uibModalInstance.close();
    }


  }
  //------------------------------------
})()
