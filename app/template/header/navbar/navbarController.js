
(function(){
  angular.module('intechApp').controller('navController',[
    '$scope',
    'querysql',
    'consts',
    'msgs',
    'auth',
    '$location',
    'getsetmodbus',
    '$interval',
    'comandopiplc',
    'generalfunc',
    navController
  ])

  function navController($scope, querysql, consts, msgs, auth, $location, getsetmodbus, $interval, comandopiplc, generalfunc) {
    var vm = this
    vm.avisosAtivos = []
    vm.timeServer = '15:00:00'
    vm.dateServer = '29/06/1980'
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
      vm.enableAudioAlm  = response.data[0].enableAudioAlm
      //console.log(response.data[0])
      //============================================================================================
      //Destroy scope na mudança de rota(pagina)
      //============================================================================================
      $scope.$on("$destroy", function() {
        if (getTimerClock) {
          $interval.cancel(getTimerClock)
        }
        if (getAlarmes) {
          $interval.cancel(getAlarmes)
        }
      })
    //============================================================================================
    //Executa comandos para o controlador
    //============================================================================================
    vm.comandoExePiPlc = function(cmd){
      if (cmd.indexOf("date")) {
        var novaData = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        var localCmd = "sudo date -s \'" + novaData +"\' "
        comandopiplc.comandoExePiPlc(localCmd).then(function(result){
          comandopiplc.comandoExePiPlc('sudo hwclock -w').then(function(result){
            msgs.addSuccess('Ajuste de data hora realizado com sucesso :) !')
          })
        }).catch(function(){
          msgs.addError('Não foi possível realizar o comando :( !')
        })
      }
    }
    //============================================================================================
    //Pega informações da CPU no reload
    //============================================================================================
    comandopiplc.comandoExePiPlcInfos().then(function(response){
      vm.cpuinfos = response
    })
    //============================================================================================
    //solicita informações do equipamento
    //============================================================================================
    vm.deviceInfosReq = function(){
      comandopiplc.deviceInfosReq().then(function(result){
        vm.novoNumeroSerie = result.data.serial_number
        vm.novoSoftware = result.data.software
        vm.novoFirmware = result.data.firmware
      })
    }
    vm.deviceInfosReq()
    //============================================================================================
    //pega relogio do servidor   e informação  se tem internet
    //============================================================================================
    function getClock(){
      getsetmodbus.readModbusRegPost(0,1099,1).then(function(response){
        var dateServer = new Date(response.payload[0])
        vm.timeServer =  moment(new Date(dateServer)).utcOffset(-60*3).format("HH:mm")
        vm.dateServer =  moment(new Date(dateServer)).utcOffset(-60*3).format("DD/MM/YYYY")
        vm.dataPc = moment(new Date()).utcOffset(-60*3).format("HH:mm:ss DD/MM/YYYY ")
      })

      comandopiplc.deviceInternetConnection().then(function(response){
        if(response.data.valid=='ok'){
          vm.internetConnection = true
        }else{
          vm.internetConnection = false  
        }
      }).catch(function(err){
      })

    }
    getClock()
    var getTimerClock = $interval(function(){
      getClock()
    }, 60000)
    //============================================================================================
    //Lista todos os alarmes ativos
    //============================================================================================
    var avisosAtivosOld = vm.avisosAtivos
    vm.almActive = false
    var getAlarmes = $interval(function(){
      querysql.queryMysqlGetPost("SELECT * FROM alarmes WHERE id_sistema='"+ ID_SISTEMA_USER +"'").then(function(response){
        vm.avisosAtivos = response.data
        if(vm.avisosAtivos.length!=avisosAtivosOld.length){
          avisosAtivosOld = vm.avisosAtivos
          vm.almActive = true
        }

        if (vm.avisosAtivos.length==0){
          vm.almActive = false;
        }

        if(vm.almActive){
          if(vm.enableAudioAlm==1){
            generalfunc.playAudio('ring.mp3')
          }

        }
      })
      .catch(function(error){
      msgs.addError('Sem comunicação com o servidor :(')
      })
    },10000)



    
  //============================================================================================
  //Mute alarmes
  //============================================================================================
  vm.muteAlm = function(){
    vm.almActive = !vm.almActive
  }    
  //============================================================================================
  //Realiza logout
  //============================================================================================
  vm.logout = () => {
    auth.logout(() => $location.path('/'))
    msgs.addSuccess('Logout realizado! :)')
  }

})
}
  //------------------------------------
})()
