angular.module('intechApp').factory('comandopiplc', [
  '$http',
  'consts',
  comandopiplc
])

function comandopiplc($http,consts) {
  const url = consts.apiUrl

  //============================================================================================
  //Get dados modbus do servidor
  //============================================================================================
  function comandoExePiPlc(cmd) {
    const cmdhttp = `${url}picontroller/sudo/${cmd}`
    return $http.get(cmdhttp).then(function(response){
      //console.log('comando realizado com sucesso!')
      return {result: response.data}
    })
    .catch(function(response){
      //console.log('falha de comunicação!')
      return {errors: 'falha no na realização do comando '}
    })
  }
  //============================================================================================
  //Get dados modbus do servidor return a promiss
  //============================================================================================
  function comandoExePiPlcPromiss(cmd) {
    const cmdhttp = `${url}picontroller/sudo/${cmd}`
    return $http.get(cmdhttp)
  }

  //============================================================================================
  //Comando para  PLC via post
  //============================================================================================
  function picontrollerPost(cmd){
    return $http.post(`${url}picontrollerPost`, {cmd:cmd})
  }

  //============================================================================================
  //Comando para  enviar email com a senha
  //============================================================================================
  function sendEmailSenha(from, to, cc,cco, subject, body){
    return $http.post(`${url}sendEmailSenha`, {from:from, to:to, cc:cc, cco:cco, subject:subject, body:body})
  }
  //============================================================================================
  //Get drives servidor
  //============================================================================================
  function freediskPiPlc() {
    const cmdhttp = `${url}picontroller/freedisk`
    return $http.get(cmdhttp).then(function(response){
      //console.log(response.data)
      return {disks:response.data}
    })
    .catch(function(response){
      //console.log('falha de comunicação freedisk!')
      return {response}
    })
  }

  //============================================================================================
  //Get drives servidor
  //============================================================================================
  function comandoExePiPlcInfos() {
    const cmdhttp = `${url}picontroller/cpudata`
    return $http.get(cmdhttp).then(function(response){
      //console.log(response.data)
      return response.data
    })
    .catch(function(response){
      console.log('falha de comunicação freedisk!')
      return {response}
    })
  }

  //============================================================================================
  //scanNetwork wifi
  //============================================================================================
  function scanNetwork() {
    const cmdhttp = `${url}scannetworkwifi`
    return $http.get(cmdhttp).then(function(response){
      //console.log(response.data)
      return response.data
    })
    .catch(function(response){
      console.log('falha de scanNetwork Wifi!')
      return {response}
    })
  }

  //============================================================================================
  //scanNetwork wifi
  //============================================================================================
  function cancelScanNetwork() {
    const cmdhttp = `${url}cancelscannetwork`
    return $http.get(cmdhttp).then(function(response){
      //console.log(response.data)
      return response.data
    })
    .catch(function(response){
      console.log('falha de cancel scan network!')
      return {response}
    })
  }
  //============================================================================================
  //status Network wifi
  //============================================================================================
  function statusNetwork() {
    const cmdhttp = `${url}statusnetworkwifi`
    return $http.get(cmdhttp).then(function(response){
      //console.log(response.data)
      return response.data
    })
    .catch(function(response){
      console.log('falha de status Network Wifi!',response)
      return {response}
    })
  }


  //============================================================================================
  //set rede wifi
  //============================================================================================
  function setNetwork(ssid,password){

    return $http.post(`${url}setnetworkwifi`, {ssid:ssid, password: password})
  }
  //============================================================================================
  //set rede wifi
  //============================================================================================
  function remoteInfosReq(){
    return $http.post(`${url}remoteinfos`, {none:''})
  }

  //============================================================================================
  //Troca senha node-red
  //============================================================================================
  function changePassNodeRed(password){
    return $http.post(`${url}createnewhashnodered`, {password:password})
  }

  //============================================================================================
  //set rede wifi
  //============================================================================================
  function getNetwork(){
    const cmdhttp = `${url}getnetworkip`
    return $http.get(cmdhttp).then(function(response){
      //console.log(response.data)
      return response.data
    })
    .catch(function(err){
      console.log('falha de status get network!')
      return {err}
    })
  }


  //============================================================================================
  //set rede wifi
  //============================================================================================
  function setNetworkIp(ipoldWifi,ipnewWifi, gatewayoldWifi,gatewaynewWifi,dnsoldWifi,dnsnewWifi,
    ipoldEth,ipnewEth, gatewayoldEth,gatewaynewEth,dnsoldEth,dnsnewEth,dhcpwifi, dhcpeth){
      return $http.post(`${url}updateip`,
        {
          dhcpwifi: dhcpwifi,
          ipoldWifi:ipoldWifi,
          ipnewWifi: ipnewWifi,
          gatewayoldWifi: gatewayoldWifi,
          gatewaynewWifi: gatewaynewWifi,
          dnsoldWifi: dnsoldWifi,
          dnsnewWifi: dnsnewWifi,

          dhcpeth: dhcpeth,
          ipold:ipoldEth,
          ipnew: ipnewEth,
          gatewayold: gatewayoldEth,
          gatewaynew: gatewaynewEth,
          dnsold: dnsoldEth,
          dnsnew: dnsnewEth
        })

      }
  //============================================================================================
  //set rede wifi em DHCP
  //============================================================================================
  function setNetworkWifiDhcp(modo){
      return $http.post(`${url}setnetworkwifidhcp`,{modo:modo})

      }
  //============================================================================================
  //Solicita informações do equipamento
  //============================================================================================
  function deviceInfosReq(password){
    return $http.post(`${url}deviceinfosreq`)
  }      
  //============================================================================================
  //Solicita informações de internet
  //============================================================================================
  function updateInternetIpStart(){
    return $http.post(`${url}updateinternetipstart`)
  }     
 //============================================================================================
  //Set numero de série
  //============================================================================================
  function deviceSetSerialNumber(serialnumber, software, firmware){
    return $http.post(`${url}devicesetserialnumber`,{serialnumber: serialnumber, software: software, firmware: firmware})
  }      
 //============================================================================================
  //Verifica conexão com  internet
  //============================================================================================
  function deviceInternetConnection(serialnumber, software, firmware){
    return $http.post(`${url}deviceInternetConnection`,{})
  }      

      return {comandoExePiPlc,freediskPiPlc, comandoExePiPlcInfos, scanNetwork, statusNetwork, setNetwork, 
                getNetwork, setNetworkIp, remoteInfosReq, cancelScanNetwork, comandoExePiPlcPromiss, changePassNodeRed, deviceInfosReq,
                  deviceSetSerialNumber, updateInternetIpStart, setNetworkWifiDhcp, picontrollerPost, sendEmailSenha, deviceInternetConnection}
    }
