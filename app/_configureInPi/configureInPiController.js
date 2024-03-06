(function(){
	angular.module('intechApp').controller('ConfigPiController',[
		'$scope',
		'$http',
		'consts',
		'msgs',
		'$compile',
		'$interval',
		'$location',
		'lodash',
		'$window',
		'$element',
		'$timeout',
		'$q',
		'querysql',
		'$document',
		'$uibModal',
		'trocaDados',
		'auth',
		'comandopiplc',
		'getsetmodbus',
		'Upload',
		'$state',
		ConfigPiController
		])

	function ConfigPiController($scope, $http, consts, msgs, $compile, $interval, $location, lodash,$window, $element, $timeout, $q, querysql, $document, $uibModal, trocaDados, auth, comandopiplc,getsetmodbus, Upload, $state) {
		var vm = this;
		const url = consts.apiUrl
		const registroModbusPorComponente = 2;
		const CONTROLLER = 'cfgPiCtrl'
		const RETRY_MODBUS_COM = consts.retryModbusCom
		vm.procurandoElementosRede = false
		vm.openAc1 = false	
		vm.openAc2 = false
		vm.openAc3 = false
		vm.sistemaNomeMenu1= ''
		vm.sistemaNomeMenu2 = ''
		vm.sistemaNomeMenu3 = ''
		vm.sistemaNomeMenu4 = ''
		vm.sistemaNomeMenu5 = ''
		vm.sistemaNomeMenu6 = ''
		vm.sistemaNomeMenu7 = ''
		vm.sistemaNomeMenu8 = ''
		vm.sistemaNomeMenu9 = ''
		vm.sistemaNomeMenu10 = ''
		vm.generalFolder = true
		vm.componenteLeituraFconCount = 0
		vm.forceValueTransistorCh = [0,0,0,0,0,0,0,0]
		vm.forceValue4AoCh = [0,0,0,0]
		vm.forceTraValues = 0
		vm.forceValueTriacCh = [0,0,0,0,0,0,0,0]
		vm.forceTriacValues = 0
		vm.networkWifiModo = 0
		vm.waitResponseDownload = false
		vm.requestingDataConfig = true
		vm.requestingDataUsers = true
		vm.requestingDataHardware = true

		//============================================================================================
		//Retirar seleção  de  pasta
		//============================================================================================
		vm.folderClickSelectGeneral = function(){
				vm.objectsFolder = false
		}
		vm.folderClickObject = function(){
				vm.generalFolder = false
		}

		//============================================================================================
		//Troca senha de acesso NODE_RED
		//============================================================================================
		vm.trocaSenhaNodeRed = function(){
			if ((typeof vm.senhaNodered ==='undefined') || ( typeof vm.senhaNoderedConfirma ==='undefined')) {
				msgs.addError('As senha deverá ter pelo menos um caracter :( ! Digite novamente')
				vm.senhaNodered = ''
				vm.senhaNoderedConfirma = ''
				return

			};
			if (vm.senhaNoderedConfirma != vm.senhaNodered) {
				msgs.addError('As senhas não conferem :( ! Digite novamente')
				vm.senhaNodered = ''
				vm.senhaNoderedConfirma = ''
				return
			};
			comandopiplc.changePassNodeRed(vm.senhaNodered).then(function(response){
				msgs.addSuccess('Troca da senha realizada com sucesso :) ! O controlador esta sendo reiniciado para que as alterações sejam efetivadas...')
				$timeout(function(){
					vm.comandoExePiPlc('sudo reboot')

				}, 3000)
			})

		}

		//============================================================================================
		//Seleciona modulo para monitorar no click da tabela
		//============================================================================================
		vm.factoryReset = function(){
			comandopiplc.picontrollerPost(`> /home/pi/.node-red/flows_INPI-CPU-3B.json`).then(function(response){
				querysql.queryGeral( `DROP DATABASE iot`).then(function(response){
					querysql.queryGeral( `CREATE DATABASE iot`).then(function(response){
						msgs.addSuccess('Reset de fabrica aplicado com suscesso...Reiniciando a CPU')
						
						$timeout(function(){
							vm.comandoExePiPlc('sudo reboot')
						}, 2000)
					})
				})
			}).catch(function(err){
				console.log(err)
			})
		}

		//============================================================================================
		//Versões da aplicação
		//============================================================================================
		vm.versaoApp = function(){
			return {vsoftware: vm.novoSoftware, vfirmware: vm.novoFirmware, serial: vm.novoNumeroSerie}
		}

		//============================================================================================
		//Seleciona modulo para monitorar no click da tabela
		//============================================================================================
		vm.selecionaModulo = function(id, tipo){
			vm.componente_modulo_plcpi = vm.updateIdModuleTypeInfo(tipo)
			vm.enderecos_modulo_default.id = id.toString()
			vm.updateModule()
		}
		//============================================================================================
		//Envia imagens para o servidor
		//============================================================================================
		vm.uploadImage = function(){
			if (vm.file) {
				vm.upload(vm.file)
				
			}
		}


		//============================================================================================
		// pop de config telegram
		//============================================================================================
		vm.openModelConfigAlert = function(size) {
			var modalInstance = $uibModal.open({
				templateUrl: '/_configureInPi/popConfigAlertTelegram.html',
				controller: 'popControllerAlert',
				controllerAs: $scope,
				size: size,
				resolve: {
					obj: function() { return {} }
				}
			});
			modalInstance.result.then(function(response){
				if (response) {
					var sql = (`INSERT INTO telegram(indentificador, token, idchat) VALUES ('${response.obj.indentificador}', '${response.obj.tokenBot}', '${response.obj.idchat}')`)
					querysql.queryGeral(sql).then(function(response) {
						// console.log(response.data)
						msgs.addSuccess("Bot telegram inserido com sucesso!")
						vm.listarTelegram()
					}).catch(function(err) {
						msgs.addError('Não foi possível inserir o bot!')
					})
				}
			})
		}

		vm.openModelAddChatAlert = function(size) {
			var modalInstance = $uibModal.open({
				templateUrl: '/_configureInPi/popAddChat.html',
				controller: 'popAddChat',
				controllerAs: $scope,
				size: size,
				resolve: {
					obj: function() { return {} }
				}
			});
			modalInstance.result.then(function(response){
				if (response) {
					var sql = (`INSERT INTO telegram(indentificador, token, idchat) VALUES ('${response.obj.indentificador}', '${response.obj.tokenBot}', '${response.obj.idchat}')`)
					querysql.queryGeral(sql).then(function(response) {
						// console.log(response.data)
						msgs.addSuccess("Chat telegram inserido com sucesso!")
						vm.listarTelegram()
					}).catch(function(err) {
						msgs.addError('Chat foi possível inserir o bot!')
					})
				}
			})
		}


		//============================================================================================
		// Listar telegram
		//============================================================================================

		vm.listarTelegram = function() {
			var sql = (`SELECT id, indentificador, idchat FROM telegram`)
			querysql.queryGeral(sql).then(function(response) {
				vm.telegram = response.data
				if (vm.telegram.length == 0) {
					sql = (`UPDATE config_compontes SET bke_alarmes_telegram = ''`)
					querysql.queryGeral(sql).then(function(response) {
						querysql.stopBot().then(function(response) {
							console.log(response.data)
						})
					})
				}
				// console.log(vm.telegram)
			})
		}

		//vm.listarTelegram()

		//============================================================================================
		// Editar telegram
		//============================================================================================

		vm.editarTelegram = function(obj) {
			var modalInstance = $uibModal.open({
				templateUrl: '/_configureInPi/popAddChat.html',
				controller: 'popAddChat',
				controllerAs: $scope,
				size: 'md',
				resolve: {
					obj: function() { return obj }
				}
			});
			modalInstance.result.then(function(response){
				if (response) {
					var sql
					if (response.obj.token) {
						sql = (`UPDATE telegram SET indentificador = '${response.obj.indentificador}', token = '${response.obj.tokenBot}', idchat = '${response.obj.idchat}' WHERE id = '${response.obj.id}'`)
					}else{
						sql = (`UPDATE telegram SET indentificador = '${response.obj.indentificador}', idchat = '${response.obj.idchat}' WHERE id = '${response.obj.id}'`)
					}
					console.log(sql)
					querysql.queryGeral(sql).then(function(response) {
						// console.log(response.data)
						msgs.addSuccess("Bot telegram alterado com sucesso!")
						vm.listarTelegram()
					}).catch(function(err) {
						msgs.addError('Não foi possível alterar o bot!')
					})
				}
			})
		}

		//============================================================================================
		// Excluir telegram
		//============================================================================================

		vm.excluirTelegram = function(obj) {
			var id = obj.id
			var sql = (`DELETE FROM telegram WHERE id = '${id}'`)
			querysql.queryGeral(sql).then(function(response) {
				// console.log(response.data)
				msgs.addSuccess("Bot deletado com sucesso!")
				vm.listarTelegram()
			}).catch(function(err) {
				msgs.addError('Não foi possível deletar o bot!')
			})
		}

		//============================================================================================
		//Upload de arquivos
		//============================================================================================		
		vm.upload = function (file,folder) {
			if (!vm.generalFolder && !vm.objectsFolder ) {
				msgs.addError('Selecione a pasta geral ou objetos!') 
				return
			}
			var service = ''
			if (vm.generalFolder) {
				service = `${url}uploadImageGeneral`
			}else{
				service = `${url}uploadImageObject`
			}

			Upload.upload({url: service,data:{file:file}}).then(function (resp) {
				if(resp.data.error_code === 0){
					msgs.addSuccess('Upload realizado com sucesso! :)')
					$state.reload()
				} else {
					msgs.addError('Falha no upload! :(')
				}
			}, function (resp) { //catch error
				msgs.addError('Falha no upload! :( provavelmente o servidor esta sem conexão')
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
			})
		}
		//============================================================================================
		//Upload de arquivo para restarurar backup mysql
		//============================================================================================		
		vm.uploadBackMysql = function (file) {
			Upload.upload({url: `${url}uploadArquivoImportMysql`,data:{file:file}}).then(function (resp) {
				if(resp.data.error_code === 0){
					msgs.addSuccess('Upload realizado com sucesso! :)')
					$timeout(function() {
						vm.comandoExePiPlc('sudo reboot')
					}, 3000);
				} else {
					msgs.addError('Falha no upload! :(')
				}
			}, function (resp) { //catch error
				msgs.addError('Falha no upload! :( provavelmente o servidor esta sem conexão')
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				vm.progressUploadMysql = 'progress: ' + progressPercentage + '% '; // capture upload progress
			})
		}

		//============================================================================================
		//Upload de arquivo para restarurar backup node-red
		//============================================================================================		
		vm.uploadBackNodeRed = function (file) {
			Upload.upload({url: `${url}uploadArquivoImportNodeRed`,data:{file:file}}).then(function (resp) {
				if(resp.data.error_code === 0){
					msgs.addSuccess('Upload realizado com sucesso! :)')
					$timeout(function() {
						vm.comandoExePiPlc('sudo reboot')
					}, 3000);
				} else {
					msgs.addError('Falha no upload! :(')
				}
			}, function (resp) { //catch error
				msgs.addError('Falha no upload! :( provavelmente o servidor esta sem conexão')
			}, function (evt) {
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				vm.progressUploadNodeRed = 'progress: ' + progressPercentage + '% '; // capture upload progress
			})
		}



		//============================================================================================
		//Delete arquivos
		//============================================================================================		
		vm.imagemGeralDelete = function(){
			if(vm.imagemGeralSelec){
				$http.post(`${url}deleteFileGeral`,{file:`${vm.imagemGeralSelec}`}).then(function(response){
					msgs.addSuccess('Imagem apagada')
					$state.reload()
				}).catch(function(error){
					msgs.addError('Erro ao apagar o arquivo: '+error)
				})
			}else{
				msgs.addError('Selecione o  arquivo para apagar')
			}
		}
		//============================================================================================
		//Delete arquivos
		//============================================================================================		
		vm.imagemObjetoDelete = function(){
			if(vm.imagemObjetoSelec){
				$http.post(`${url}deleteFileObjetos`,{file:`${vm.imagemObjetoSelec}`}).then(function(response){
					msgs.addSuccess('Imagem apagada')
					$state.reload()

				}).catch(function(error){
					msgs.addError('Erro ao apagar o arquivo: '+error)
				})
			}else{
				msgs.addError('Selecione o  arquivo para apagar')
			}
		}
		//============================================================================================
		//Abrir datasheet
		//============================================================================================
		vm.openDatasheet = function (index){
			if (vm.modulosScan[index].tipo==0 || vm.modulosScan[index].tipo==1 )  $window.open('https://www.intech-automacao.com.br/assets/datasheet/INPI-CPU-3B-D.pdf')
				if (vm.modulosScan[index].tipo==2)  $window.open('https://www.intech-automacao.com.br/assets/datasheet/INPI-INP-8DI-D.pdf')
					if (vm.modulosScan[index].tipo==3)  $window.open('https://www.intech-automacao.com.br/assets/datasheet/INPI-OUT-4DO-REL-D.pdf')
						if (vm.modulosScan[index].tipo==4)  $window.open('https://www.intech-automacao.com.br/assets/datasheet/INPI-INA-4AI-D.pdf')

					}

		//============================================================================================
		//Executa comandos para o controlador
		//============================================================================================
		vm.comandoExePiPlc = function(cmd){
			if (cmd=='sudo reboot') {
				vm.openModalReboot('sm')
			}
			comandopiplc.comandoExePiPlc(cmd).then(function(result){
				vm.comandoPiReceive = JSON.stringify(result)
			})
		}
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
		//Set serial number do equipamento
		//============================================================================================
		vm.deviceSetSerialNumber = function(){
			if (vm.novoNumeroSerie.length==14) {
				comandopiplc.deviceSetSerialNumber(vm.novoNumeroSerie,vm.novoSoftware,vm.novoFirmware).then(function(result){
				//vm.remoteInfos = result.data
				if (result.data.status=='escrita ok'){
					$timeout(function(){
						vm.deviceInfosReq()
					},5000)
					msgs.addSuccess('Informações gravadas no equipamento :)')
				}else{
					msgs.addError('Erro na gravação das informações do equipamento :(')

				}
				
				//vm.novoNumeroSerie = result.data.serial_number
			})
			}else{
				msgs.addError('Número de caracteres diferente do padrão')
			}
		}
		
		
		//============================================================================================
		//solicita informações de rede publica (internet)
		//============================================================================================
		vm.getRemoteInfos = function(){
			comandopiplc.remoteInfosReq().then(function(result){
				vm.remoteInfos = result.data
			})
		}
		vm.getRemoteInfos();
		//============================================================================================
		//solicita elementos de rede
		//============================================================================================
		vm.getElementoRede = function(){
			getsetmodbus.modbusgetsearch().then(function(result){
				vm.modulosScan = result
			})
		}
		vm.getElementoRede();
		//============================================================================================
		//atualoza informações internet
		//============================================================================================
		vm.updateInternetIpStart = function(){
			comandopiplc.updateInternetIpStart().then(function(response){
				if (response.status='internet atualizada'){
					msgs.addSuccess('Informações de internet atualizadas :)')
				}
			})
		}

		//============================================================================================
		//incia procura por nós de rede
		//============================================================================================
		vm.inciaProcuraElementoRede = function(nodesQuant){
			vm.procurandoElementosRede = true
			vm.modulosScan = []
			getsetmodbus.modbusStartScanSearch(nodesQuant).then(function(response){
				vm.openModalScan('sm', nodesQuant)
			}).catch(function(err){
				addError('Erro ao  iniciar a procura de nós! '+err)
			})
			
		}

		//============================================================================================
		//incia procura por redes sem fio
		//============================================================================================
		vm.inciaProcuraRedeWifi = function(par){
			// vm.procurandoElementosRede = true
			// vm.modulosScan = []
			comandopiplc.scanNetwork().then(function(result){
				if (par!='start') msgs.addSuccess('Informações de wifi atualizadas :)')
					vm.wifilist = result
				var i = 0
				if(vm.wifilist){
				vm.wifilist.forEach(function(){
					vm.wifilist[i].signalLevel = Math.min(Math.max(2 * (vm.wifilist[i].signalLevel + 100), 0), 100)
					i++
				})
			}
			}).catch(function(err){
				console.log(err);
			})
		}
		vm.inciaProcuraRedeWifi('start')
		//============================================================================================
		//informações da rede conectada
		//============================================================================================
		vm.statusRedeWifi = function(){
			comandopiplc.statusNetwork().then(function(result){
				vm.wifiStatus = result
				if (vm.wifiStatus) {
					comandopiplc.getNetwork().then(function(result){
						if (result) {
							vm.networkStatus = result
							vm.networkStatus.ipwifi = vm.networkStatus.ipwifi
							vm.networkStatus.ipeth = vm.networkStatus.ipeth

							vm.networkStatus.dnswifi = vm.networkStatus.dnswifi
							vm.networkStatus.dnseth = vm.networkStatus.dnseth

							vm.networkStatus.wifiname = vm.wifiStatus.ssid
							vm.networkStatus.wifimac = vm.wifiStatus.mac
							comandopiplc.comandoExePiPlc('ifconfig eth0').then(function(result){
								if (result) {
									vm.networkStatus.ethmac = result.result.result[0].match(/ ..\:..{13}/g)[0]
								}
							})
						}
					})
				}
			})
		}
		vm.statusRedeWifi()
		//============================================================================================
		//Pega dados do controlador
		//============================================================================================
		vm.freediskPiPlc = function(){
			comandopiplc.freediskPiPlc().then(function(result){
			})
		}
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
			//envia informações de qual viwew esta ativa
			//0=Dashboard
			//1=Menu1
			//2=Menu2
			//100=configura componentes
			//101=configura PLCpi
			//============================================================================================
			trocaDados.set(101,0)
			//============================================================================================
			//clique acordion1
			//============================================================================================
			vm.acordion1 = function () {
				vm.openAc1 = true
				vm.openAc2 = false
				vm.openAc3 = false
			}
			//============================================================================================
			//clique acordion2
			//============================================================================================
			vm.acordion2 = function () {
				vm.openAc1 = false
				vm.openAc2 = true
				vm.openAc3 = false
			}
			//============================================================================================
			//clique acordion2
			//============================================================================================
			vm.acordion3 = function () {
				vm.openAc1 = false
				vm.openAc2 = false
				vm.openAc3 = true
			}			//============================================================================================
			//Abre modal de escrita novo valor
			//============================================================================================
			vm.openModalReg = function (size, parentSelector,dadoClick) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/popAlteraValor.html',
					controller: 'popController',
					controllerAs: $scope,
					size: size,
					resolve: {
						registro: function () { return dadoClick },
						valorIni: function () { return vm.bufferCompLeitura[dadoClick] }

					}
				});
				modalInstance.result.then(function(response){
					if ((!isNaN(response.registro)) && (!isNaN(response.valor))) {
						vm.writeModbus(0,response.registro,response.valor)
					}
				})
			}
			//============================================================================================
			//Abre modal quantodade de  regostros a proucurar
			//============================================================================================
			vm.openModalQuantNodes = function (size, quant) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/popProcuraNodes.html',
					controller: 'popControllerNodesQuant',
					controllerAs: $scope,
					size: size,
					resolve: {
						valor: function () { return quant }

					}
				});
				modalInstance.result.then(function(response){
					if (response) {
						console.log("response: ",response)
						vm.inciaProcuraElementoRede(response.valor)
					}
				})
			}
			
			//============================================================================================
			//Abre modal restart controlador
			//============================================================================================
			vm.openModalReboot = function (size) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/rebootTemplate.html',
					controller: 'rebootController',
					controllerAs: 'rebootCtrl',
					backdrop  : 'static',
					keyboard  : false,
					Ssize: size,
					resolve: {

					}
				});
				modalInstance.result.then(function(response){


				})
			}

			//============================================================================================
			//Abre modal de escrita novo valor
			//============================================================================================
			vm.openModalScan= function (size, nodes) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/scanrede.html',
					controller: 'scanredeController',
					controllerAs: 'scanredeCtrl',
					backdrop  : 'static',
					keyboard  : false,
					size: size,
					resolve: {
							nodes: function () { return nodes},
					}
				});
				modalInstance.result.then(function(response){
						$timeout(function(){
							vm.procurandoElementosRede = false
							vm.getElementoRede ()
						}, 1000)

				})
			}
			//============================================================================================
			//Abre modal de dados das redes
			//============================================================================================
			vm.openModalConectWifi = function (size, parentSelector,index) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/popConectWifi.html',
					controller: 'popControllerWifi',
					controllerAs: $scope,
					size: size,
					resolve: {
						ssid: function () { return vm.wifilist[index].ssid },
						password: function () { return '' }
					}
				});
				modalInstance.result.then(function(response){
					comandopiplc.setNetwork(response.ssid,response.password).then(function(response){
						msgs.addSuccess('Conectado a rede sem fio - '+response.config.data.ssid)
					}).catch(function(err){
						msgs.addError('Não foi possível conectar a rede sem fio')
					})
				})
			}
			//============================================================================================
			//Abre modal para editar usuário
			//============================================================================================
			vm.openModalEditUser = function (size, parentSelector,index) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/popEditUser.html',
					controller: 'popControllerEditUser',
					controllerAs: $scope,
					size: size,
					resolve: {
						nome: function () { return vm.usuarios[index].nome },
						email: function () { return vm.usuarios[index].email },
						acesso: function () { return vm.usuarios[index].acesso.toString() },
						editar: function () { return true },
						titulo: function () { return 'Editar usuário' },
						sistemas: function () { return vm.sistemas}
					}
				});
				modalInstance.result.then(function(response){
					if (typeof response != "undefined") {
						querysql.queryMysqlUpdatePassHash(response.nome, response.email, response.senha, response.acesso, response.sistema).then(function(response){
							msgs.addSuccess('Usuário alterado! :)')
							vm.updateUsuarios()
						}).catch(function(err){
							msgs.addError('Erro na edição do usuário!: '+err)
						})
					}
				})
			}
			//============================================================================================
			//Abre modal para novo usuário
			//============================================================================================
			vm.openModalNewUser = function (size, parentSelector,index) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configureInPi/popEditUser.html',
					controller: 'popControllerEditUser',
					controllerAs: $scope,
					size: size,
					resolve: {
						nome: function () { return '' },
						email: function () { return '' },
						acesso: function () { return '' },
						editar: function () { return false },
						titulo: function () { return 'Novo usuário' },
						sistemas: function () { return vm.sistemas}
					}
				});
				modalInstance.result.then(function(response){
					if (typeof response != "undefined") {
						querysql.queryMysqlNewUserHash(response.nome, response.email, response.senha, response.acesso, response.sistema).then(function(response){
							vm.updateUsuarios()
							msgs.addSuccess('Usuário adicionado! :)')
						}).catch(function(err){
							if(err.data.code=="ER_DUP_ENTRY"){
								msgs.addError("E-mail já cadastrado!")
							}else{
								msgs.addError("Erro desconhecido: "+err)
							}

						})
					}
				})
			}
			//============================================================================================
			//Abre modal configura IP
			//============================================================================================
			vm.removeUser = function(index){


				if (vm.usuarios[index].email=='intech@intech-automacao.com.br') {
					msgs.addError('Não é possível remover este usuário! :(')
					return
				}

				querysql.queryGeral( `DELETE FROM usuarios WHERE email = '${vm.usuarios[index].email}'`).then(function(response){
					vm.updateUsuarios()
					msgs.addSuccess('Usuário removido! :)')
				})

			}
			//============================================================================================
			//Lista de imagens
			//============================================================================================
			vm.getImageList = function(){
					querysql.getImageList(consts.addressFileGeneral, 'png-jpg-gif').then(function(response){
						vm.arquivosImagem = response.data
					})
				}
				vm.getImageList()

			//============================================================================================
			//Lista de imagens pasta objetos
			//============================================================================================
			vm.getImageListObjetos = function(){
					querysql.getImageList(consts.addressFileObjects, 'png-jpg-gif').then(function(response){
						vm.arquivosImagemObjetos = response.data
					})
				}
				vm.getImageListObjetos()			
			//============================================================================================
			//Abre modal configura IP
			//============================================================================================
			vm.setNetworkSettings = function (size, parentSelector,index) {
				comandopiplc.getNetwork().then(function(result){
					if (result) {
						vm.networkStatus = result
						vm.networkStatus.ipwifi = vm.networkStatus.ipwifi
						vm.networkStatus.ipeth = vm.networkStatus.ipeth

						vm.networkStatus.dnswifi = vm.networkStatus.dnswifi
						vm.networkStatus.dnseth = vm.networkStatus.dnseth

						vm.networkStatus.wifiname = vm.wifiStatus.ssid
						vm.networkStatus.wifimac = vm.wifiStatus.mac

						var oldWifiIp = vm.networkStatus.ipwifi
						var oldWifiGateway = vm.networkStatus.gatewaywifi
						var oldWifiDns = vm.networkStatus.dnswifi

						var oldEthIp = vm.networkStatus.ipeth
						var oldEthGateway = vm.networkStatus.gatewayeth
						var oldEthDns = vm.networkStatus.dnseth

						var modalInstance = $uibModal.open({
							templateUrl: '/_configureInPi/popAlteraIp.html',
							controller: 'popAlteraIpController',
							controllerAs: $scope,
							size: size,
							resolve: {
								dhcpwifi: function(){return vm.networkStatus.dhcpwifi},
								ipwifi: function () { return vm.networkStatus.ipwifi },
								gatewaywifi: function () { return vm.networkStatus.gatewaywifi },
								dnswifi: function () { return vm.networkStatus.dnswifi },

								dhcpeth: function(){return vm.networkStatus.dhcpeth},
								ipeth: function () { return vm.networkStatus.ipeth },
								gatewayeth: function () { return vm.networkStatus.gatewayeth },
								dnseth: function () { return vm.networkStatus.dnseth },
								modo: function(){return vm.networkWifiModo}
							}
						});

						modalInstance.result.then(function(response){
							if (typeof response != "undefined") {
								vm.openModalReboot('sm')
								comandopiplc.setNetworkIp(
									oldWifiIp,response.ipwifi,
									oldWifiGateway, response.gatewaywifi,
									oldWifiDns, response.dnswifi,
									oldEthIp,response.ipeth,
									oldEthGateway, response.gatewayeth,
									oldEthDns, response.dnseth,
									response.dhcpwifi, response.dhcpeth
								).then(function(response){
									vm.statusRedeWifi()
									$timeout(function() {
										comandopiplc.comandoExePiPlc('sudo reboot')
									}, 5000);
								})
							}
						})
					}
				})
			}
			
			//============================================================================================
			//preenche combo com sistemas
			//============================================================================================
			vm.sistema_default = {
				nome: ""
			}
			vm.sistemas = []
			//============================================================================================
			//Autualiza sistema
			//============================================================================================
			vm.updateSistema = function(index) {
				querysql.querySistem(ID_SISTEMA_USER)
				.then(function(response){
					vm.sistemas = response.data
					vm.sistemaId = response.data[0].id
					vm.sistemaUpdateMs = response.data[0].tempo_update_comp
					vm.sistemaNome = response.data[0].nome

					vm.sistema_default.nome= response.data[0].nome
					//vm.baudrate_novo.id = response.data[0].baudrate_inpiplc.toString()
					vm.timeout_novo.id = response.data[0].timeout_inpiplc.toString()

					//	vm.sistemaFonteSize = response.data[0].nome_fontsize==null ? 16 : response.data[0].nome_fontsize.toString()
					vm.sistemaNomeMenu1 = response.data[0].menu1_nome
					vm.sistemaIconMenu1 = response.data[0].menu1_icon
					vm.sistemaHabMenu1 = response.data[0].menu1_visible == 1 ? true : false
					vm.sistemaNomeMenu2 = response.data[0].menu2_nome
					vm.sistemaIconMenu2 = response.data[0].menu2_icon
					vm.sistemaNomeMenu3 = response.data[0].menu3_nome
					vm.sistemaIconMenu3 = response.data[0].menu3_icon
					vm.sistemaNomeMenu4 = response.data[0].menu4_nome
					vm.sistemaIconMenu4 = response.data[0].menu4_icon
					vm.sistemaNomeMenu5 = response.data[0].menu5_nome
					vm.sistemaIconMenu5 = response.data[0].menu5_icon
					vm.sistemaNomeMenu6 = response.data[0].menu6_nome
					vm.sistemaIconMenu6 = response.data[0].menu6_icon
					vm.sistemaNomeMenu7 = response.data[0].menu7_nome
					vm.sistemaIconMenu7 = response.data[0].menu7_icon
					vm.sistemaNomeMenu8 = response.data[0].menu8_nome
					vm.sistemaIconMenu8 = response.data[0].menu8_icon
					vm.sistemaNomeMenu9 = response.data[0].menu9_nome
					vm.sistemaIconMenu9 = response.data[0].menu9_icon
					vm.sistemaNomeMenu10 = response.data[0].menu10_nome
					vm.sistemaIconMenu10 = response.data[0].menu10_icon
					vm.sistemaHabMenu2 = response.data[0].menu2_visible == 1 ? true : false
					vm.sistemaAvisos = response.data[0].barra_avisos_visualizar==null ? '0' : response.data[0].barra_avisos_visualizar.toString()
					vm.pathImagemCliente = response.data[0].path_imagem_cliente
					vm.sistema_update_charts = response.data[0].update_charts
					vm.enableAudioAlm = response.data[0].enableAudioAlm==null ? '0' : response.data[0].enableAudioAlm.toString()
					vm.requestingDataConfig = false
				})
				.catch(function(error){
					msgs.addError('Erro na execução da consulta! :('+error)
				})

			}

			vm.updateSistema();


			//============================================================================================
			//Confirma edição de registro de sistema
			//============================================================================================
			vm.sistemaEditarConfirma = function(){
				const cmdSql=  "UPDATE config_sistema SET "+
				"nome='" + vm.sistemaNome + "' " +
				",tempo_update_comp='" + vm.sistemaUpdateMs  + "' " +
				//",nome_fontsize='" + vm.sistemaFonteSize + "' " +
				",menu1_nome='" + vm.sistemaNomeMenu1 + "' " +
				",menu1_icon='" + vm.sistemaIconMenu1 + "' " +
				",menu1_visible='" + (vm.sistemaHabMenu1 ? 1:0) + "' " +
				",menu2_nome='" + vm.sistemaNomeMenu2 + "' " +
				",menu2_icon='" + vm.sistemaIconMenu2 + "' " +
				",menu3_nome='" + vm.sistemaNomeMenu3 + "' " +
				",menu3_icon='" + vm.sistemaIconMenu3 + "' " +
				",menu4_nome='" + vm.sistemaNomeMenu4 + "' " +
				",menu4_icon='" + vm.sistemaIconMenu4 + "' " +
				",menu5_nome='" + vm.sistemaNomeMenu5 + "' " +
				",menu5_icon='" + vm.sistemaIconMenu5 + "' " +
				",menu6_nome='" + vm.sistemaNomeMenu6 + "' " +
				",menu6_icon='" + vm.sistemaIconMenu6 + "' " +
				",menu7_nome='" + vm.sistemaNomeMenu7 + "' " +
				",menu7_icon='" + vm.sistemaIconMenu7 + "' " +
				",menu8_nome='" + vm.sistemaNomeMenu8 + "' " +
				",menu8_icon='" + vm.sistemaIconMenu8 + "' " +
				",menu9_nome='" + vm.sistemaNomeMenu9 + "' " +
				",menu9_icon='" + vm.sistemaIconMenu9 + "' " +
				",menu10_nome='" + vm.sistemaNomeMenu10 + "' " +
				",menu10_icon='" + vm.sistemaIconMenu10 + "' " +
				",menu2_visible='" + (vm.sistemaHabMenu2 ? 1:0)+ "' " +
				",barra_avisos_visualizar='" + vm.sistemaAvisos+ "' " +
				",path_imagem_cliente='" + vm.pathImagemCliente+ "' " +
				",update_charts='" + vm.sistema_update_charts+ "' " +
				",enableAudioAlm='" + vm.enableAudioAlm+ "' " +

				" WHERE id = '"+ vm.sistemaId +"'"

				querysql.queryGeral(cmdSql)
				.then(function(response){
					msgs.addSuccess('Registro alterado! :)')
					$window.location.reload();

				})
				.catch(function(error){
					msgs.addError('Falha na gravação no banco! '+ error)
				})

			}

			//============================================================================================
			//Apaga charts(bug)
			//============================================================================================
			vm.restoreCharts = function(){
				const cmdSql = `DELETE FROM config_compontes WHERE tipo='chart'`
				querysql.queryMysqlInsertPost(cmdSql).then(function(response){
					msgs.addSuccess('Charts restaurados! :)')
				}).catch(function(error){
					msgs.addError('Falha na gravação no banco! '+ error)
				})

			}
			//============================================================================================
			//Apaga charts(bug)
			//============================================================================================
			vm.restoreAlarmes = function(){
				const cmdSql = `DELETE FROM alarmes`
				querysql.queryMysqlInsertPost(cmdSql).then(function(response){
					msgs.addSuccess('Alarmes restaurados! :)')
				}).catch(function(error){
					msgs.addError('Falha na gravação no banco! '+ error)
				})

			}
			//============================================================================================
			//preenche combo com endereços
			//============================================================================================
			vm.enderecos_modulo_default = {
				id: '0'
			}
			vm.enderecos_modulo = []
			for (var i = 0; i < 241; i++) {
				vm.enderecos_modulo.push({id:i})
			}
			//============================================================================================
			//preenche combo com endereços
			//============================================================================================
			vm.enderecos_modulo_novo = {
				id: '240'
			}
			//============================================================================================
			//preenche combo timeout
			//============================================================================================
			vm.timeout_default = {id: '100'}
			vm.timeout = []
			vm.timeout.push({id:'100'})
			vm.timeout.push({id:'150'})
			vm.timeout.push({id:'200'})
			vm.timeout.push({id:'250'})
			vm.timeout.push({id:'300'})
			vm.timeout.push({id:'400'})
			vm.timeout.push({id:'500'})
			vm.timeout.push({id:'600'})
			vm.timeout.push({id:'700'})
			vm.timeout.push({id:'800'})
			vm.timeout.push({id:'900'})
			vm.timeout.push({id:'1000'})
			vm.timeout_novo = {id: '100'}			
			//============================================================================================
			//preenche combo com baudrate
			//============================================================================================
			vm.baudrate_default = {id: '115200'}
			vm.baudrate = []
			vm.baudrate.push({id:'1200'})
			vm.baudrate.push({id:'4800'})
			vm.baudrate.push({id:'9600'})
			vm.baudrate.push({id:'19200'})
			vm.baudrate.push({id:'38400'})
			vm.baudrate.push({id:'57600'})
			vm.baudrate.push({id:'115200'})
			vm.baudrate_novo = {id: '115200'}
			//============================================================================================
			//preenche combo com baudrate
			//============================================================================================
			vm.baudrate_mod_default = {id: '115200'}
			vm.baudrate_mod = []
			vm.baudrate_mod.push({id:'1200'})
			vm.baudrate_mod.push({id:'4800'})
			vm.baudrate_mod.push({id:'9600'})
			vm.baudrate_mod.push({id:'19200'})
			vm.baudrate_mod.push({id:'38400'})
			vm.baudrate_mod.push({id:'57600'})
			vm.baudrate_mod.push({id:'115200'})
			vm.baudrate_mod_novo = {id: '115200'}
			//============================================================================================
			//Variaveis
			//============================================================================================
			var statusWrite = 0
			var verifyStatusWritePlaca = false
			vm.verifyStatusWaitToRead = false

			var timerReqModbus  = undefined
			var initParameter = false

			vm.componente_modulo_plcpi = 'inPi-PLC'
			vm.bufferCompEscrita = []
			vm.bufferCompLeitura = new Array(1100).fill(0)
			vm.bufferCompLeituraFcon = ' - offline'
			vm.comissionamentoSaidas = 0
			vm.offsetReg = 0

			vm.componente_device_modbus_write_id = 0
			vm.componente_device_modbus_write_reg = 0
			vm.componente_device_modbus_read_id = 0
			vm.componente_device_modbus_read_reg  = 0

			vm.mismatchModule = false


			vm.mapMinEscalach0 = '---'
			vm.mapMaxEscalach0 = '---'
			vm.mapMinOffsetch0 = '---'
			vm.mapMaxOffsetch0 = '---'
			vm.mapMaxVdcOffsetch0 = '---'

			vm.mapMinEscalach1 = '---'
			vm.mapMaxEscalach1 = '---'
			vm.mapMinOffsetch1 = '---'
			vm.mapMaxOffsetch1 = '---'
			vm.mapMaxVdcOffsetch1 = '---'

			vm.mapMinEscalach2 = '---'
			vm.mapMaxEscalach2 = '---'
			vm.mapMinOffsetch2 = '---'
			vm.mapMaxOffsetch2 = '---'
			vm.mapMaxVdcOffsetch2 = '---'

			vm.mapMinEscalach3 = '---'
			vm.mapMaxEscalach3 = '---'
			vm.mapMinOffsetch3 = '---'
			vm.mapMaxOffsetch3 = '---'
			vm.mapMaxVdcOffsetch3 = '---'
			
			vm.modeCh = '---'

			vm.rampingDoTrCh0 = '---'
			vm.rampingDoTrCh1 = '---'
			vm.rampingDoTrCh2 = '---'
			vm.rampingDoTrCh3 = '---'
			vm.rampingDoTrCh4 = '---'
			vm.rampingDoTrCh5 = '---'
			vm.rampingDoTrCh6 = '---'
			vm.rampingDoTrCh7 = '---'

			vm.rampingDoTriacCh0 = '---'
			vm.rampingDoTriacCh1 = '---'
			vm.rampingDoTriacCh2 = '---'
			vm.rampingDoTriacCh3 = '---'
			vm.rampingDoTriacCh4 = '---'
			vm.rampingDoTriacCh5 = '---'
			vm.rampingDoTriacCh6 = '---'
			vm.rampingDoTriacCh7 = '---'

			vm.forceDoTriacCh0 = 0
			vm.forceDoTriacCh1 = 0
			vm.forceDoTriacCh2 = 0
			vm.forceDoTriacCh3 = 0
			vm.forceDoTriacCh4 = 0
			vm.forceDoTriacCh5 = 0
			vm.forceDoTriacCh6 = 0
			vm.forceDoTriacCh7 = 0

			vm.forceDoTrCh0 = 0
			vm.forceDoTrCh1 = 0
			vm.forceDoTrCh2 = 0
			vm.forceDoTrCh3 = 0
			vm.forceDoTrCh4 = 0
			vm.forceDoTrCh5 = 0
			vm.forceDoTrCh6 = 0
			vm.forceDoTrCh7 = 0			
			//============================================================================================
			//abre node-red
			//============================================================================================
			vm.openNodeRed = function(){
				$window.open(consts.noderedUrl)
			}
			//============================================================================================
			//Verifica tipo de modulo
			//============================================================================================
			vm.updateIdModuleTypeInfo = function(reg){
				if (reg==0) {
					return 'inPi-PLC'
				}
				if (reg==1) {
					return 'inPi-onboard-in'
				}
				if (reg==2) {
					return 'inPi-off-in-8DI'
				}
				if (reg==3) {
					return 'inPi-off-out-4DO'
				}
				if (reg==4) {
					return 'inPi-off-in-4AI'
				}	
				if (reg==5) {
					return 'inPi-off-out-8DO-TRIAC'
				}
				if (reg==6) {
					return 'inPi-off-out-8DO-TR'
				}				
				if (reg==7) {
					return 'inPi-off-out-4AO'
				}
			}

			//============================================================================================
			//atualiza novo endereço na mudança do default
			//============================================================================================
			vm.updateIdModule = function(){
				vm.enderecos_modulo_novo.id = vm.enderecos_modulo_default.id
			}

			//============================================================================================
			//preenche combo com endereços
			//============================================================================================
			vm.updateModule = function (model) {
				vm.updateIdModule()
				initParameter = false;

				if (vm.componente_modulo_plcpi=='inPi-onboard-in') {
					vm.bufferCompLeitura[23] = '---'
					vm.bufferCompLeitura[9] = '---'
					vm.bufferCompLeitura[11] = '---'
					vm.bufferCompLeitura[29] = '---'
					vm.bufferCompLeitura[10] = '---'
					vm.bufferCompLeitura[12] = '---'
					vm.writeModbus(vm.enderecos_modulo_default.id,33,0)
					vm.writeModbus(vm.enderecos_modulo_default.id,34,0)


				}
				if (vm.componente_modulo_plcpi=='inPi-off-in-4AI') {
					vm.bufferCompLeitura[12] = '---'
					vm.bufferCompLeitura[1] = '---'
					vm.bufferCompLeitura[5] = '---'
					vm.bufferCompLeitura[19] = '---'
					vm.bufferCompLeitura[2] = '---'
					vm.bufferCompLeitura[6] = '---'
					vm.bufferCompLeitura[25] = '---'
					vm.bufferCompLeitura[3] = '---'
					vm.bufferCompLeitura[7] = '---'
					vm.bufferCompLeitura[31] = '---'
					vm.bufferCompLeitura[4] = '---'
					vm.bufferCompLeitura[8] = '---'
				}
				if (vm.componente_modulo_plcpi=='inPi-off-out-4AO') {
					vm.bufferCompLeitura[1] = '---'
					vm.bufferCompLeitura[2] = '---'
					vm.bufferCompLeitura[3] = '---'
					vm.bufferCompLeitura[4] = '---'
				}


				updateParameterAnalog(vm.componente_modulo_plcpi)




			}

			//============================================================================================
			//Destroy scope
			//============================================================================================
			$scope.$on("$destroy", function() {
				if (timerReqModbus) {
					$interval.cancel(timerReqModbus)

				}
				//vm.writeModbus(vm.enderecos_modulo_default.id,34,0)
				//vm.writeModbus(vm.enderecos_modulo_default.id,35,0)
			})

			vm.updateModeCh = function(canal){
				vm.modeCh = 0
				vm.modeCh = (vm.modeCh | vm.modeCh3) << 6
				vm.modeCh = vm.modeCh | (vm.modeCh2 << 4)
				vm.modeCh = vm.modeCh | (vm.modeCh1 << 2)
				vm.modeCh = vm.modeCh | vm.modeCh0
			}

			//============================================================================================
			//preenche campos na inicialização
			//============================================================================================
			function updateParameterAnalog(model){

				vm.baudrate_mod_novo.id = vm.bufferCompLeitura[37]*100
				vm.baudrate_mod_novo.id = vm.baudrate_mod_novo.id.toString()

				if (model=='inPi-onboard-in') {
					vm.mapMinEscalach0 = vm.bufferCompLeitura[21]
					vm.mapMaxEscalach0 = vm.bufferCompLeitura[22]
					vm.mapMinOffsetch0 = vm.bufferCompLeitura[24]
					vm.mapMaxOffsetch0 = vm.bufferCompLeitura[25]

					vm.mapMinEscalach1 = vm.bufferCompLeitura[27]
					vm.mapMaxEscalach1 = vm.bufferCompLeitura[28]
					vm.mapMinOffsetch1 = vm.bufferCompLeitura[30]
					vm.mapMaxOffsetch1 = vm.bufferCompLeitura[31]

					vm.HabInputOnboardVar = vm.bufferCompLeitura[17]
					vm.HabInput0OnboardVarInit = bit_test(vm.bufferCompLeitura[17],0)?true:false
					vm.HabInput1OnboardVarInit = bit_test(vm.bufferCompLeitura[17],1)?true:false
					vm.filterInputsOnboard = vm.bufferCompLeitura[18]
	
					vm.modeCh = vm.bufferCompLeitura[35]
					vm.modeCh0 = ((vm.modeCh & 0x0003) >> 0).toString()
					vm.modeCh1 = ((vm.modeCh & 0x000c) >> 2).toString()
				}
				if (model=='inPi-off-in-8DI') {

					vm.HabInput8DiVar = vm.bufferCompLeitura[33]
					vm.HabInput08DiVarInit = bit_test(vm.bufferCompLeitura[33],0)?true:false
					vm.HabInput18DiVarInit = bit_test(vm.bufferCompLeitura[33],1)?true:false
					vm.filterInputs8Di = vm.bufferCompLeitura[34]
	
				}
				if (model=='inPi-off-in-4AI') {
					vm.mapMinEscalach0 = vm.bufferCompLeitura[10]
					vm.mapMaxEscalach0 = vm.bufferCompLeitura[11]
					vm.mapMinOffsetch0 = vm.bufferCompLeitura[13]
					vm.mapMaxOffsetch0 = vm.bufferCompLeitura[14]
					vm.mapMaxVdcOffsetch0 = vm.bufferCompLeitura[15]


					vm.mapMinEscalach1 = vm.bufferCompLeitura[17]
					vm.mapMaxEscalach1 = vm.bufferCompLeitura[18]
					vm.mapMinOffsetch1 = vm.bufferCompLeitura[20]
					vm.mapMaxOffsetch1 = vm.bufferCompLeitura[21]
					vm.mapMaxVdcOffsetch1 = vm.bufferCompLeitura[22]

					vm.mapMinEscalach2 = vm.bufferCompLeitura[23]
					vm.mapMaxEscalach2 = vm.bufferCompLeitura[24]
					vm.mapMinOffsetch2 = vm.bufferCompLeitura[26]
					vm.mapMaxOffsetch2 = vm.bufferCompLeitura[27]
					vm.mapMaxVdcOffsetch2 = vm.bufferCompLeitura[28]

					vm.mapMinEscalach3 = vm.bufferCompLeitura[29]
					vm.mapMaxEscalach3 = vm.bufferCompLeitura[30]
					vm.mapMinOffsetch3 = vm.bufferCompLeitura[32]
					vm.mapMaxOffsetch3 = vm.bufferCompLeitura[33]
					vm.mapMaxVdcOffsetch3 = vm.bufferCompLeitura[34]

					vm.modeCh = vm.bufferCompLeitura[35]
					vm.modeCh0 = ((vm.modeCh & 0x0003) >> 0).toString()
					vm.modeCh1 = ((vm.modeCh & 0x000c) >> 2).toString()
					vm.modeCh2 = ((vm.modeCh & 0x0030) >> 4).toString()
					vm.modeCh3 = ((vm.modeCh & 0x00c0) >> 6).toString()
				}
				if (model=='inPi-off-out-4AO') {
					vm.mapMinOffsetZeroch0 = vm.bufferCompLeitura[8]
					vm.mapMinOffsetch0 = vm.bufferCompLeitura[9]
					vm.mapMaxOffsetch0 = vm.bufferCompLeitura[10]
					vm.mapMaxVdcOffsetch0 = vm.bufferCompLeitura[11]
					vm.mapMinEscalach0 = vm.bufferCompLeitura[6]
					vm.mapMaxEscalach0 = vm.bufferCompLeitura[7]

					vm.mapMinOffsetZeroch1 = vm.bufferCompLeitura[15]
					vm.mapMinOffsetch1 = vm.bufferCompLeitura[16]
					vm.mapMaxOffsetch1 = vm.bufferCompLeitura[17]
					vm.mapMaxVdcOffsetch1 = vm.bufferCompLeitura[18]
					vm.mapMinEscalach1 = vm.bufferCompLeitura[13]
					vm.mapMaxEscalach1 = vm.bufferCompLeitura[14]

					vm.mapMinOffsetZeroch2 = vm.bufferCompLeitura[22]
					vm.mapMinOffsetch2 = vm.bufferCompLeitura[23]
					vm.mapMaxOffsetch2 = vm.bufferCompLeitura[24]
					vm.mapMaxVdcOffsetch2 = vm.bufferCompLeitura[25]
					vm.mapMinEscalach2 = vm.bufferCompLeitura[20]
					vm.mapMaxEscalach2 = vm.bufferCompLeitura[21]

					vm.mapMinOffsetZeroch3 = vm.bufferCompLeitura[29]
					vm.mapMinOffsetch3 = vm.bufferCompLeitura[30]
					vm.mapMaxOffsetch3 = vm.bufferCompLeitura[31]
					vm.mapMaxVdcOffsetch3 = vm.bufferCompLeitura[32]
					vm.mapMinEscalach3 = vm.bufferCompLeitura[27]
					vm.mapMaxEscalach3 = vm.bufferCompLeitura[28]

					vm.modeCh = vm.bufferCompLeitura[35]
					vm.modeCh0 = ((vm.modeCh & 0x0003) >> 0).toString()
					vm.modeCh1 = ((vm.modeCh & 0x000c) >> 2).toString()
					vm.modeCh2 = ((vm.modeCh & 0x0030) >> 4).toString()
					vm.modeCh3 = ((vm.modeCh & 0x00c0) >> 6).toString()


					vm.forceValue4AoCh[0] = vm.bufferCompLeitura[12]
					vm.forceValue4AoCh[1] = vm.bufferCompLeitura[19]
					vm.forceValue4AoCh[2] = vm.bufferCompLeitura[26]
					vm.forceValue4AoCh[3] = vm.bufferCompLeitura[33]

					vm.force4AoValues = vm.bufferCompLeitura[34] == 0 ? false : true

				}				

				if (model=='inPi-off-out-8DO-TR') {

					vm.rampingDoTrCh0 = vm.bufferCompLeitura[17]
					vm.rampingDoTrCh1 = vm.bufferCompLeitura[18]
					vm.rampingDoTrCh2 = vm.bufferCompLeitura[19]
					vm.rampingDoTrCh3 = vm.bufferCompLeitura[20]
					vm.rampingDoTrCh4 = vm.bufferCompLeitura[21]
					vm.rampingDoTrCh5 = vm.bufferCompLeitura[22]

					vm.forceValueTransistorCh[0] = vm.bufferCompLeitura[23]
					vm.forceValueTransistorCh[1] = vm.bufferCompLeitura[24]
					vm.forceValueTransistorCh[2] = vm.bufferCompLeitura[25]
					vm.forceValueTransistorCh[3] = vm.bufferCompLeitura[26]
					vm.forceValueTransistorCh[4] = vm.bufferCompLeitura[27]
					vm.forceValueTransistorCh[5] = vm.bufferCompLeitura[28]
					vm.forceValueTransistorCh[6] = vm.bufferCompLeitura[29]
					vm.forceValueTransistorCh[7] = vm.bufferCompLeitura[30]
					vm.forceTraValues = vm.bufferCompLeitura[35] == 0 ? false : true					

				}	


				if (model=='inPi-off-out-8DO-TRIAC') {

					vm.rampingDoTriacCh0 = vm.bufferCompLeitura[17]
					vm.rampingDoTriacCh1 = vm.bufferCompLeitura[18]
					vm.rampingDoTriacCh2 = vm.bufferCompLeitura[19]
					vm.rampingDoTriacCh3 = vm.bufferCompLeitura[20]
					vm.rampingDoTriacCh4 = vm.bufferCompLeitura[21]
					vm.rampingDoTriacCh5 = vm.bufferCompLeitura[22]
					vm.rampingDoTriacCh6 = vm.bufferCompLeitura[23]
					vm.rampingDoTriacCh7 = vm.bufferCompLeitura[24]

					vm.forceValueTriacCh[0] = vm.bufferCompLeitura[26]
					vm.forceValueTriacCh[1] = vm.bufferCompLeitura[27]
					vm.forceValueTriacCh[2] = vm.bufferCompLeitura[28]
					vm.forceValueTriacCh[3] = vm.bufferCompLeitura[29]
					vm.forceValueTriacCh[4] = vm.bufferCompLeitura[30]
					vm.forceValueTriacCh[5] = vm.bufferCompLeitura[31]
					vm.forceValueTriacCh[6] = vm.bufferCompLeitura[32]
					vm.forceValueTriacCh[7] = vm.bufferCompLeitura[33]
					vm.forceTraValues = vm.bufferCompLeitura[35] == 0 ? false : true	


				}	


			}

			vm.globalBittest = function bit_test(num, bit){
				var test =  ((num>>bit) % 2 != 0)
				return test
			}

			//============================================================================================
			//bitwise functions
			//============================================================================================
			function bit_test(num, bit){
				return ((num>>bit) % 2 != 0)
			}
			function bit_set(num, bit){
				return num | 1<<bit;
			}
			function bit_clear(num, bit){
				return num & ~(1<<bit);
			}
			function bit_toggle(num, bit){
				return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
			}
			//============================================================================================
			//Coloca placa de saida digital em modoTeste
			//============================================================================================
			vm.modoTeste = function(){
				vm.comissionamentoSaidas = bit_toggle(vm.comissionamentoSaidas,0)
				vm.writeModbus(vm.enderecos_modulo_default.id,35,vm.comissionamentoSaidas)
				if (vm.comissionamentoSaidas==0) {
					vm.writeModbus(vm.enderecos_modulo_default.id,34,0)
				}
			}
			//============================================================================================
			//Coloca placa de saida digital em modoTeste - onboard
			//============================================================================================
			vm.modoTesteOnboard = function(){
				vm.comissionamentoSaidas = bit_toggle(vm.comissionamentoSaidas,0)
				vm.writeModbus(vm.enderecos_modulo_default.id,34,vm.comissionamentoSaidas)
				if (vm.comissionamentoSaidas==0) {
					vm.writeModbus(vm.enderecos_modulo_default.id,34,0)
				}
			}	
			vm.HabInputOnboardVarInit = false		
			//============================================================================================
			//Habilita interrupção entrada 0
			//============================================================================================
			vm.HabInput0Onboard = function(){
				vm.HabInputOnboardVar = bit_toggle(vm.HabInputOnboardVar,0)
				vm.writeModbus(vm.enderecos_modulo_default.id,17,vm.HabInputOnboardVar)
			}
			//============================================================================================
			//Habilita interrupção entrada 1
			//============================================================================================
			vm.HabInput1Onboard = function(){
				vm.HabInputOnboardVar = bit_toggle(vm.HabInputOnboardVar,1)
				vm.writeModbus(vm.enderecos_modulo_default.id,17,vm.HabInputOnboardVar)
			}			

			vm.HabInput8DiVarInit = false		
			//============================================================================================
			//Habilita interrupção entrada 0 8DI
			//============================================================================================
			vm.HabInput08Di = function(){
				vm.HabInput8DiVar = bit_toggle(vm.HabInput8DiVar,0)
				vm.writeModbus(vm.enderecos_modulo_default.id,33,vm.HabInput8DiVar)
			}
			//============================================================================================
			//Habilita interrupção entrada 1 8DI
			//============================================================================================
			vm.HabInput18Di = function(){
				vm.HabInput8DiVar = bit_toggle(vm.HabInput8DiVar,1)
				vm.writeModbus(vm.enderecos_modulo_default.id,33,vm.HabInput8DiVar)
			}			//============================================================================================
			//Coloca placa de saida digital TRIAC em modoTeste
			//============================================================================================
			vm.modoTesteTriac = function(){
				vm.forceTriacValuesInt = vm.forceTriacValues ? 1 : 0
				vm.writeModbus(vm.enderecos_modulo_default.id,34,vm.forceTriacValuesInt)
			}
			//============================================================================================
			//Força valores em modo teste triac
			//============================================================================================
			vm.forceValueTriac = function(reg,regValue){
				vm.writeModbus(vm.enderecos_modulo_default.id,reg,vm.forceValueTriacCh[regValue])
			}
			//============================================================================================
			//Coloca placa de saida digital transistor em modoTeste
			//============================================================================================
			vm.modoTesteTra = function(){
				vm.forceTraValuesInt = vm.forceTraValues?  1 : 0
				vm.writeModbus(vm.enderecos_modulo_default.id,35,vm.forceTraValuesInt)
			}
			//============================================================================================
			//Coloca placa de saida analógica em modoTeste
			//============================================================================================
			vm.modoTeste4Ao = function(){
				vm.force4AoValuesInt = vm.force4AoValues?  1 : 0
				vm.writeModbus(vm.enderecos_modulo_default.id,34,vm.force4AoValuesInt)
			}
			//============================================================================================
			//Força valores em modo teste transistor
			//============================================================================================
			vm.forceValueTra = function(reg,regValue){
				vm.writeModbus(vm.enderecos_modulo_default.id,reg,vm.forceValueTransistorCh[regValue])
			}
			//============================================================================================
			//Força valores em modo teste saidas analogicas
			//============================================================================================
			vm.forceValue4Ao= function(reg,regValue){
				vm.writeModbus(vm.enderecos_modulo_default.id,reg,vm.forceValue4AoCh[regValue])
			}

			//============================================================================================
			//Realiza get no Server
			//============================================================================================
			vm.readModbus = function(id,reg,quant){		
				if(vm.verifyStatusWaitToRead) return		
				getsetmodbus.readModbusRegPost(id,reg,quant).then(function(response){


					//================================================
					//verifica contadores entradas placa ONBOARD
					//================================================
					if(vm.componente_modulo_plcpi=='inPi-onboard-in'){
						vm.counterCh0 = (vm.bufferCompLeitura[3]<<16) | vm.bufferCompLeitura[2]
						vm.counterCh1 = (vm.bufferCompLeitura[6]<<16) | vm.bufferCompLeitura[5]
					}
					//================================================
					//verifica contadores entradas placa ONBOARD
					//================================================
					if(vm.componente_modulo_plcpi=='inPi-off-in-8DI'){
						vm.counterCh0 = (vm.bufferCompLeitura[18]<<16) | vm.bufferCompLeitura[17]
						vm.counterCh1 = (vm.bufferCompLeitura[20]<<16) | vm.bufferCompLeitura[19]
						vm.counterCh2 = (vm.bufferCompLeitura[22]<<16) | vm.bufferCompLeitura[21]
						vm.counterCh3 = (vm.bufferCompLeitura[24]<<16) | vm.bufferCompLeitura[23]
						vm.counterCh4 = (vm.bufferCompLeitura[26]<<16) | vm.bufferCompLeitura[25]
						vm.counterCh5 = (vm.bufferCompLeitura[28]<<16) | vm.bufferCompLeitura[27]
						vm.counterCh6 = (vm.bufferCompLeitura[30]<<16) | vm.bufferCompLeitura[29]
						vm.counterCh7 = (vm.bufferCompLeitura[32]<<16) | vm.bufferCompLeitura[31]
					}




					if (vm.componente_modulo_plcpi=='inPi-PLC') {
						for (var i = 0; i < response.payload.length; i++) {
							vm.bufferCompLeitura[vm.offsetReg+i] = response.payload[i]
						}
					}else{
						vm.bufferCompLeitura =  response.payload
					}
					if (!response.error) {
						if (vm.updateIdModuleTypeInfo(vm.bufferCompLeitura[38])!=vm.componente_modulo_plcpi) {
							vm.mismatchModule = true
						}else {
							vm.mismatchModule = false
						}
						if (verifyStatusWritePlaca) {
							statusWrite++
							
						}

						if (vm.bufferCompLeitura[39]==0 && verifyStatusWritePlaca) {
							verifyStatusWritePlaca = false
							msgs.addSuccess('Legal :) placa configurada!')
							statusWrite = 0;
						}
						if (vm.bufferCompLeitura[39]!= 0 && verifyStatusWritePlaca && statusWrite>3) {
							verifyStatusWritePlaca = false
							statusWrite = 0
							msgs.addError('Ops :( erro na configuração!')
						}
						if((!initParameter) && (vm.updateIdModuleTypeInfo(vm.bufferCompLeitura[38])==vm.componente_modulo_plcpi)) {
							initParameter = true;
							updateParameterAnalog(vm.componente_modulo_plcpi)
						}
						vm.bufferCompLeituraFcon =  ' - online'
						vm.componenteLeituraFconCount = 0
					}else{
						vm.componenteLeituraFconCount++
						if (vm.componenteLeituraFconCount >=5) {
							console.log('falha de comunicação!->',response)
							vm.bufferCompLeituraFcon =  " - offline"
							vm.mismatchModule = false
						}
					}
				}).catch(function(err){
					//none
				})
			}
			//============================================================================================
			//Leitura dos registros modbus
			//============================================================================================
			function readModbusFunc(){
				if(!vm.waitResponseDownload){
					if (vm.componente_modulo_plcpi != 'sem-selecao') {
						if (vm.componente_modulo_plcpi=='inPi-PLC') {
							vm.readModbus(vm.enderecos_modulo_default.id,vm.offsetReg,100)
						}else {
							vm.readModbus(vm.enderecos_modulo_default.id,0,40)
						}
					}
				}
			}
			timerReqModbus = $interval(readModbusFunc,1000)
			//============================================================================================
			//Leitura dos registros modbus
			//============================================================================================
			vm.toogleFuncWriteComissionameto = function (id_write,reg_write, bit) {
				var estado = bit_toggle(vm.bufferCompLeitura[reg_write],bit)
				if (vm.bufferCompLeitura[35]==1) {
					vm.writeModbus(id_write,reg_write,estado)
				}
			}
			//============================================================================================
			//Leitura dos registros modbus
			//============================================================================================
			vm.toogleFuncWriteComissionametoOnboard = function (id_write,reg_write, bit) {
				var estado = bit_toggle(vm.bufferCompLeitura[reg_write],bit)
				if (vm.bufferCompLeitura[34]==1) {
					vm.writeModbus(id_write,reg_write,estado)
				}
			}			//============================================================================================
			//Indice do registro PLC a monitorar
			//============================================================================================
			vm.incRegOffsetPlcPi = function(){
				vm.offsetReg +=100
				if (vm.offsetReg>1000) {
					vm.offsetReg = 1000
				}
			}
			//============================================================================================
			//Indice do registro PLC a monitorar
			//============================================================================================
			vm.decRegOffsetPlcPi = function(){
				vm.offsetReg-=100
				if (vm.offsetReg<0) {
					vm.offsetReg = 0
				}
			}
			//============================================================================================
			//Escrita nos registro modbus
			//============================================================================================
			vm.writeModbus = function(id,reg,value){

				var data = "";
				var deferred = $q.defer();
				var cmdhttp = id+"/"+reg+"/"+value

				getsetmodbus.writeModbusRegPost(id,reg,value)
				.then( function(response, status, headers, config) {
					deferred.resolve(response.data);
					//if (statusWrite==0) {msgs.addSuccess('Legal :) placa configurada!')}
					//statusWrite++;
				})
				.catch(function(errResp) {
					console.log(errResp)
					deferred.reject({ message: "Really bad" });
					//if (statusWrite==0) {msgs.addError('Opa :( aconteceu um erro na configuração da placa!')}
					//statusWrite++;
				});
				return deferred.promise;
			}

			//============================================================================================
			//Escrita dos parametros na placa  "inPi-onboard-in"
			//============================================================================================
			vm.gravaDadosinPionboardin = function(model){
				var dadosWrite = []
				verifyStatusWritePlaca = true



				if (model=='inPi-onboard-in') {
					dadosWrite =[
					{	endereco: 21, valor:vm.mapMinEscalach0 },
					{	endereco: 22, valor:vm.mapMaxEscalach0 },
					{	endereco: 24, valor:vm.mapMinOffsetch0 },
					{	endereco: 25, valor:vm.mapMaxOffsetch0 },
					{	endereco: 27, valor:vm.mapMinEscalach1 },
					{	endereco: 28, valor:vm.mapMaxEscalach1 },
					{	endereco: 30, valor:vm.mapMinOffsetch1 },
					{	endereco: 31, valor:vm.mapMaxOffsetch1 },
					{	endereco: 35, valor:vm.modeCh},
					{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
					{	endereco: 18, valor:vm.filterInputsOnboard },
					{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
					{	endereco: 39, valor:vm.getUser().email=='dev@intech-automacao.com.br' ? 240: 13},//salva na eeprom o mC
						]
	
					}
					if (model=='inPi-off-in-4AI') {
						dadosWrite =[
						{	endereco: 10, valor:vm.mapMinEscalach0 },
						{	endereco: 11, valor:vm.mapMaxEscalach0 },
						{	endereco: 13, valor:vm.mapMinOffsetch0 },
						{	endereco: 14, valor:vm.mapMaxOffsetch0 },
						{	endereco: 15, valor:vm.mapMaxVdcOffsetch0 },
						{	endereco: 17, valor:vm.mapMinEscalach1 },
						{	endereco: 18, valor:vm.mapMaxEscalach1 },
						{	endereco: 20, valor:vm.mapMinOffsetch1 },
						{	endereco: 21, valor:vm.mapMaxOffsetch1 },
						{	endereco: 22, valor:vm.mapMaxVdcOffsetch1 },
						{	endereco: 23, valor:vm.mapMinEscalach2 },
						{	endereco: 24, valor:vm.mapMaxEscalach2 },
						{	endereco: 26, valor:vm.mapMinOffsetch2 },
						{	endereco: 27, valor:vm.mapMaxOffsetch2 },
						{	endereco: 28, valor:vm.mapMaxVdcOffsetch2 },
						{	endereco: 29, valor:vm.mapMinEscalach3 },
						{	endereco: 30, valor:vm.mapMaxEscalach3 },
						{	endereco: 32, valor:vm.mapMinOffsetch3 },
						{	endereco: 33, valor:vm.mapMaxOffsetch3 },
						{	endereco: 34, valor:vm.mapMaxVdcOffsetch3 },
						{	endereco: 35, valor:vm.modeCh},
						{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
						{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
						{	endereco: 39, valor:vm.getUser().email=='dev@intech-automacao.com.br' ? 240: 13 },//salva na eeprom o mC
						]
					}

					if (model=='inPi-off-out-4AO') {
						dadosWrite =[
						{	endereco: 8, valor:vm.mapMinOffsetZeroch0 },
						{	endereco: 9, valor:vm.mapMinOffsetch0 },
						{	endereco: 10, valor:vm.mapMaxOffsetch0 },
						{	endereco: 11, valor:vm.mapMaxVdcOffsetch0 },
						{	endereco: 6, valor:vm.mapMinEscalach0 },
						{	endereco: 7, valor:vm.mapMaxEscalach0 },

						{	endereco: 15, valor:vm.mapMinOffsetZeroch1 },
						{	endereco: 16, valor:vm.mapMinOffsetch1 },
						{	endereco: 17, valor:vm.mapMaxOffsetch1 },
						{	endereco: 18, valor:vm.mapMaxVdcOffsetch1 },
						{	endereco: 13, valor:vm.mapMinEscalach1 },
						{	endereco: 14, valor:vm.mapMaxEscalach1 },

						{	endereco: 22, valor:vm.mapMinOffsetZeroch2 },
						{	endereco: 23, valor:vm.mapMinOffsetch2 },
						{	endereco: 24, valor:vm.mapMaxOffsetch2 },
						{	endereco: 25, valor:vm.mapMaxVdcOffsetch2 },
						{	endereco: 20, valor:vm.mapMinEscalach2 },
						{	endereco: 21, valor:vm.mapMaxEscalach2 },

						{	endereco: 29, valor:vm.mapMinOffsetZeroch3 },
						{	endereco: 30, valor:vm.mapMinOffsetch3 },
						{	endereco: 31, valor:vm.mapMaxOffsetch3 },
						{	endereco: 32, valor:vm.mapMaxVdcOffsetch3 },
						{	endereco: 27, valor:vm.mapMinEscalach3 },
						{	endereco: 28, valor:vm.mapMaxEscalach3 },

						{	endereco: 35, valor:vm.modeCh},
						{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
						{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
						{	endereco: 39, valor:vm.getUser().email=='dev@intech-automacao.com.br' ? 240: 13 },//salva na eeprom o mC
						]
					}


					if (model=='inPi-off-in-8DI') {
						dadosWrite =[
						{	endereco: 34, valor:vm.filterInputs8Di },
						{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
						{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
						{	endereco: 39, valor:13 },//salva na eeprom o mC
						]
					}


					if (model=='inPi-off-out-4DO') {
						dadosWrite =[
						{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
						{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
						{	endereco: 39, valor:13 },//salva na eeprom o mC
						]
					}


					if (model=='inPi-off-out-8DO-TR') {
						dadosWrite =[
						{	endereco: 17, valor:vm.rampingDoTrCh0 },
						{	endereco: 18, valor:vm.rampingDoTrCh1 },
						{	endereco: 19, valor:vm.rampingDoTrCh2 },
						{	endereco: 20, valor:vm.rampingDoTrCh3 },
						{	endereco: 21, valor:vm.rampingDoTrCh4 },
						{	endereco: 22, valor:vm.rampingDoTrCh5 },
						// {	endereco: 23, valor:vm.rampingDoTrCh6 },
						// {	endereco: 24, valor:vm.rampingDoTrCh7 },

						{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
						{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
						{	endereco: 39, valor:13 },//salva na eeprom o mC
						]
					}

					if (model=='inPi-off-out-8DO-TRIAC') {
						dadosWrite =[
						{	endereco: 17, valor:vm.rampingDoTriacCh0 },
						{	endereco: 18, valor:vm.rampingDoTriacCh1 },
						{	endereco: 19, valor:vm.rampingDoTriacCh2 },
						{	endereco: 20, valor:vm.rampingDoTriacCh3 },
						{	endereco: 21, valor:vm.rampingDoTriacCh4 },
						{	endereco: 22, valor:vm.rampingDoTriacCh5 },
						{	endereco: 23, valor:vm.rampingDoTriacCh6 },
						{	endereco: 24, valor:vm.rampingDoTriacCh7 },

						{	endereco: 36, valor:vm.enderecos_modulo_novo.id },
						{	endereco: 37, valor:(parseInt(vm.baudrate_mod_novo.id)/100)},
						{	endereco: 39, valor:13 },//salva na eeprom o mC
						]
					}


					for (var i = 0; i < (dadosWrite.length); i++) {
						vm.writeModbus(vm.enderecos_modulo_default.id,dadosWrite[i].endereco,dadosWrite[i].valor)
					}

					vm.verifyStatusWaitToRead = true
					$timeout(function(){
						vm.verifyStatusWaitToRead = false
					},5000)

				}

			//============================================================================================
			//Atualiza valores de force
			//============================================================================================
			vm.updatevaluesForces = function (model){

				var dadosWrite = []
				
				if (model=='inPi-off-out-8DO-TRIAC') {
					dadosWrite =[
					{	endereco: 26, valor:vm.forceDoTriacCh0<50 &&  vm.forceDoTriacCh0>0 ? 50:vm.forceDoTriacCh0},
					{	endereco: 27, valor:vm.forceDoTriacCh1<50 &&  vm.forceDoTriacCh1>0 ? 50:vm.forceDoTriacCh1},
					{	endereco: 28, valor:vm.forceDoTriacCh2<50 &&  vm.forceDoTriacCh2>0 ? 50:vm.forceDoTriacCh2},
					{	endereco: 29, valor:vm.forceDoTriacCh3<50 &&  vm.forceDoTriacCh3>0 ? 50:vm.forceDoTriacCh3},
					{	endereco: 30, valor:vm.forceDoTriacCh4<50 &&  vm.forceDoTriacCh4>0 ? 50:vm.forceDoTriacCh4},
					{	endereco: 31, valor:vm.forceDoTriacCh5<50 &&  vm.forceDoTriacCh5>0 ? 50:vm.forceDoTriacCh5},
					{	endereco: 32, valor:vm.forceDoTriacCh6<50 &&  vm.forceDoTriacCh6>0 ? 50:vm.forceDoTriacCh6},
					{	endereco: 33, valor:vm.forceDoTriacCh7<50 &&  vm.forceDoTriacCh7>0 ? 50:vm.forceDoTriacCh7},

					]
				}
				if (model=='inPi-off-out-8DO-TR') {
					dadosWrite =[
					{	endereco: 26, valor:vm.forceDoTrCh0},
					{	endereco: 27, valor:vm.forceDoTrCh1},
					{	endereco: 28, valor:vm.forceDoTrCh2},
					{	endereco: 29, valor:vm.forceDoTrCh3},
					{	endereco: 30, valor:vm.forceDoTrCh4},
					{	endereco: 31, valor:vm.forceDoTrCh5},
					{	endereco: 32, valor:vm.forceDoTrCh6},
					{	endereco: 33, valor:vm.forceDoTrCh7},

					]
				}
				
				for (var i = 0; i < (dadosWrite.length); i++) {
					vm.writeModbus(vm.enderecos_modulo_default.id,dadosWrite[i].endereco,dadosWrite[i].valor)
				}

			}			
			//============================================================================================
			//ajusta baudrate
			//============================================================================================
			function adjustBaudrate(baudrate){
				return baudrate/100
			}
			//============================================================================================
			//Lista todos os sistemas
			//============================================================================================
			vm.queryAllsistemas = function(){
				const cmdSql= "SELECT * FROM config_sistema ORDER BY nome"
				querysql.queryMysqlGetPost(cmdSql).then(function(response){
					vm.sistemas = (response.data)

				})
			}
			//============================================================================================
			//Parametros de configuração dos sistemas
			//============================================================================================
			vm.querySistema= function(idt){
				const cmdSql= "SELECT * FROM config_sistema WHERE id= '"+ idt +"' ORDER BY nome DESC"
				querysql.queryMysqlGetPost(cmdSql).then(function(response){
					vm.sistemasById = (response.data)
					vm.menus = []
					vm.menus.push({id:'Dashboard'})
					if (vm.sistemasById[0].menu1_nome) {vm.menus.push({id:vm.sistemasById[0].menu1_nome})}
						if (vm.sistemasById[0].menu2_nome) {vm.menus.push({id:vm.sistemasById[0].menu2_nome})}

			})
			}
			//============================================================================================
			//Autualiza usuários cadastrados
			//============================================================================================
			vm.updateUsuarios = function() {
				querysql.queryUsers(ID_SISTEMA_USER).then(function(response){
					vm.usuarios = response.data
					vm.requestingDataUsers = false
				})
			}
			vm.updateUsuarios()
			//============================================================================================
			//Autualiza baudrate do controlador INPI PLC
			//============================================================================================
			vm.setBaudrate = function(){
				var objectJsonConfig = {
					serial:{
						baudrate:parseInt(vm.baudrate_novo.id),
						timeout:parseInt(vm.timeout_novo.id)
					}
				}
				const cmdSql=  `UPDATE config_sistema SET baudrate_inpiplc=${vm.baudrate_novo.id}, timeout_inpiplc=${vm.timeout_novo.id}  WHERE id = ${vm.sistemaId}`
					querysql.queryMysqlGetPost(cmdSql).then(function(response){
						
						getsetmodbus.setConfigModbusPort(objectJsonConfig).then(function(){
							msgs.addSuccess('Parâmetros da porta de comunicação alterados com sucesso! A aplicação reiniciará agora!')
							vm.comandoExePiPlc('pm2 restart 0')

						}).catch(function(err){
							msgs.addError('Erro nos parâmetros da porta de comunicação! '+err)
						})
					}).catch(function(err){
						console.log(err)
						msgs.addError('Erro nos parâmetros da porta de comunicação no banco! '+err)
					})


			}
			//============================================================================================
			//Set configurações de e-mail
			//============================================================================================
			vm.setEmail = function(){
				vm.responseEmailTesteOk = false
				vm.waitResponseEmailTeste = true
				var objectJsonConfig = {
					email:{
						emailNome:vm.emailNome,
						emailServidor:vm.emailServidor,
						emailPorta:parseInt(vm.emailPorta),
						emailUsuario:vm.emailUsuario,
						emailSenha:vm.emailSenha,
						emailAssunto:vm.emailAssunto,
						emailSeguro:vm.emailSeguro ? true : false 
					}
				}
					
				getsetmodbus.setConfigEmail(objectJsonConfig).then(function(){
					msgs.addSuccess('Parâmetros de e-mail alterados com sucesso! A aplicação reiniciará agora!')
					vm.waitResponseEmailTeste = false
					vm.comandoExePiPlc('pm2 restart 0')

				}).catch(function(err){
					msgs.addError('Erro nos parâmetros de configuração de e-mail! '+err)
					vm.waitResponseEmailTeste = false
				})
	
			}			
			//============================================================================================
			//Get configurações de e-mail
			//============================================================================================
			vm.getEmail = function(){
				getsetmodbus.getConfigEmail().then(function(response){
					var dados = response.data.jsonConfig.email
						vm.emailNome = dados.emailNome
						vm.emailServidor = dados.emailServidor
						vm.emailPorta = dados.emailPorta
						vm.emailUsuario = dados.emailUsuario
						vm.emailSenha = dados.emailSenha
						vm.emailSeguro = dados.emailSeguro				
						vm.emailAssunto = dados.emailAssunto				

				}).catch(function(err){
					//msgs.addError('Erro no GET email config! '+err)
				})
	
			}
			vm.getEmail()			
			//============================================================================================
			//Teste envio de email de e-mail
			//============================================================================================
			vm.responseEmailTesteOk = false
			vm.testeEmail = function(){
				vm.waitResponseEmailTeste = true
				vm.responseEmailTesteOk = false
				var objectJsonConfig = {
					email:{
						emailNome:vm.emailNome,
						emailServidor:vm.emailServidor,
						emailPorta:parseInt(vm.emailPorta),
						emailUsuario:vm.emailUsuario,
						emailSenha:vm.emailSenha,
						emailSeguro:vm.emailSeguro ? true : false 
					}
				}
					
				getsetmodbus.testeConfigEmail(objectJsonConfig).then(function(){
					msgs.addSuccess('E-mail enviado com sucesso para : '+objectJsonConfig.email.emailUsuario+' de '+objectJsonConfig.email.emailUsuario)
					vm.waitResponseEmailTeste = false
					vm.responseEmailTesteOk = true

				}).catch(function(err){
					vm.waitResponseEmailTeste = false
					vm.responseEmailTesteOk = false
					if(err.data.status=='sem internet'){
						msgs.addError('Não foi possível se conectar à internet!')
					}else{
						msgs.addError('Não foi possível validar as informações. Verifique os dados inseridos!')
					}
				})
			}
			//============================================================================================
			//Exporta aplicação
			//============================================================================================
			vm.exportApp = function(){
				vm.waitResponseDownload = true
				querysql.backupAppMySql('').then(function(response){
					msgs.addSuccess('Arquivo  de backup criado com sucesso')
					  $http({
					      url: `${url}backupAppMySqlDownload`,
					      method: "POST",
					      data: {
					        uri: ''//uri
					      },
					      responseType: 'blob'
					  }).then(function (response) {

					      var data = response.data;
					      var headers = response.headers;
					      var blob = new Blob([data], { type: 'text/plain' });
					      var fileName = `INPI-BackupApp-${moment().format('YYYYMMDDHHmmss')}.inpi`//headers('Content-Disposition');
					      saveAs(blob, fileName);

							  $http({
							      url: `${url}backupAppNodeRedDownload`,
							      method: "POST",
							      data: {
							        uri: ''//uri
							      },
							      responseType: 'blob'
							  }).then(function (response) {
							  	
							      var data = response.data;
							      var headers = response.headers;
							      var blob = new Blob([data], { type: 'text/plain' });
							      var fileName = `INPI-BackupAppNodeRed-${moment().format('YYYYMMDDHHmmss')}.nodr`//headers('Content-Disposition');
							      saveAs(blob, fileName);
							      vm.waitResponseDownload = false
							  }).catch(function (err) {
							    msgs.addError('Erro no download do arquivo de backup: '+err)
							    vm.waitResponseDownload = false
							  });


					      vm.waitResponseDownload = false
					  }).catch(function (err) {
					    msgs.addError('Erro no download do arquivo de backup: '+err)
					    vm.waitResponseDownload = false
					  });
				}).catch(function(err){
					msgs.addError('Erro na criação do arquivo de backup: '+err)
					vm.waitResponseDownload = false
				})
			}

		})//Finaliza get usuario

	}//Finaliza controller
	//------------------------------------
})()
