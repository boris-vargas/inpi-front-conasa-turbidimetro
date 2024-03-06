
(function(){
	angular.module('intechApp').controller('headerController',[
		'$scope',
		'$http',
		'consts',
		'msgs',
		'$compile',
		'$interval',
		'$location',
		'lodash',
		'querysql',
		headerController
	])

	function headerController($scope, $http, consts, msgs, $compile, $interval, $location, lodash, querysql) {
		var vm = this;
		const url = consts.apiUrl
		const ID_SISTEMA = consts.idSistema
  	//============================================================================================
		//Parametros de configuração dos menus
		//============================================================================================
		vm.querySistema= function(id){
			const cmdSql= "SELECT * FROM config_sistema WHERE id= '"+ id +"' ORDER BY nome DESC"
			querysql.queryMysqlGetPost(cmdSql).then(function(response){
				vm.header = (response.data)
			})
		}

		//============================================================================================
		//Destroy scope na mudança de rota(pagina)
		//============================================================================================
		$scope.$on("$destroy", function() {

		})

		vm.querySistema(ID_SISTEMA)

		}
		//------------------------------------
	})()
