
(function(){
	angular.module('intechApp').controller('menuController',[
		'$scope',
		'$http',
		'consts',
		'msgs',
		'$compile',
		'$interval',
		'$location',
		'lodash',
		'auth',
		'querysql',
		menuController
	])

	function menuController($scope, $http, consts, msgs, $compile, $interval, $location, lodash, auth, querysql) {
		var vm = this;
		const url = consts.apiUrl

		//============================================================================================
		//Pega ID do sistema do usuário e faz todas as tarefas
		//============================================================================================
		auth.getInfoSistema().then(function(response){
			var ID_SISTEMA_USER = response.data[0].id
			//============================================================================================
			//Parametros de configuração dos menus
			//============================================================================================
			vm.querySistema= function(id){
				const cmdSql= "SELECT * FROM config_sistema WHERE id= '"+ id +"' ORDER BY nome DESC"
				querysql.queryGeral(cmdSql).then(function(response){
					vm.menus = (response.data)
				})
			}

			//============================================================================================
			//Destroy scope na mudança de rota(pagina)
			//============================================================================================
			$scope.$on("$destroy", function() {

			})
			//============================================================================================
			//pega usuário logado
			//============================================================================================
			vm.getUser = function(){
	      return auth.getUser()
	    }

		//	console.log(vm.getUser());



			vm.querySistema(ID_SISTEMA_USER)

		})

	}
	//------------------------------------
})()
