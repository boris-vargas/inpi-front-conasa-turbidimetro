
(function(){
  angular.module('intechApp').controller('indexController',[
    '$scope',
    'trocaDados',
    '$window',
    'consts',
    'querysql',
    'msgs',
    'auth',
    '$location',
    '$interval',
    indexController
  ])

  function indexController($scope, trocaDados, $window, consts, querysql, msgs , auth, $location, $interval) {
    var vm = this
    const ID_SISTEMA = consts.idSistema
    vm.viewSelecionada = 9999

    //============================================================================================
    //pega usuário logado
    //============================================================================================
    vm.getUser = function(){
      return auth.getUser()
    }
    //============================================================================================
    //Pega ID do sistema do usuário e faz todas as tarefas
    //============================================================================================
    auth.getInfoSistema().then(function(response){
      var ID_SISTEMA_USER = response.data[0].id
      //============================================================================================
      //Verifica view para mostrar ou nao alarmes rodapé
      //============================================================================================
      $scope.$watch(function () {
        vm.viewSelecionada = trocaDados.get(0)
        //console.log(vm.viewSelecionada);
        vm.resolution = $window.innerWidth
        //console.log(vm.resolution);
      })
      //============================================================================================
      //Traz configurações do sistema
      //============================================================================================
      vm.sistema = []
      querysql.querySistem(ID_SISTEMA_USER).then(function(response){
        vm.sistema = response.data
        //============================================================================================
        //Atualiza lista de alarmes
        //============================================================================================
        var poolingAlm = $interval(function(){
         querysql.queryMysqlGetPost('SELECT * FROM alarmes')
          .then(function(response){
            vm.alarmes = response.data
          })
          .catch(function(error){
            console.log('erro alarmes')
            //msgs.addError('Sem comunicação com o servidor! :('+ error)
          })

      //  },(vm.sistema[0].tempo_update_comp == 0 ? 5000 : vm.sistema[0].tempo_update_comp))
    },10000)

      }).catch(function(error){
        //msgs.addError(error.data.errors[0])
        if (error.data.errors[0]=='No token provided.') {
          //auth.logout()
        }
      })




    })

  }

  //------------------------------------
})()
