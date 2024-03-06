
(function(){
  angular.module('intechApp').controller('popimportcsv',[
    '$scope',
    '$uibModalInstance',
    'tableName',
    'textoPopUp',
    'objectName',
    '$http',
    '$q',  
    'msgs', 
    'querysql', 
    popimportcsv
  ])

  function popimportcsv($scope, $uibModalInstance, tableName, textoPopUp ,objectName ,$http, $q, msgs, querysql) {
      //============================================================================================
      //Carrega variaveis
      //============================================================================================
      $scope.textoPopUp = textoPopUp
      $scope.tableName = tableName
      $scope.objectName = objectName 
      //============================================================================================
      //Importa dados CSV para alimentar tabela 
      //============================================================================================
      var allResults = [];
        function importaDadosCsv(){
        allResults = []
          var file = document.getElementById("bulkDirectFile").files[0];
          if(!file){
            msgs.addError('Selecione o arquivo para upload')
            return
          }
          $('.loading').show();
          Papa.parse(file, {
              download: true,
              header: true,
              skipEmptyLines: true,
              error: function(err, file, inputElem, reason) { },
              complete: function(results) {
                  allResults.push(results.data);
                  insertLogdataVirtualComp(results.data)
              }
          }); 
        }
      //============================================================================================
      //Processa dados, verifica formato e importa para o banco 
      //============================================================================================
      function insertLogdataVirtualComp(data){
        var cmdSql = `INSERT INTO ${$scope.tableName}(timestamp,descricao,valor) \n VALUES`
        if(data.length==0){
          msgs.addError('Arquivo sem dados')
          return
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].timestamp && data[i].timestamp.match(/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?(.[0-9]{1,6})?$/)  && data[i].valor && data[i].valor.match(/^-?\d+\.?\d*$/)){
            cmdSql+=`('${data[i].timestamp}','${$scope.objectName}',${data[i].valor}),\n`

          }else{
            msgs.addError('Erro  no format do  arquivo CSV - o  Arquivo deverá conter as colunas: timestamp(format: 2020-09-09 00:00:00 ) e valor (numérico)')
            return
          }
        }
        mountDataToInsert(cmdSql.slice(0,-2))
      }
      //============================================================================================
      //Processa dados, comando mysql
      //============================================================================================
      function mountDataToInsert(cmdSql){
        $scope.processing = true
        querysql.queryGeral(cmdSql).then(function(response){
          msgs.addSuccess(`Dados adicionados com sucesso! :) - Foram adicionados ${response.data.affectedRows} registros`)
          $scope.processing = false
          $uibModalInstance.close();
          
        }).catch(function(err){
          msgs.addError(`Não foi possível adicionar os dados  - ${err}`)
          $scope.processing = false
        })
      }
      //============================================================================================
      //Evento click botão OK
      //============================================================================================
      $scope.ok = function(){
        importaDadosCsv()
      }
      //============================================================================================
      //Evento click botão Cancelar
      //============================================================================================
      $scope.cancelar = function(){
        $uibModalInstance.close();
      }

    }
    //------------------------------------
  })()
