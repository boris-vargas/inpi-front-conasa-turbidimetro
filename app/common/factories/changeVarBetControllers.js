angular.module('intechApp').factory('trocaDados', function() {
    var valor = []
    //============================================================================================
    //buffer de troca de mensagens
    //index 0 - view ativa
    //informações do sistema ativa
    //============================================================================================
    var valores = new Array(10).fill(0)
    var apiUrl = ''
    var oapiUrl = ''
    var noderedUrl = ''

    //============================================================================================
		//Seta valor para troca de valores entre controllers
		//============================================================================================
    function set(valor, index) {
        valores[index] = valor;
      }
    //============================================================================================
		//resgata valor para troca de valores entre controllers
		//============================================================================================
    function get(index) {
      //console.log(valores);
        return valores[index];
    }

    //============================================================================================
    //Seta endereço apiUrl
    //============================================================================================
    function setapiUrl(apiUrlx) {
        apiUrl = apiUrlx
        //console.log('setei api: ', apiUrl);
      }
      //============================================================================================
  		//resgata endereço apiUrl
  		//============================================================================================
      function getapiUrl() {
        //console.log(valores);
        //console.log('resgateis api: ', apiUrl);
          return apiUrl
      }
      //============================================================================================
      //Seta endereço apiUrl
      //============================================================================================
      function setoapiUrl(oapiUrlx) {
          oapiUrl = oapiUrlx

        }
        //============================================================================================
    		//resgata endereço apiUrl
    		//============================================================================================
        function getoapiUrl() {
          //console.log(valores);
            return oapiUrl
        }

        //============================================================================================
        //Seta endereço nodered
        //============================================================================================
        function setnoderedUrl(noderedUrlx) {
            noderedUrl = noderedUrlx
            //console.log('setei api: ', apiUrl);
          }
          //============================================================================================
      		//resgata endereço nodered
      		//============================================================================================
          function getnoderedUrl() {
            //console.log(valores);
            //console.log('resgateis api: ', apiUrl);
              return noderedUrl
          }

    return {
        set: set,
        get: get,
        setapiUrl:setapiUrl,
        getapiUrl:getapiUrl,
        setoapiUrl:setoapiUrl,
        getoapiUrl:getoapiUrl,
        setnoderedUrl: setnoderedUrl,
        getnoderedUrl: getnoderedUrl

    }

});
