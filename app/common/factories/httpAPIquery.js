angular.module('intechApp').factory('querysql', [
  '$http',
  '$q',
  'consts',
  queryFactory
])

function queryFactory($http,$q,consts) {
  const url = consts.apiUrl

  //============================================================================================
  //promise retornando todos os sistemas
  //============================================================================================
    function queryAllsistemas() {
      const cmdSql= "SELECT * FROM config_sistema ORDER BY nome"
      return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando sistema pelo ID do banco
    //============================================================================================
    function querySistem(id){
			const cmdSql= "SELECT * FROM config_sistema WHERE id= '"+ id +"' ORDER BY nome DESC"
			return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando componentes pelo ID do sistema
    //============================================================================================
    function queryComponentes(id){
			const cmdSql= "SELECT * FROM config_compontes WHERE id_sistema= '"+ id +"' ORDER by sequencia ASC "
			return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando componentes pelo ID do sistema todos tasks-obj
    //============================================================================================
    function queryComponentesTasks(id){
			const cmdSql= "SELECT * FROM config_compontes WHERE id_sistema= '"+ id +"' AND tipo='task-horario' "
			return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando usuários do sistema
    //============================================================================================
    function queryUsers(id){
			const cmdSql= "SELECT * FROM usuarios WHERE id_sistema= '"+ id +"'"
			return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando query generica
    //============================================================================================
    function queryGeral(cmdSql){
			return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando query generica
    //============================================================================================
    function queryMysqlInsertPost(cmdSql){
			return $http.post(`${url}queryMysqlInsertPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise retornando query generica via post
    //============================================================================================
    function queryMysqlGetPost(cmdSql){
			return $http.post(`${url}queryMysqlGetPost`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise update user
    //============================================================================================
    function queryMysqlUpdatePassHash(nome, email,senha,acesso, sistema){
			return $http.post(`${url}queryMysqlUpdatePostHash`, {nome: nome, email:email, senha:senha, acesso:acesso, sistema:sistema})
    }
    //============================================================================================
    //promise update user
    //============================================================================================
    function queryMysqlNewUserHash(nome, email,senha,acesso, sistema){
			return $http.post(`${url}queryMysqlNewUserHash`, {nome: nome, email:email, senha:senha, acesso:acesso, sistema:sistema})
    }
    //============================================================================================
    //promise new componente com log
    //============================================================================================
    function queryMysqlNewComp(cmdSql, log, tableName){
			return $http.post(`${url}queryMysqlInsertPost`, {cmd:cmdSql, log: log})
    }
    //============================================================================================
    //promise delete componente log
    //============================================================================================
    function queryMysqlInsertPostDeleteComp(cmdSql, tableName){
			return $http.post(`${url}queryMysqlInsertPost`, {cmd:cmdSql, tableName: tableName})
    }
    //============================================================================================
    //promise delete componente log
    //============================================================================================
    function queryMysqlLog(cmdSql, tableName){
    	return $http.post(`${url}queryMysqlLog`, {cmd:cmdSql})
    }
    //============================================================================================
    //promise get imagens files
    //============================================================================================
    function getImageList(path, filter){
    	return $http.post(`${url}getImageList`, {path:path, filter: filter})
    }
    //============================================================================================
    //promise backup application
    //============================================================================================
    function backupAppMySql(command){
        return $http.post(`${url}backupAppMySql`, {command:command})
    }    
   //============================================================================================
    //promise download backup application
    //============================================================================================
    function backupAppMySqlDownload(command){
        return $http.post(`${url}backupAppMySqlDownload`, {command:command})
    }    

    function verificarToken(token) {
      return $http.post(`${url}verifcarTokenBot`, {tokenBot: token})
    }

    function testeAlarme(token, chat) {
      return $http.post(`${url}testeAlarme`, {tokenBot: token, idchat: chat})
    }

    function stopBot() {
      return $http.post(`${url}stopBot`, {})
    }

  return {queryAllsistemas, querySistem, queryGeral,queryComponentes, queryComponentesTasks, queryMysqlInsertPost,
    queryUsers, queryMysqlUpdatePassHash, queryMysqlNewUserHash, queryMysqlGetPost, queryMysqlNewComp,
    queryMysqlInsertPostDeleteComp, queryMysqlLog, getImageList, backupAppMySql, backupAppMySqlDownload, verificarToken, testeAlarme, stopBot}
}
