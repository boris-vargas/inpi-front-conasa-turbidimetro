angular.module('intechApp').factory('getsetmodbus', [
  '$http',
  '$q',
  'consts',
  getsetmodbus
])

function getsetmodbus($http,$q,consts) {
  const url = consts.apiUrl

  //============================================================================================
  //Get dados modbus do servidor
  //============================================================================================
    function getModbusReg(id, reg, quant) {
      const cmdhttp = `${url}modbusread/${id}/${reg}/${quant}`
      return $http.get(cmdhttp).then(function(response){

        if (response.data.name=="ModbusResponseTimeout") {
          return {error: 'Falha de comunicação Timeout'}
        }else {
          return response.data
        }
      }).catch(function(response){
        //console.log('falha de comunicação!')
        return response.data
      })
    }


  //============================================================================================
  //Get dados modbus do servidor
  //============================================================================================
    function readModbusRegPost(id, reg, quant) {
        var cmdhttp = {
         method: 'POST',
         url: `${url}modbusread`,
         headers: {
           'Content-Type':'application/json'
         },
         data: {id:id, inicio: reg, quant: quant, search:'0'}
        }      
      return $http(cmdhttp).then(function(response){
        if (response.data.name=="ModbusResponseTimeout") {
          return {error: 'Falha de comunicação Timeout'}
        }else {
          return response.data
        }
      }).catch(function(response){
        //console.log(response)
        //console.log('falha de comunicação!')
        return response.data
      })
    }

  //============================================================================================
  //post dados modbus do servidor
  //============================================================================================
    function writeModbusRegPost(id, registro, valor) {
        var cmdhttp = {
         method: 'POST',
         url: `${url}modbuswritepost`,
         headers: {
           'Content-Type':'application/json'
         },
         data: {id:id, registro: registro, valor: valor, search:'0'}
        } 
      return $http(cmdhttp).then(function(response){
        if (response.data.name=="ModbusResponseTimeout") {
          //console.log('falha de comunicação! - Timeout')
          return {error: 'Falha de comunicação Timeout'}
        }else {
          return response.data
        }
      }).catch(function(response){
        return {error: 'erro no Get da função factory modbus'}
      })
    }

    //============================================================================================
    //inicia pesquisa modbus
    //============================================================================================
      function modbusStartScanSearch(nodesToSearch) {
        const cmdhttp = `${url}modbusscan`
        return $http.post(cmdhttp,{params:nodesToSearch}).then(function(response){
          if (response.data.name=="ModbusResponseTimeout") {
            return {error: 'Falha de comunicação Timeout'}
          }else {
            return response.data
          }
        }).catch(function(response){
          console.log('falha de comunicação!')
          return {error: 'erro no Start SCAN da função factory modbus'}
        })
      }
      //============================================================================================
      //Envia elementos de rede
      //============================================================================================
        function modbusgetsearch() {
          const cmdhttp = `${url}modbusgetsearch`
          return $http.get(cmdhttp).then(function(response){
            if (response.data.name=="ModbusResponseTimeout") {
              return {error: 'Falha de comunicação Timeout'}
            }else {
              return response.data
            }
          }).catch(function(response){
            return {error: 'erro no Start SCAN da função factory modbus'}
          })
        }


      //============================================================================================
      //promise set configurações porta modbus
      //============================================================================================
        function setConfigModbusPort(jsonConfig) {
          return $http.post(`${url}setConfigModbusPort`, {jsonConfig:jsonConfig})
        }
      //============================================================================================
      //promise set configurações de e-mail
      //============================================================================================
        function setConfigEmail(jsonConfig) {
          return $http.post(`${url}setConfigEmail`, {jsonConfig:jsonConfig})
        }
      //============================================================================================
      //promise get configurações de e-mail
      //============================================================================================
        function getConfigEmail(jsonConfig) {
          return $http.post(`${url}getConfigEmail`, {})
        }  
      //============================================================================================
      //Teste envio  de  e-mail
      //============================================================================================
        function testeConfigEmail(jsonConfig) {
          return $http.post(`${url}testeConfigEmail`, {jsonConfig:jsonConfig})
        }

  return {getModbusReg, readModbusRegPost, modbusStartScanSearch, modbusgetsearch, writeModbusRegPost, setConfigModbusPort, setConfigEmail, testeConfigEmail, getConfigEmail}
}
