(function(){
	angular.module('intechApp').controller('AuthCtrl', [
		'$location',
		'msgs',
		'auth',
		'querysql',
		'$rootScope',
		'trocaDados',
		'comandopiplc',
		  AuthCtrl
		])
	function AuthCtrl($location, msgs, auth, querysql, $rootScope, trocaDados, comandopiplc) {
		const vm = this

		vm.user = {}
	  //============================================================================================
	  //Carrega usuário
	  //============================================================================================
		vm.carregaUser = function(email,password){
			vm.user.email = email
			vm.user.password = password
		}
	  //============================================================================================
	  //modo de login
	  //============================================================================================
		vm.loginMode = true
		vm.changeMode = () => {
			vm.loginMode = !vm.loginMode
		}
	  //============================================================================================
	  //Solicita senha por email
	  //============================================================================================
		vm.solicitaSenha =  function(){
			comandopiplc.sendEmailSenha('plcpi-noreplay@intech-automacao.com.br', vm.user.email,'' , '', 'Recuperação  de senha INPI-CPU-3B', 'Texto da  mensagem').then(function(response){
		  		console.log(response)
		  		msgs.addSuccess(response.data.status)
		  	}).catch(function(err){
		  		console.log(err)
		  		msgs.addError(err.data.status)
		  	})
		}
	  //============================================================================================
	  //Realiza login
	  //============================================================================================
		vm.login = () => {
			auth.login(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
		}
	  //============================================================================================
	  //Realiza logout
	  //============================================================================================
    	vm.logout = () => {
	  		auth.logout(() => $location.path('/'))
			auth.logout(() => msgs.addSuccess('Sucesso!'))
		}	  //============================================================================================
	  //---------------
	  //============================================================================================
		vm.signup = () => {
			auth.signup(vm.user, err => err ? msgs.addError(err) : $location.path('/'))
		}
	  //============================================================================================
	  //Lê usuario
	  //============================================================================================
    	vm.getUser = () => (auth.getUser())

	}
})()
