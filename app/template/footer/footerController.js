
(function(){
  angular.module('intechApp').controller('footerController',[
    '$scope',
    'trocaDados',
    '$interval',
    '$window',
    'querysql',
    'msgs',
    'consts',
    footerController
  ])

  function footerController($scope, trocaDados, $interval, $window, querysql, msgs, consts) {
    var vm = this
    const ID_SISTEMA = consts.idSistema
    vm.viewSelecionada = 9999
    vm.alarmes = []
    //============================================================================================
    //Destroy scope na mudança de rota(pagina)
    //============================================================================================
    $scope.$on("$destroy", function() {
      if (poolingAlm) {
        $interval.cancel(poolingAlm)
        }
    })
    //============================================================================================
    //Atualiza lista de alarmes
    //============================================================================================
    var poolingAlm = $interval(function(){
      querysql.queryMysqlGetPost('SELECT * FROM alarmes').then(function(response){
        vm.alarmes = response.data

      })
      .catch(function(error){
        msgs.addError('Sem comunicação com o servidor! :('+ error)
      })

    },10000)

  }
  //------------------------------------
})()
