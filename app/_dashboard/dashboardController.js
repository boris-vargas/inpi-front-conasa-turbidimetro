
(function () {
	angular.module('intechApp').controller('DashController', [
		'$scope',
		'$http',
		'consts',
		'msgs',
		'$compile',
		'$interval',
		'$location',
		'lodash',
		'trocaDados',
		'querysql',
		'auth',
		'Upload',
		'$timeout',
		'$rootScope',
		'generalfunc',
		'$uibModal',
		'getsetmodbus',
		'$window',
		'Excel',
		'$state',
		'$q',
		DashController
	])

	function DashController($scope, $http, consts, msgs, $compile, $interval, $location, lodash, trocaDados, querysql, auth, Upload, $timeout, $rootScope, generalfunc, $uibModal, getsetmodbus, $window, Excel, $state, $q) {
		var vm = this;
		const url = trocaDados.getapiUrl()
		const registroModbusPorComponente = 2;
		var MENU_NAVEGACAO = 'Dashboard'
		const CONTROLLER = 'dashCtrl'
		const RETRY_MODBUS_COM = consts.retryModbusCom

		//============================================================================================
		//Outras variaveis
		//============================================================================================
		vm.componenteEscrita = new Array(256).fill(0)
		vm.componenteLeitura = new Array(256).fill(0)
		vm.componenteLeituraFcon = new Array(256).fill(0)
		vm.componenteLeituraFconCount = new Array(256).fill(0)
		vm.compChanging = new Array(256).fill(0)
		vm.countComponent = 0;
		vm.allcomponentesOffset = [{}]
		vm.counterCharts = 0
		vm.mainChart = []
		vm.mainAlarmes = []
		var UPDATE_COMP_MS = 2000
		var timerReqModbus
		var timerReqChart
		var indexComponenteTasks = 0
		var countComponentGeneral = 0
		var counterChartsObjects = 0
		var indexSetpointId, indexSetpointReg, indexSetpointValor, indexSetpointFator
		var indexDimmerId, indexDimmerReg, indexDimmerObj
		var indexFitaRGBId, indexFitaRGBReg, indexFitaRGBId1, indexFitaRGBReg1, indexFitaRGBId2, indexFitaRGBReg2, indexFitaRGBObj
		var counterAlmObjects = 0
		var counterDimmerObjects = 0
		var counterFitaRGBObjects = 0
		vm.alarmesCompData = []
		vm.menus = []
		vm.mainChartSelected = []

		//============================================================================================
		//Variaveis para componente dimmer
		//============================================================================================
		vm.dimmersComponent0 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' }, onChange: function () { } } };
		vm.dimmersComponent1 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent2 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent3 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent4 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent5 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent6 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent7 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent8 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent9 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent10 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent11 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent12 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent13 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent14 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent15 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent16 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent17 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent18 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };
		vm.dimmersComponent19 = { value: 2, options: { floor: 0, ceil: 100, step: 1, precision: 0, draggableRange: false, showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) { return value + '%' } } };

		vm.fitaRGBComponent0 = { color: 'rgb(128,128,128)' };
		vm.fitaRGBComponent1 = { color: '' };
		vm.fitaRGBComponent2 = { color: '' };
		vm.fitaRGBComponent3 = { color: '' };
		vm.fitaRGBComponent4 = { color: '' };
		vm.fitaRGBComponent5 = { color: '' };
		vm.fitaRGBComponent6 = { color: '' };
		vm.fitaRGBComponent7 = { color: '' };
		vm.fitaRGBComponent8 = { color: '' };
		vm.fitaRGBComponent9 = { color: '' };
		vm.fitaRGBComponent10 = { color: '' };
		vm.fitaRGBComponent11 = { color: '' };
		vm.fitaRGBComponent12 = { color: '' };
		vm.fitaRGBComponent13 = { color: '' };
		vm.fitaRGBComponent14 = { color: '' };
		vm.fitaRGBComponent15 = { color: '' };
		vm.fitaRGBComponent16 = { color: '' };
		vm.fitaRGBComponent17 = { color: '' };
		vm.fitaRGBComponent18 = { color: '' };
		vm.fitaRGBComponent19 = { color: '' };
		//============================================================================================
		//pega usuário logado
		//============================================================================================
		vm.getUser = function () {
			return auth.getUser()
		}
		//============================================================================================
		//Pega ID do sistema do usuário e faz todas as tarefas
		//============================================================================================
		auth.getInfoSistema().then(function (response) {
			var ID_SISTEMA_USER = response.data[0].id
			//============================================================================================
			//envia informações de qual viwew esta ativa
			//0=Dashboard
			//1=Menu1
			//2=Menu2
			//100=configura componentes
			//101=configura PLCpi
			//============================================================================================
			trocaDados.set(1, 0)
			//============================================================================================
			//Destroy scope na mudança de rota(pagina)
			//============================================================================================
			$scope.$on("$destroy", function () {
				if (timerReqModbus) {
					$interval.cancel(timerReqModbus)
				}
				if (timerReqChart) {
					$interval.cancel(timerReqChart)
				};
				if (getAlmsInterval) {
					$interval.cancel(getAlmsInterval)
				};
			})
			//============================================================================================
			//Atualiza componentes alarmes
			//============================================================================================
			var getAlmsInterval = $interval(function () {
				getAlmAllComp()

			}, 5000)
			//============================================================================================
			//Formata filtros gráficos
			//============================================================================================
			function fomartFilterChart(str) {
				var str_
				switch (str) {
					case 'ultima-hora':
						str_ = 'última hora'
						return str_
						break
					case 'ultimo-dia':
						str_ = 'último dia'
						return str_
						break
					case 'ultima-semana':
						str_ = 'última semana'
						return str_
						break
					case 'ultimo-mes':
						str_ = 'último mês'
						return str_
						break
					case 'ultimo-3-meses':
						str_ = 'últimos 3 meses'
						return str_
						break
					case 'ultimo-6-meses':
						str_ = 'últimos 6 meses'
						return str_
						break
					case 'ultimo-12-meses':
						str_ = 'último ano'
						return str_
						break
					default:
						str_ = 'sem seleção'
						return str_
				}
			}
			//============================================================================================
			//atualilza todos os objetos alarme
			//============================================================================================
			function getAlmAllComp() {
				for (var i = 0; i < vm.mainAlarmes.length; i++) {
					vm.getAlms(i, vm.mainAlarmes[i].parameters.modo, vm.mainAlarmes[i].parameters.datainicial, vm.mainAlarmes[i].parameters.datafinal, vm.mainAlarmes[i].parameters.filtermenu)
				}
			}
			//============================================================================================
			//atualilza todos os objetos alarme
			//============================================================================================
			vm.getAlms = function (index, modo, datainicial, datafinal, filtronavegacao) {
				var filtroRealTime = ` WHERE navegacao = '${filtronavegacao}'`
				var filtroHist = ` AND navegacao = '${filtronavegacao}'`

				if (filtronavegacao == 'Todos') {
					filtroRealTime = ''
					filtroHist = ''
				};
				if (modo == 'historico') {
					const cmdSql = `SELECT * FROM alarmes_historico WHERE data_ocorrido >= '${moment(datainicial).format('YYYY-MM-DD HH:mm:ss')}' AND
					data_ocorrido <='${moment(datafinal).format('YYYY-MM-DD HH:mm:ss')}' ${filtroHist} ORDER BY data_ocorrido DESC`
					querysql.queryGeral(cmdSql).then(function (response) {
						vm.alarmesCompData[index] = response.data
					})
				}
				else {
					querysql.queryGeral(`SELECT * FROM alarmes ${filtroRealTime} ORDER BY data_ocorrido DESC`).then(function (response) {
						vm.alarmesCompData[index] = response.data
					})
				}
			}
			//============================================================================================
			//Evento objeto chart (mouseover)
			//============================================================================================
			vm.eventsComChart = function (e) {
				vm.indexChart = parseInt(e.currentTarget.id.replace(/[^0-9]/g, ''))
				vm.indexChart -= 1
			}
			//============================================================================================
			//Evento objeto setpoint
			//============================================================================================
			vm.eventsComSetpoint = function (e) {
				vm.indexSetpoint = e.currentTarget.id
				indexSetpointId = parseInt(vm.indexSetpoint.split('-')[0])
				indexSetpointReg = parseInt(vm.indexSetpoint.split('-')[1])
				indexSetpointFator = parseFloat(vm.indexSetpoint.split('-')[2])
			}
			//============================================================================================
			//Evento objeto dimmer
			//============================================================================================
			vm.eventsComDimmer = function (e) {
				vm.indexDimmer = e.currentTarget.id
				indexDimmerId = parseInt(vm.indexDimmer.split('-')[0])
				indexDimmerReg = parseInt(vm.indexDimmer.split('-')[1])
				indexDimmerObj = parseInt(vm.indexDimmer.split('-')[2])
			}

			//============================================================================================
			//Evento objeto dimmer (slider change-end)
			//============================================================================================
			$scope.$on('slideEnded', function () {
				vm.writeModbusValue(indexDimmerId, indexDimmerReg, eval(`vm.dimmersComponent${indexDimmerObj}`).value * 100)
				eval(`vm.dimmersComponent${indexDimmerObj}`).oldValue = eval(`vm.dimmersComponent${indexDimmerObj}`).value
				//eval(`vm.dimmersComponent${indexDimmerObj}`).opacity = ((vm.dimmersComponent0.value-0) * (100-30) / (100-0) + 20) / 100
				const cmdSql = `UPDATE config_compontes SET ultimo_valor='${eval(`vm.dimmersComponent${indexDimmerObj}`).oldValue}' WHERE id='${eval(`vm.dimmersComponent${indexDimmerObj}`).idBanco}'`
				querysql.queryMysqlInsertPost(cmdSql).then(function (response) {

				}).catch(function () {
					msgs.addError('Erro na atualização')
				})

			})
			//============================================================================================
			//Extrai cores RGB
			//============================================================================================
			function getRGB(str) {
				var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
				return match ? {
					red: match[1],
					green: match[2],
					blue: match[3]
				} : {};
			}
			//============================================================================================
			//On-click paleta de cores do obejto RGB
			//============================================================================================
			$scope.$on('colorpicker-selected', function (event, colorObject) {
				vm.writeModbusValue(indexFitaRGBId, indexFitaRGBReg, (getRGB(colorObject.value).red * 10000 / 255))
				vm.writeModbusValue(indexFitaRGBId1, indexFitaRGBReg1, (getRGB(colorObject.value).green * 10000 / 255))
				vm.writeModbusValue(indexFitaRGBId2, indexFitaRGBReg2, (getRGB(colorObject.value).blue * 10000 / 255))
				eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).ultimo_valor_r = Math.round(getRGB(colorObject.value).red * 10000 / 255)
				eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).ultimo_valor_g = Math.round(getRGB(colorObject.value).green * 10000 / 255)
				eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).ultimo_valor_b = Math.round(getRGB(colorObject.value).blue * 10000 / 255)
				const cmdSql = `UPDATE config_compontes SET ultimo_valor_r='${Math.round(getRGB(colorObject.value).red * 10000 / 255)}', 
				ultimo_valor_g='${Math.round(getRGB(colorObject.value).green * 10000 / 255)}',
				ultimo_valor_b='${Math.round(getRGB(colorObject.value).blue * 10000 / 255)}',
				ultimo_valor_rgb='${colorObject.value}'
				WHERE id='${eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).idBanco}'`
				querysql.queryMysqlInsertPost(cmdSql).then(function (response) {

				}).catch(function () {
					msgs.addError('Erro na atualização')
				})


			});
			//============================================================================================
			//Evento objeto fita RGB
			//============================================================================================
			vm.eventsComFitaRGB = function (e) {
				vm.indexFitaRGB = e.currentTarget.id
				indexFitaRGBId = parseInt(vm.indexFitaRGB.split('-')[0])
				indexFitaRGBReg = parseInt(vm.indexFitaRGB.split('-')[1])
				indexFitaRGBId1 = parseInt(vm.indexFitaRGB.split('-')[2])
				indexFitaRGBReg1 = parseInt(vm.indexFitaRGB.split('-')[3])
				indexFitaRGBId2 = parseInt(vm.indexFitaRGB.split('-')[4])
				indexFitaRGBReg2 = parseInt(vm.indexFitaRGB.split('-')[5])
				indexFitaRGBObj = parseInt(vm.indexFitaRGB.split('-')[6])
			}
			//============================================================================================
			//Evento objeto fita LED (Click)
			//============================================================================================
			vm.dimmerValueSetFitaLed = function () {
				if (eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).value == 0) {
					eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).value = 1
					vm.writeModbusValue(indexFitaRGBId, indexFitaRGBReg, eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).ultimo_valor_r)
					vm.writeModbusValue(indexFitaRGBId1, indexFitaRGBReg1, eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).ultimo_valor_g)
					vm.writeModbusValue(indexFitaRGBId2, indexFitaRGBReg2, eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).ultimo_valor_b)
				} else {
					eval(`vm.fitaRGBComponent${indexFitaRGBObj}`).value = 0
					vm.writeModbusValue(indexFitaRGBId, indexFitaRGBReg, 0)
					vm.writeModbusValue(indexFitaRGBId1, indexFitaRGBReg1, 0)
					vm.writeModbusValue(indexFitaRGBId2, indexFitaRGBReg2, 0)
				}

			}
			//============================================================================================
			//Evento objeto dimmer (Click)
			//============================================================================================
			vm.dimmerValueSet = function () {
				if (eval(`vm.dimmersComponent${indexDimmerObj}`).value == 0) {
					eval(`vm.dimmersComponent${indexDimmerObj}`).value = eval(`vm.dimmersComponent${indexDimmerObj}`).oldValue
				} else {
					eval(`vm.dimmersComponent${indexDimmerObj}`).value = 0
				}
				vm.writeModbusValue(indexDimmerId, indexDimmerReg, eval(`vm.dimmersComponent${indexDimmerObj}`).value * 100)
			}
			//============================================================================================
			//Evento objeto alarmes
			//============================================================================================
			vm.eventsComAlarmes = function (e) {
				vm.idAlarme = e.currentTarget.id
				vm.indexAlarme = parseInt(vm.idAlarme.split('-')[0])
				vm.countAlarme = (parseInt(vm.idAlarme.split('-')[1])) / 2
				vm.countAlarmeData = (parseInt(vm.idAlarme.split('-')[2])) - 1
			}
			//============================================================================================
			//Abre modal de escrita novo valor componente Setpoint
			//============================================================================================
			vm.openModalSetpoint = function (size, parentSelector, dadoClick) {
				getsetmodbus.readModbusRegPost(indexSetpointId, indexSetpointReg, 1).then(function (response) {
					indexSetpointValor = response.payload[0]
					var modalInstance = $uibModal.open({
						templateUrl: '/_dashboard/popAlteraValor.html',
						controller: 'popAlteraValorController',
						controllerAs: $scope,
						size: size,
						resolve: {
							id: function () { return indexSetpointId },
							reg: function () { return indexSetpointReg },
							valor: function () { return indexSetpointValor },
							fator: function () { return indexSetpointFator }
						}
					});
					modalInstance.result.then(function (response) {
						if (response) {
							vm.writeModbusValue(response.id, response.reg, response.valor)
						}
					})
				}).catch(function (err) {
					console.log(err)
				})
			}
			//============================================================================================
			//Abre modal de escrita novo valor componente Setpoint
			//============================================================================================
			vm.openModalAlarmes = function (size, parentSelector, dadoClick) {
				if (!vm.objetosDinamicos[vm.countAlarme].parameters.datainicial) {
					vm.objetosDinamicos[vm.countAlarme].parameters.datainicial = ''
				};
				if (!vm.objetosDinamicos[vm.countAlarme].parameters.datafinal) {
					vm.objetosDinamicos[vm.countAlarme].parameters.datafinal = ''
				};

				if (vm.objetosDinamicos[vm.countAlarme].parameters.datainicial.length < 24) {
					vm.objetosDinamicos[vm.countAlarme].parameters.datainicial = moment()
				}
				if (vm.objetosDinamicos[vm.countAlarme].parameters.datafinal.length < 24) {
					vm.objetosDinamicos[vm.countAlarme].parameters.datafinal = moment()
				}
				var modalInstance = $uibModal.open({
					templateUrl: '/_dashboard/popConfigAlm.html',
					controller: 'popConfigAlmController',
					controllerAs: $scope,
					size: size,
					resolve: {
						id: function () { return vm.almIdComp },
						modo: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.modo },
						datainicial: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.datainicial },
						datafinal: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.datafinal },
						indexAlarme: function () { return vm.indexAlarme },
						viewmenu: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.viewmenu },
						viewequipamento: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.viewequipamento },
						viewduracao: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.viewduracao },
						viewacao: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.viewacao },
						viewvalor: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.viewvalor },
						filtermenu: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.filtermenu },
						filterequipamento: function () { return vm.objetosDinamicos[vm.countAlarme].parameters.filterequipamento },
						menus: function () { return vm.menus }
					}
				});
				modalInstance.result.then(function (response) {
					if (response) {
						vm.objetosDinamicos[vm.countAlarme].parameters.modo = response.modo
						vm.objetosDinamicos[vm.countAlarme].parameters.datainicial = response.datainicial
						vm.objetosDinamicos[vm.countAlarme].parameters.datafinal = response.datafinal
						vm.objetosDinamicos[vm.countAlarme].parameters.viewmenu = response.viewmenu
						vm.objetosDinamicos[vm.countAlarme].parameters.viewequipamento = response.viewequipamento
						vm.objetosDinamicos[vm.countAlarme].parameters.viewduracao = response.viewduracao
						vm.objetosDinamicos[vm.countAlarme].parameters.viewacao = response.viewacao
						vm.objetosDinamicos[vm.countAlarme].parameters.viewvalor = response.viewvalor
						vm.objetosDinamicos[vm.countAlarme].parameters.filtermenu = response.filtermenu
						vm.objetosDinamicos[vm.countAlarme].parameters.filterequipamento = response.filterequipamento
						var configAlarmes = {
							modo: response.modo,
							datainicial: response.datainicial,
							datafinal: response.datafinal,
							viewmenu: response.viewmenu,
							viewequipamento: response.viewequipamento,
							viewduracao: response.viewduracao,
							viewacao: response.viewacao,
							viewvalor: response.viewvalor,
							filtermenu: response.filtermenu,
							filterequipamento: response.filterequipamento
						}
						const cmdSql = "UPDATE config_compontes SET " +
							"parameters='" + JSON.stringify(configAlarmes) + "' " +
							"WHERE id = '" + response.indexAlarme + "'"
						querysql.queryMysqlInsertPost(cmdSql).then(function () {
							msgs.addSuccess('Registro atualizado! :)')
						}).catch(function () {
							msgs.addError('Erro na atualização')
						})
						getAlmAllComp()
					}
				})
			}
			//============================================================================================
			//Abre modal de escrita novo valor componente chart
			//============================================================================================
			vm.openModalChart = function (size, parentSelector, dadoClick) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_dashboard/popConfigChart.html',
					controller: 'popConfigChartController',
					controllerAs: $scope,
					size: size,
					resolve: {
						objeto: function () { return vm.mainChartSelected[vm.indexChart] }
					}
				});
				modalInstance.result.then(function (response) {
					if (response) {
						var tDadosChart = []
						for (var i = 0; i < (response.objeto.bke_tasks.optionsChart.config.series.length - 1); i++) {
							tDadosChart.push(generalfunc.ramdomArray())
						}
						response.objeto.bke_tasks.dataChart = tDadosChart
						response.objeto.bke_tasks.labelsChart = ["ponto 1", "ponto 2", "ponto 3", "ponto 4", "ponto 5", "ponto 6", "ponto 7", "ponto 8", "ponto 9", "ponto 10", "ponto 11", "ponto 12", "ponto 13"]

						const cmdSql = "UPDATE config_compontes SET " +
							"bke_tasks='" + JSON.stringify(response.objeto.bke_tasks) + "' " +
							",parameters='" + JSON.stringify(response.objeto.parameters) + "' " +

							"WHERE id = '" + response.objeto.id + "'"
						querysql.queryMysqlNewComp(cmdSql, '').then(function (response) {
							if (response.data.affectedRows == 1) {
								msgs.addSuccess('Registro atualizado')
								$state.reload();
							} else if (response.data.affectedRows == 0) {
								msgs.addError('O registro nao sofreu nenhuma alteração')
							}
							else {
								msgs.addError('Falha na gravação no banco! ' + response.data.sqlMessage)
							}
						})
					}
				})
			}
			//============================================================================================
			//Ajusta dados recebidos da consulta
			//============================================================================================
			function adjustSeries(data) {
				var series = []
				for (var i = 0; i < data.length; i++) {
					series[i] = data[i].valor
				}
				return series
			}
			//============================================================================================
			//Atualiza Charts
			//============================================================================================
			function updateCharts() {
				for (var i = 0; i < vm.mainChart.length; i++) {
					for (var j = 0; j < vm.mainChart[i].optionsChart.config.series.length - 1; j++) {
						queryDadosSeries(i, `log_${vm.mainChart[i].optionsChart.config.series[j].nome.id}`, j)
					}
				}
			}
			//============================================================================================
			//Ajusta dados recebidos da consulta
			//============================================================================================
			function queryDadosSeries(mainIndex, table, seriesIndex) {
				var dateDiff
				var dateNow
				if (vm.mainChartSelected[mainIndex].parameters.modo == 'config') {
					dateDiff = generalfunc.adjustPeriod(vm.mainChartSelected[mainIndex].parameters.periodo)
					dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
				}

				if (vm.mainChartSelected[mainIndex].parameters.modo == 'query') {
					dateDiff = moment(vm.mainChartSelected[mainIndex].parameters.dataInicial).format('YYYY-MM-DD HH:mm:ss')
					dateNow = moment(vm.mainChartSelected[mainIndex].parameters.dataFinal).format('YYYY-MM-DD HH:mm:ss')
				}


				const cmdSql = `SELECT timestamp,valor FROM ${table} WHERE timestamp>='${dateDiff}' AND timestamp<='${dateNow}' GROUP BY round(UNIX_TIMESTAMP(timestamp)/${vm.mainChartSelected[mainIndex].parameters.resolucao}) ORDER BY timestamp`
				querysql.queryMysqlLog(cmdSql).then(function (result) {
					vm.mainChart[mainIndex].dataChart[seriesIndex] = adjustSeries(result.data)
					vm.mainChart[mainIndex].labelsChart = generalfunc.adjustLabel(result.data, vm.mainChartSelected[mainIndex].parameters.resolucao)
				}).catch(function () {
				})
			}
			//============================================================================================
			//Lista todos os componentes do sistema
			//============================================================================================
			querysql.queryComponentes(ID_SISTEMA_USER).then(function (response) {
				vm.allComponentes = response.data
				vm.allComponentes.push({ tipo: 'generico', descricao: 'generico' })

				for (var i = 0; i < vm.allComponentes.length - 1; i++) {
					if (vm.allComponentes) {
						if (vm.allComponentes[i].bke_tasks) {
							if (typeof vm.allComponentes[i].bke_tasks == "string") {
								vm.allComponentes[i].bke_tasks = JSON.parse(vm.allComponentes[i].bke_tasks)
							}
						}
					}
				}
			})
			//============================================================================================
			//Componentes tasks funcões objeto dinamico
			//============================================================================================
			vm.addhoraliga = function (index) {
				vm.allcomponentesOffset[vm.indexTasks].bke_tasks.horaLiga.splice(index + 1, 0, { hora: 1524970800000, diaSemana: [true, true, true, true, true, true, true] })
			}
			vm.deletehoraliga = function (index) {
				if (vm.allcomponentesOffset[vm.indexTasks].bke_tasks.horaLiga.length > 1) {
					vm.allcomponentesOffset[vm.indexTasks].bke_tasks.horaLiga.splice(index, 1)
				}
			}
			vm.addhoraligaregistro = function (index) {
				vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn.splice(index + 1, 0, { id: 0, reg: 0, valor: 0 })
			}
			vm.deletehoraligaregistro = function (index) {
				if (vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn.length > 1) {
					vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn.splice(index, 1)
				}
			}
			vm.addhoradesliga = function (index) {
				vm.allcomponentesOffset[vm.indexTasks].bke_tasks.horaDesliga.splice(index + 1, 0, { hora: 1524970800000, diaSemana: [true, true, true, true, true, true, true] })
			}
			vm.deletehoradesliga = function (index) {
				if (vm.allcomponentesOffset[vm.indexTasks].bke_tasks.horaDesliga.length > 1) {
					vm.allcomponentesOffset[vm.indexTasks].bke_tasks.horaDesliga.splice(index, 1)
				}
			}
			vm.addhoradesligaregistro = function (index) {
				vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff.splice(index + 1, 0, { id: 0, reg: 0, valor: 0 })
			}
			vm.deletehoradesligaregistro = function (index) {
				if (vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff.length > 1) {
					vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff.splice(index, 1)
				}
			}
			//============================================================================================
			//COnfirma alterações no objeto tasks
			//============================================================================================
			vm.confirmaedicao = function () {

				for (var i = 0; i < vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn.length; i++) {
					if (typeof vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn[i].selectObj != 'undefined')
						if (typeof vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn[i].selectObj.bke_alarmes != 'object') {
							vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn[i].selectObj.bke_alarmes = {}//JSON.parse(vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOn[i].selectObj.bke_alarmes)
						}
				}
				for (var i = 0; i < vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff.length; i++) {
					if (typeof vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff[i].selectObj != 'undefined')
						if (typeof vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff[i].selectObj.bke_alarmes != 'object') {
							vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff[i].selectObj.bke_alarmes = {}//JSON.parse(vm.allcomponentesOffset[vm.indexTasks].bke_tasks.tagsWriteOff[i].selectObj.bke_alarmes)
						}
				}

				const cmdSql = "UPDATE config_compontes SET " +
					"bke_tasks='" + JSON.stringify(vm.allcomponentesOffset[vm.indexTasks].bke_tasks) + "' " +
					"WHERE id = '" + vm.allcomponentesOffset[vm.indexTasks].id + "'"
				querysql.queryMysqlInsertPost(cmdSql).then(function () {
					msgs.addSuccess('Registro atualizado! :)')
				}).catch(function () {
					msgs.addError('Erro na atualização')
				})
			}
			//============================================================================================
			//Evento click dos objetos
			//============================================================================================
			vm.eventsCom = function (e) {
				vm.indexTasks = e.currentTarget.id
			}
			//============================================================================================
			//Realiza get no Server
			//============================================================================================
			vm.readModbus = function (indexVar, count) {
				getsetmodbus.readModbusRegPost(vm.objetosDinamicosFilaReqLeitura[indexVar].idMb, vm.objetosDinamicosFilaReqLeitura[indexVar].regMb, 2).then(function (response) {
					vm.componenteLeitura[(indexVar * registroModbusPorComponente) + 0] = response.payload[0]
					vm.componenteLeitura[(indexVar * registroModbusPorComponente) + 1] = response.payload[1]
					vm.compChanging[count] = 0
					vm.componenteLeituraFconCount[(indexVar * registroModbusPorComponente) + 0] = 0
					vm.componenteLeituraFcon[(indexVar * registroModbusPorComponente) + 0] = 0
				}).catch(function (response) {
					vm.componenteLeituraFconCount[(indexVar * registroModbusPorComponente) + 0]++
					if (vm.componenteLeituraFconCount[(indexVar * registroModbusPorComponente) + 0] >= RETRY_MODBUS_COM) {
						vm.componenteLeituraFcon[(indexVar * registroModbusPorComponente) + 0] = 1
						response.endereco = vm.objetosDinamicosFilaReqLeitura[indexVar].idMb
					}
				})
			}
			//============================================================================================
			//Leitura dos registros modbus
			//============================================================================================
			function readModbusFunc() {
				var sizeObject = lodash.size(vm.objetosDinamicosFilaReqLeitura);
				for (var i = 0; i < sizeObject; i++) {
					vm.readModbus(i, vm.objetosDinamicosFilaReqLeitura[i].count)
				}
			}
			//============================================================================================
			//Escrita nos registro modbus
			//============================================================================================
			vm.writeModbus = function (varState, index, id, count) {
				var varStateTemp = varState
				if (varState == 1) { varStateTemp = 0 } else { varStateTemp = 1 }
				vm.compChanging[count] = 1
				getsetmodbus.writeModbusRegPost(id, index, varStateTemp).then(function (response) {
				})
			}
			//============================================================================================
			//Escrita nos registro modbus valores
			//============================================================================================
			vm.writeModbusValue = function (id, reg, valor) {
				getsetmodbus.writeModbusRegPost(id, reg, valor).then(function (response) {
				})
			}
			//============================================================================================
			//monta objeto com componentes dinamicamente (reset)
			//============================================================================================
			vm.objetosDinamicosReset = function () {
				vm.objetosDinamicos = {
					length: 0,
					addElem: function addElem(elem) {
						[].push.call(this, elem);
					},
				}
			}
			//============================================================================================
			//monta objeto com componentes dinamicamente (reset)
			//============================================================================================
			vm.objetosDinamicosFilaReset = function () {
				vm.objetosDinamicosFilaReqLeitura = {
					length: 0,
					addElem: function addElem(elem) {
						[].push.call(this, elem);
					},
				}
			}
			//============================================================================================
			//Adiciona objeto em tela
			//============================================================================================
			vm.adicionarObjHtml = function (type, count, area, idModbusWrite, regModbusWrite, varModbusRead, varChanging, varAct, varFalha, unidade, menuNavegacao,
				nivelmin, nivelmax, nivelbaixo, nivelalto, fator, bke_tasks, indexComponenteTasks, allComponentes, visivel, icoon, icooff, imagesize, imagetop, counterChartsObjects,
				compId, counterAlmObjects, counterDimmerObjects, cornormal, corbaixo, coralto, tamanho, idModbusWrite1, regModbusWrite1, idModbusWrite2, regModbusWrite2, fonte_display) {
				const modelo_luz_incand = `
				<luz-incand id= luz_incand${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" acesso="${CONTROLLER}.getUser().acesso"
				></luz-incand>
				`
				const modelo_display = `
				<display titulo="${area}" unidade ="${unidade}" dispclique="" valor="${varModbusRead}" fator="${fator}" falha="${varFalha}" fonte="${fonte_display}"
				texttop="${imagetop}"></display>
				`
				const modelo_indica_led = `
				<indica-led id= indicaledobj${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" icoon="${icoon}" icooff="${icooff}" imagesize="${imagesize}" imagetop="${imagetop}"
				icorefresh="refresh-tr.png" acesso="${CONTROLLER}.getUser().acesso"
				></indica-led>
				`
				const modelo_irrigacao = `
				<irrigacao id= irriga${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" acesso="${CONTROLLER}.getUser().acesso"
				></irrigacao>
				`
				const modelo_display_bar = `
				<display-bar id="irriga${count}" titulo="${area}" unidade="${unidade}" valorlabel="${varModbusRead}" valor="${varModbusRead}  | scalegauge:${nivelmax}:${nivelmin}" fator="${fator}" falha="${varFalha}"
				nivelmin="${nivelmin}" nivelmax="${nivelmax}" nivelbaixo="${nivelbaixo}" nivelalto="${nivelalto}" cornormal="'green'" corbaixo="'red'" coralto="'red'" 
				>
				</display-bar>
				`

				// <display-bar id="irriga${count}" titulo="${area}" unidade="${unidade}" valorlabel="${varModbusRead}" valor="${varModbusRead}  | scalegauge:${nivelmax}:${nivelmin}" fator="${fator}" falha="${varFalha}"
				// nivelmin="${nivelmin}" nivelmax="${nivelmax}" nivelbaixo="${nivelbaixo}" nivelalto="${nivelalto}" cornormal="${cornormal}" corbaixo="${corbaixo}" coralto="${coralto}" 
				// >
				// </display-bar>



				const modelo_display_gauge = `
				<display-gauge titulo="${area}" unidade="${unidade}" valor="${varModbusRead}" fator="${fator}"
				nivelmin="${nivelmin}" nivelmax="${nivelmax}" gatilho="{'0': {color: 'red'},'${nivelbaixo}': {color: 'green'},'${nivelalto}': {color: 'red'}}" falha="${varFalha}" nivelbaixo="${nivelbaixo}" nivelalto="${nivelalto}">
				</display-gauge>
				`
				const modelo_botao = `
				<botao-obj id= botaoobj${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" icoon="${icoon}" icooff="${icooff}" imagesize="${imagesize}" imagetop="${imagetop}"
				icorefresh="refresh-tr.png" acesso="${CONTROLLER}.getUser().acesso"
				></botao-obj>
				`
				const modelo_task_horario = `
				<task-timerobj ng-click="${CONTROLLER}.eventsCom($event)" id="${indexComponenteTasks}" titulo="${area}" dados="${bke_tasks}" allcomponentes="${allComponentes}"
				changeselectcomp='${CONTROLLER}.changeTagLigaTaskCompNew()' addhoraliga="${CONTROLLER}.addhoraliga($index)"
				deletehoraliga="${CONTROLLER}.deletehoraliga($index)"	addhoraligaregistro="${CONTROLLER}.addhoraligaregistro($index)"
				deletehoraligaregistro="${CONTROLLER}.deletehoraligaregistro($index)"	addhoradesliga="${CONTROLLER}.addhoradesliga($index)"
				deletehoradesliga="${CONTROLLER}.deletehoradesliga($index)"	addhoradesligaregistro="${CONTROLLER}.addhoradesligaregistro($index)"
				deletehoradesligaregistro="${CONTROLLER}.deletehoradesligaregistro($index)" confirmaedicao="${CONTROLLER}.confirmaedicao()"
				acesso="${CONTROLLER}.getUser().acesso"
				></task-timerobj>
				`
				const modelo_chart = `
				<chart ng-mouseenter="${CONTROLLER}.eventsComChart($event)" id= chartobj${counterChartsObjects} titulo="${area}" datachart="${CONTROLLER}.mainChart[${vm.counterCharts}].dataChart"
				labelschart="${CONTROLLER}.mainChart[${vm.counterCharts}].labelsChart" largura="${CONTROLLER}.mainChart[${vm.counterCharts}].optionsChart.width"
				optionschart="${CONTROLLER}.mainChart[${vm.counterCharts}].optionsChart" overridechart="${CONTROLLER}.mainChart[${vm.counterCharts}].overrideChart"
				heightchart="${CONTROLLER}.mainChart[${vm.counterCharts}].optionsChart.heigth" acesso="${CONTROLLER}.getUser().acesso"
				dowloadclick="${CONTROLLER}.exportToPdf('chartobjexp${counterChartsObjects}')" idtoexportpdf="chartobjexp${counterChartsObjects}" dispclique="${CONTROLLER}.openModalChart('sm', '.modal-parent', '13')"
				></chart>
				`
				const modelo_setpoint = `
				<setpoint ng-mouseenter="${CONTROLLER}.eventsComSetpoint($event)" id="${idModbusWrite}-${regModbusWrite}-${fator}" titulo="${area}"
				valor="${varModbusRead}" valorsetpoint="${varModbusRead}" unidade ="${unidade}" acesso="${CONTROLLER}.getUser().acesso"
				dispclique="${CONTROLLER}.openModalSetpoint('sm', '.modal-parent', '13')" fator="${fator}" falha="${varFalha}" fonte="${fonte_display}"
				texttop="${imagetop}">
				</setpoint>
				`
				const modelo_alarme = `
				<alarmes-comp ng-mouseenter="${CONTROLLER}.eventsComAlarmes($event)" id="${compId}-${count}-${counterAlmObjects}" titulo="${area}" acesso="${CONTROLLER}.getUser().acesso"
				alarmes="${CONTROLLER}.alarmesCompData[${counterAlmObjects - 1}]" dispclique="${CONTROLLER}.openModalAlarmes('sm', '.modal-parent', '13')"
				modo="${CONTROLLER}.objetosDinamicos[${count / 2}].parameters.modo" parameters="${CONTROLLER}.objetosDinamicos[${count / 2}].parameters"
				dowloadclick="${CONTROLLER}.xlsExportAlm()"
				dowloadclickpdf="${CONTROLLER}.exportToPdfAlms('alm${compId}-${count}-${counterAlmObjects}')" idtoexportpdf="alm${compId}-${count}-${counterAlmObjects}"
				> </alarmes-comp>
				`

				const modelo_dimmer = `
				<botao-dimmer ng-mouseenter="${CONTROLLER}.eventsComDimmer($event)" id="${idModbusWrite}-${regModbusWrite}-${counterDimmerObjects - 1}" titulo="${area}" state="${varModbusRead}" dimmerobject="${CONTROLLER}.dimmersComponent${counterDimmerObjects - 1}"
				write="${CONTROLLER}.dimmerValueSet()"
				changing = "${varChanging}" falha="${varFalha}" icoon="${icoon}" icooff="${icooff}" imagesize="${imagesize}" imagetop="${imagetop}"
				icorefresh="refresh-tr.png" acesso="${CONTROLLER}.getUser().acesso"
				></botao-dimmer>
				`
				const fita_RGB = `
				<fita-rgb ng-mouseenter="${CONTROLLER}.eventsComFitaRGB($event)" id="${idModbusWrite}-${regModbusWrite}-${idModbusWrite1}-${regModbusWrite1}-${idModbusWrite2}-${regModbusWrite2}-${counterFitaRGBObjects - 1}" titulo="${area}" state="${varModbusRead}" fitargbobject="${CONTROLLER}.fitaRGBComponent${counterFitaRGBObjects - 1}"
				write="${CONTROLLER}.dimmerValueSetFitaLed()"
				changing = "${varChanging}" falha="${varFalha}" icoon="${icoon}" icooff="${icooff}" imagesize="${imagesize}" imagetop="${imagetop}"
				icorefresh="refresh-tr.png" acesso="${CONTROLLER}.getUser().acesso"
				></fita-rgb>
				`
				const modelo_img = `
				<img-obj titulo="${area}" img="${icoon}" imagesize="${imagesize}" imagetop="${imagetop}" largura="${tamanho}"></img-obj>
				`

				const siloA = `<silos-a titulo="${area}" valor="{{${varModbusRead}}}" unidade="${unidade}" mmin="${nivelmin}" min="${nivelbaixo}" max="${nivelalto}" mmax="${nivelmax}"></silos-a>`

				const siloB = `<silos-b titulo="${area}" valor="{{${varModbusRead}}}" unidade="${unidade}" mmin="${nivelmin}" min="${nivelbaixo}" max="${nivelalto}" mmax="${nivelmax}"></silos-b>`

				var modelo
				if (type == 'luz-incand') { modelo = modelo_luz_incand }
				if (type == 'display') { modelo = modelo_display }
				if (type == 'indica-led') { modelo = modelo_indica_led }
				if (type == 'irrigacao') { modelo = modelo_irrigacao }
				if (type == 'display-bar') { modelo = modelo_display_bar }
				if (type == 'display-gauge') { modelo = modelo_display_gauge }
				if (type == 'botao-obj') { modelo = modelo_botao }
				if (type == 'task-horario') { modelo = modelo_task_horario }
				if (type == 'chart') { modelo = modelo_chart; vm.counterCharts++ }
				if (type == 'setpoint') { modelo = modelo_setpoint; }
				if (type == 'alarme') { modelo = modelo_alarme; }
				if (type == 'dimmer') { modelo = modelo_dimmer; }
				if (type == 'imagem-estatica') { modelo = modelo_img; }
				if (type == 'fita-rgb') { modelo = fita_RGB; }
				if (type == 'silo-a') { modelo = siloA }
				if (type == 'silo-b') { modelo = siloB }
				if (menuNavegacao == MENU_NAVEGACAO && visivel == '1') {
					angular.element(document.getElementById('objetoDinamicoHtml')).append($compile(modelo)($scope));
				}
			}
			//============================================================================================
			//Parametros de configuração dos sistemas
			//============================================================================================
			vm.querySistema = function (id) {
				const cmdSql = "SELECT * FROM config_sistema WHERE id= '" + id + "' ORDER BY nome DESC"
				querysql.queryMysqlGetPost(cmdSql).then(function (response) {
					vm.sistemas = (response.data)
					//============================================================================================
					//no caso de inserir outro menu adicionar aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//============================================================================================
					MENU_NAVEGACAO = 'Dashboard'
					//============================================================================================
					//no caso de inserir outro menu adicionar aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					//============================================================================================
					vm.menus.push({ id: 'Todos' })
					vm.menus.push({ id: 'Dashboard' })
					if (vm.sistemas[0].menu2_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu2_nome }) }
					if (vm.sistemas[0].menu3_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu3_nome }) }
					if (vm.sistemas[0].menu4_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu4_nome }) }
					if (vm.sistemas[0].menu5_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu5_nome }) }
					if (vm.sistemas[0].menu6_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu6_nome }) }
					if (vm.sistemas[0].menu7_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu7_nome }) }
					if (vm.sistemas[0].menu8_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu8_nome }) }
					if (vm.sistemas[0].menu9_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu9_nome }) }
					if (vm.sistemas[0].menu10_nome.length > 2) { vm.menus.push({ id: vm.sistemas[0].menu10_nome }) }
					vm.queryAllcompomentes(ID_SISTEMA_USER)
					//============================================================================================
					//Atualiza compoente chart - COMPONENTE CHART
					//============================================================================================
					timerReqChart = $interval(function () {
						updateCharts()
					}, ((vm.sistemas[0].update_charts > 5) ? vm.sistemas[0].update_charts * 1000 : 5000))

				})
			}
			//============================================================================================
			//Lista todos os componentes
			//============================================================================================
			vm.queryAllcompomentes = function (idSistema) {
				const cmdSql = "SELECT * FROM config_compontes WHERE id_sistema = " + idSistema + " AND menu_navegacao = '" + MENU_NAVEGACAO + "' ORDER BY sequencia ASC"
				querysql.queryMysqlGetPost(cmdSql).then(function (response) {
					vm.componentes = (response.data)
					UPDATE_COMP_MS = vm.sistemas[0].tempo_update_comp == 0 ? vm.componentes.length * consts.tempoCommPorComp : vm.sistemas[0].tempo_update_comp * 1000
					timerReqModbus = $interval(readModbusFunc, UPDATE_COMP_MS)
					for (var i = 0; i < vm.componentes.length; i++) {
						vm.objetosDinamicos.addElem({
							tipo: vm.componentes[i].tipo,
							id: vm.componentes[i].id,
							descricao: vm.componentes[i].descricao,
							tipo: vm.componentes[i].tipo,
							device_modbus_write_id: vm.componentes[i].device_modbus_write_id,
							device_modbus_write_reg: vm.componentes[i].device_modbus_write_reg,
							device_modbus_write_id_1: vm.componentes[i].device_modbus_write_id_1,
							device_modbus_write_reg_1: vm.componentes[i].device_modbus_write_reg_1,
							device_modbus_write_id_2: vm.componentes[i].device_modbus_write_id_2,
							device_modbus_write_reg_2: vm.componentes[i].device_modbus_write_reg_2,
							device_modbus_read_id: vm.componentes[i].device_modbus_read_id,
							device_modbus_read_reg: vm.componentes[i].device_modbus_read_reg,
							unidade_medida: vm.componentes[i].unidade_medida,
							modulo_plcpi: vm.componentes[i].modulo_plcpi,
							menu_navegacao: vm.componentes[i].menu_navegacao,
							nivel_min: vm.componentes[i].nivel_min,
							nivel_max: vm.componentes[i].nivel_max,
							nivel_alto: vm.componentes[i].nivel_alto,
							nivel_baixo: vm.componentes[i].nivel_baixo,
							fator: parseFloat(vm.componentes[i].fator),
							bke_tasks: JSON.parse(vm.componentes[i].bke_tasks),
							visivel: vm.componentes[i].visivel,
							icoon: vm.componentes[i].icoon,
							icooff: vm.componentes[i].icooff,
							imagesize: vm.componentes[i].imagesize,
							imagetop: vm.componentes[i].imagetop,
							parameters: JSON.parse(vm.componentes[i].parameters),
							ultimo_valor: vm.componentes[i].ultimo_valor,
							ultimo_valor_r: vm.componentes[i].ultimo_valor_r,
							ultimo_valor_g: vm.componentes[i].ultimo_valor_g,
							ultimo_valor_b: vm.componentes[i].ultimo_valor_b,
							ultimo_valor_rgb: vm.componentes[i].ultimo_valor_rgb,
							cor_normal: vm.componentes[i].cor_normal,
							cor_baixo: vm.componentes[i].cor_baixo,
							cor_alto: vm.componentes[i].cor_alto,
							tamanho: vm.componentes[i].tamanho,
							font_size: vm.componentes[i].font_size
						})
						indexComponenteTasks = vm.componentes[i].id
						vm.allcomponentesOffset[indexComponenteTasks] = vm.componentes[i]
						vm.allcomponentesOffset[indexComponenteTasks].bke_tasks = JSON.parse(vm.allcomponentesOffset[indexComponenteTasks].bke_tasks)
						//============================================================================================
						//Cria lista para requisição dinamica Modbus
						//============================================================================================
						vm.objetosDinamicosFilaReqLeitura.addElem({
							tipo: vm.componentes[i].tipo,
							count: vm.countComponent,
							idMb: vm.componentes[i].device_modbus_read_id,
							regMb: vm.componentes[i].device_modbus_read_reg,
							varResult: CONTROLLER + ".componenteLeitura[" + vm.countComponent + "]",
							varChanging: CONTROLLER + ".compChanging[" + vm.countComponent + "]",
							varAct: CONTROLLER + ".componenteLeitura[" + (vm.countComponent + 1) + "]",
							varFalha: CONTROLLER + ".componenteLeituraFcon[" + vm.countComponent + "]",
							unidade_medida: vm.componentes[i].unidade_medida,
							fator: parseFloat(vm.componentes[i].fator),
							bke_tasks: CONTROLLER + ".allcomponentesOffset[" + (indexComponenteTasks) + "].bke_tasks"
						});
						//============================================================================================
						//Alimenta componentes chart
						//============================================================================================
						if (vm.objetosDinamicos[i].tipo == "chart") {
							vm.mainChart[counterChartsObjects] = vm.objetosDinamicos[i].bke_tasks
							vm.mainChartSelected.push(vm.objetosDinamicos[i])
							if (vm.objetosDinamicos[i].parameters.modo == 'query') {
								vm.objetosDinamicos[i].descricao = `${vm.objetosDinamicos[i].descricao} | Filtro de ${moment(vm.objetosDinamicos[i].parameters.dataInicial).format('DD-MM-YYYY HH:mm')} ${String.fromCharCode(224)} ${moment(vm.objetosDinamicos[i].parameters.dataFinal).format('DD-MM-YYYY HH:mm')}`
							} else {
								vm.objetosDinamicos[i].descricao = `${vm.objetosDinamicos[i].descricao} | ${fomartFilterChart(vm.objetosDinamicos[i].parameters.periodo)}`
							}
							counterChartsObjects++
						}
						//============================================================================================
						//Alimenta componentes alarmes
						//============================================================================================
						if (vm.objetosDinamicos[i].tipo == "alarme") {
							vm.mainAlarmes.push(vm.objetosDinamicos[i])
							counterAlmObjects++
						}
						//============================================================================================
						//Alimenta componentes dimmer
						//============================================================================================
						if (vm.objetosDinamicos[i].tipo == "dimmer") {
							eval(`vm.dimmersComponent${counterDimmerObjects}`).oldValue = vm.objetosDinamicos[i].ultimo_valor
							eval(`vm.dimmersComponent${counterDimmerObjects}`).idBanco = vm.objetosDinamicos[i].id
							eval(`vm.dimmersComponent${counterDimmerObjects}`).value = vm.objetosDinamicos[i].ultimo_valor
							counterDimmerObjects++
						}
						//============================================================================================
						//Alimenta componentes fita RGB
						//============================================================================================
						if (vm.objetosDinamicos[i].tipo == "fita-rgb") {
							//vm.fitaRGBComponent0 = {color:'rgb(0,0,0)'};
							eval(`vm.fitaRGBComponent${counterFitaRGBObjects}`).idBanco = vm.objetosDinamicos[i].id
							eval(`vm.fitaRGBComponent${counterFitaRGBObjects}`).color = vm.objetosDinamicos[i].ultimo_valor_rgb
							eval(`vm.fitaRGBComponent${counterFitaRGBObjects}`).ultimo_valor_r = vm.objetosDinamicos[i].ultimo_valor_r
							eval(`vm.fitaRGBComponent${counterFitaRGBObjects}`).ultimo_valor_g = vm.objetosDinamicos[i].ultimo_valor_g
							eval(`vm.fitaRGBComponent${counterFitaRGBObjects}`).ultimo_valor_b = vm.objetosDinamicos[i].ultimo_valor_b
							counterFitaRGBObjects++
						}
						//============================================================================================
						//Adiciona objeto em tela
						//============================================================================================
						vm.adicionarObjHtml(vm.objetosDinamicos[i].tipo, vm.countComponent, vm.objetosDinamicos[i].descricao, vm.objetosDinamicos[i].device_modbus_write_id,
							vm.objetosDinamicos[i].device_modbus_write_reg, vm.objetosDinamicosFilaReqLeitura[i].varResult, vm.objetosDinamicosFilaReqLeitura[i].varChanging,
							vm.objetosDinamicosFilaReqLeitura[i].varAct, vm.objetosDinamicosFilaReqLeitura[i].varFalha,
							vm.componentes[i].unidade_medida, vm.objetosDinamicos[i].menu_navegacao,
							vm.componentes[i].nivel_min, vm.componentes[i].nivel_max, vm.componentes[i].nivel_baixo, vm.componentes[i].nivel_alto,
							parseFloat(vm.componentes[i].fator), vm.objetosDinamicosFilaReqLeitura[i].bke_tasks, indexComponenteTasks, CONTROLLER + ".allComponentes",
							vm.objetosDinamicos[i].visivel, vm.objetosDinamicos[i].icoon, vm.objetosDinamicos[i].icooff, vm.objetosDinamicos[i].imagesize, vm.objetosDinamicos[i].imagetop,
							counterChartsObjects, vm.objetosDinamicos[i].id, counterAlmObjects, counterDimmerObjects, vm.objetosDinamicos[i].cor_normal, vm.objetosDinamicos[i].cor_baixo,
							vm.objetosDinamicos[i].cor_alto, vm.objetosDinamicos[i].tamanho, vm.objetosDinamicos[i].device_modbus_write_id_1, vm.objetosDinamicos[i].device_modbus_write_reg_1,
							vm.objetosDinamicos[i].device_modbus_write_id_2, vm.objetosDinamicos[i].device_modbus_write_reg_2, vm.objetosDinamicos[i].font_size
						)
						//============================================================================================
						//Determina o numero de dados por compoente (ex: 2 = 2 registros modbus)
						//============================================================================================
						vm.countComponent = vm.countComponent + registroModbusPorComponente
					}
					vm.objetosDinamicosLen = lodash.size(vm.objetosDinamicos);
					updateCharts()
					getAlmAllComp()
					readModbusFunc()
				})

				$timeout(function () {
					$scope.$broadcast('rzSliderForceRender');
				});
			}
			//============================================================================================
			//Função exportar alarmes para xls
			//============================================================================================
			vm.xlsExportAlm = function () {
				var objectToExport = []
				for (var i = 0; i < vm.alarmesCompData[vm.countAlarmeData].length; i++) {
					objectToExport.push({
						"Data da ocorrencia": moment(vm.alarmesCompData[vm.countAlarmeData][i].data_ocorrido).format("DD/MM/YYYY HH:mm:ss"),
						"Data da resolução": moment(vm.alarmesCompData[vm.countAlarmeData][i].data_resolucao).format("DD/MM/YYYY HH:mm:ss"),
						"Descrição": vm.alarmesCompData[vm.countAlarmeData][i].descricao,
						"Equipamento": vm.alarmesCompData[vm.countAlarmeData][i].equipamento,
						"Valor": vm.alarmesCompData[vm.countAlarmeData][i].valor,
						// "Prioridade": vm.alarmesCompData[vm.countAlarmeData][i].prioridade ,
						"Localização do objeto": vm.alarmesCompData[vm.countAlarmeData][i].navegacao
					})

				}
				alasql('SELECT * INTO XLSX("Alarmes.xlsx",{headers:true}) FROM ?', [objectToExport]);
			}
			//============================================================================================
			//Função exportar objeto tabela para xls
			//============================================================================================
			vm.exportToExcel = function (tableId) { // ex: '#my-table'
				var exportHref = Excel.tableToExcel(tableId, 'sheet name');
				$timeout(function () {
					location.href = exportHref;
				}, 100) // trigger download
			}
			//============================================================================================
			//Função exportar objeto Html para pdf (Chart)
			//============================================================================================
			vm.exportToPdf = function (idElemento) {
				var periodoExport
				if (vm.mainChartSelected[vm.indexChart].parameters.modo == 'query') {
					periodoExport = `${moment(vm.mainChartSelected[vm.indexChart].parameters.dataInicial).format('DD-MM-YYYY HH:mm')} ${String.fromCharCode(224)} ${moment(vm.mainChartSelected[vm.indexChart].parameters.dataFinal).format('DD-MM-YYYY HH:mm')}`
				} else {
					periodoExport = `${fomartFilterChart(vm.mainChartSelected[vm.indexChart].parameters.periodo)}`
				}
				html2canvas(document.getElementById(idElemento), {
					onrendered: function (canvas) {
						var data = canvas.toDataURL();
						var docDefinition = {
							pageOrientation: 'landscape',
							header: [{ text: 'INPI-CPU relatórios gráficos', color: '#808080', alignment: 'center', fontSize: 22, margin: [0, 10] }],
							footer: {
								text: [
									{ text: 'Rua Mamoré, 15 - São Francisco - Curitiba - PR\n', alignment: 'center', fontSize: 10, color: '#808080' },
									{ text: 'www.intech-automacao.com.br', link: 'https://www.intech-automacao.com.br', alignment: 'center', fontSize: 10, color: '#808080' }
								]
							},
							content: [
								{ text: `Período: ${periodoExport}`, color: '#808080', alignment: 'left', fontSize: 10, margin: [10, 10] },
								{ image: data, width: 760, margin: [0, 70] },
								{ text: `impressão: ${moment().format("DD/MM/YYYY HH:mm:ss")}`, color: '#808080', alignment: 'left', fontSize: 10, margin: [0, 0] },

							]
						};
						pdfMake.createPdf(docDefinition).download("chart.pdf");
					}
				});
			}
			//============================================================================================
			//Função exportar objeto Html para pdf (alms)
			//============================================================================================
			vm.exportToPdfAlms = function (idElemento) {
				html2canvas(document.getElementById(idElemento), {
					onrendered: function (canvas) {
						var data = canvas.toDataURL();
						var docDefinition = {
							pageOrientation: 'landscape',
							header: [{ text: 'INPI-CPU relatórios', color: '#808080', alignment: 'center', fontSize: 22, margin: [0, 10] }],
							// header: function(currentPage, pageCount, pageSize) {
							footer: {
								text: [
									{ text: 'Rua Mamoré, 15 - São Francisco - Curitiba - PR\n', alignment: 'center', fontSize: 10, color: '#808080' },
									{ text: 'www.intech-automacao.com.br', link: 'https://www.intech-automacao.com.br', alignment: 'center', fontSize: 10, color: '#808080' }
								]
							},
							content: [
								//{text:`Período: ${vm.mainChart[vm.indexChart].optionsChart.config.series[0].periodo}`, color: '#808080', alignment: 'left', fontSize: 10, margin:[10,10]},
								{ image: data, width: 760, margin: [0, 70] },
								{ text: `impressão: ${moment().format("DD/MM/YYYY HH:mm:ss")}`, color: '#808080', alignment: 'left', fontSize: 10, margin: [0, 0] },

							]
						};
						pdfMake.createPdf(docDefinition).download("alarmes.pdf");
					}
				});
			}
			vm.objetosDinamicosReset()
			vm.objetosDinamicosFilaReset()
			vm.querySistema(ID_SISTEMA_USER)


			//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			//Implementações para monitoramento dos turbidimetros

			var requestsMySql = []
			vm.dadosEta2 = []
			vm.filtro = 'diario'
			vm.agrupamento = 'todos'
			vm.perInicio = moment(Date.now()).subtract(1, 'hours');
			vm.perFim = moment().format('YYYY-MM-DD HH:mm:ss')
			var dataInicial = moment().format('YYYY-MM-DD 00:00:00')
			var dataFinal = moment().format('YYYY-MM-DD 23:59:59')
			var chartType = 'line'
			var maxTurbidez = 1
			var minTurbidez = 0
			vm.hideMaxMin = 'false'
			vm.DataCalcFiltro = []

			//============================================================================================
			//Função exportar tabela para xls
			//============================================================================================
			vm.xlsDowloadclickAnalises = function () {
				var objectToExport = []
				objectToExport.push({
					"Período": `${moment(dataInicial).format('DD/MM/YYYY HH:mm:ss')} - ${moment(dataFinal).format('DD/MM/YYYY HH:mm:ss')}`,
					"Amostras": vm.DataCalc.numAmostras,
					"Percentil 95%": vm.DataCalc.percentil,
					"2,2 < X amostras": vm.DataCalc.calc01Value,
					"2,2 < X percentual": vm.DataCalc.calc01Perc,
					"1,9 < X <= 2,2 amostras": vm.DataCalc.calc02Value,
					"1,9 < X <= 2,2 percentual": vm.DataCalc.calc02Perc,
					"1,6 < X <= 1,9 amostras": vm.DataCalc.calc03Value,
					"1,6 < X <= 1,9 percentual": vm.DataCalc.calc03Perc,
					"1,3 < X <= 1,6 amostras": vm.DataCalc.calc04Value,
					"1,3 < X <= 1,6 percentual": vm.DataCalc.calc04Perc,
					"1 < X <= 1,3 amostras": vm.DataCalc.calc05Value,
					"1 < X <= 1,3 percentual": vm.DataCalc.calc05Perc,
					"0,5 < X <= 1 amostras": vm.DataCalc.calc06Value,
					"0,5 < X <= 1 percentual": vm.DataCalc.calc06Perc,
					"0,3 < X <= 0,5 amostras": vm.DataCalc.calc07Value,
					"0,3 < X <= 0,5 percentual": vm.DataCalc.calc07Perc,
					"X <= 0,3 amostras": vm.DataCalc.calc08Value,
					"X <= 0,3 percentual": vm.DataCalc.calc08Perc,

				})
				alasql('SELECT * INTO XLSX("analises_ETA2.xlsx",{headers:true}) FROM ?', [objectToExport]);
			}
			//============================================================================================
			//Função exportar tabela para xls por index
			//============================================================================================
			vm.xlsDowloadclickAnalisesPorIndex = function (index) {
				var objectToExport = []
				objectToExport.push({
					"Período": `${moment(dataInicial).format('DD/MM/YYYY HH:mm:ss')} - ${moment(dataFinal).format('DD/MM/YYYY HH:mm:ss')}`,
					"Amostras": vm.DataCalcFiltro[index].numAmostras,
					"Percentil 95%": vm.DataCalcFiltro[index].percentil,
					"2,2 < X amostras": vm.DataCalcFiltro[index].calc01Value,
					"2,2 < X percentual": vm.DataCalcFiltro[index].calc01Perc,
					"1,9 < X <= 2,2 amostras": vm.DataCalcFiltro[index].calc02Value,
					"1,9 < X <= 2,2 percentual": vm.DataCalcFiltro[index].calc02Perc,
					"1,6 < X <= 1,9 amostras": vm.DataCalcFiltro[index].calc03Value,
					"1,6 < X <= 1,9 percentual": vm.DataCalcFiltro[index].calc03Perc,
					"1,3 < X <= 1,6 amostras": vm.DataCalcFiltro[index].calc04Value,
					"1,3 < X <= 1,6 percentual": vm.DataCalcFiltro[index].calc04Perc,
					"1 < X <= 1,3 amostras": vm.DataCalcFiltro[index].calc05Value,
					"1 < X <= 1,3 percentual": vm.DataCalcFiltro[index].calc05Perc,
					"0,5 < X <= 1 amostras": vm.DataCalcFiltro[index].calc06Value,
					"0,5 < X <= 1 percentual": vm.DataCalcFiltro[index].calc06Perc,
					"0,3 < X <= 0,5 amostras": vm.DataCalcFiltro[index].calc07Value,
					"0,3 < X <= 0,5 percentual": vm.DataCalcFiltro[index].calc07Perc,
					"X <= 0,3 amostras": vm.DataCalcFiltro[index].calc08Value,
					"X <= 0,3 percentual": vm.DataCalcFiltro[index].calc08Perc,

				})
				alasql('SELECT * INTO XLSX("analises_ETA2.xlsx",{headers:true}) FROM ?', [objectToExport]);
			}
			//============================================================================================
			//Função exportar objeto Html para pdf (Chart)
			//============================================================================================
			vm.pdfDowloadclickChart = function (idElemento) {
				var periodoExport
				periodoExport = `${moment(dataInicial).format('DD/MM/YYYY HH:mm:ss')} - ${moment(dataFinal).format('DD/MM/YYYY HH:mm:ss')}`

				html2canvas(document.getElementById(idElemento), {
					onrendered: function (canvas) {
						var data = canvas.toDataURL();
						var docDefinition = {
							pageOrientation: 'landscape',
							header: [{ text: 'CONASA MORRETES - ETA 2 - Relatório gráfico turbidez', color: '#808080', alignment: 'center', fontSize: 22, margin: [0, 10] }],
							footer: {
								text: [
									{ text: 'in-Tech Automação e Sistemas\n', alignment: 'center', fontSize: 10, color: '#808080' },
									{ text: 'Av. N. Sra. Aparecida, 381, Seminário\n', alignment: 'center', fontSize: 10, color: '#808080' },
									{ text: 'www.intech-automacao.com.br', link: 'https://www.intech-automacao.com.br', alignment: 'center', fontSize: 10, color: '#808080' }
								]
							},
							content: [
								{ text: `Período: ${periodoExport}`, color: '#808080', alignment: 'left', fontSize: 10, margin: [10, 10] },
								{ image: data, width: 760, margin: [0, 70] },
								{ text: `impressão: ${moment().format("DD/MM/YYYY HH:mm:ss")}`, color: '#808080', alignment: 'left', fontSize: 10, margin: [0, 0] },

							]
						};
						pdfMake.createPdf(docDefinition).download("chart.pdf");
					}
				});
			}
			//============================================================================================
			//Função exportar tabela para xls
			//============================================================================================
			vm.xlsDowloadclickRelatorio = function () {
				var objectToExport = []
				for (let i = 0; i < vm.dadosEta2.length; i++) {
					objectToExport.push({
						"Data hora": moment(vm.dadosEta2[i].timestamp).format("DD/MM/YYYY HH:mm:ss"),
						"Filtro 1 ETA2": vm.dadosEta2[i].filtro1,
						"Filtro 2 ETA2": vm.dadosEta2[i].filtro2,
						"Filtro 3 ETA2": vm.dadosEta2[i].filtro3,
						"Filtro 4 ETA2": vm.dadosEta2[i].filtro4,
						"Decantador ETA2": vm.dadosEta2[i].filtro5,
						"Filtro 6..12 ETA1": vm.dadosEta2[i].filtro6,
						"Filtro 7..12 ETA1": vm.dadosEta2[i].filtro7,
						"Agua potavel": vm.dadosEta2[i].filtro8,
					})
				}
				alasql('SELECT * INTO XLSX("relatorio_ETA2.xlsx",{headers:true}) FROM ?', [objectToExport]);
			}

			const optionsSeries = {
				fill: false,
				lineTension: 0.4,
				borderWidth: 1,
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 5,

			}

			vm.dataChartEta = {
				labels: [],
				datasets: [
					{
						data: [],
						label: "Filtro 1-ETA2",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(255,0,0,0.4)",
						borderColor: "rgba(255,0,0,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(255,0,0,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(255,0,0,0.0)",
						pointHoverBorderColor: "rgba(220,220,220,0.0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Filtro 2-ETA2",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(0,255,0,0.4)",
						borderColor: "rgba(0,255,0,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(0,255,0,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(0,255,0,0.0)",
						pointHoverBorderColor: "rgba(220,220,220,0.0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Filtro 3-ETA2",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(0,0,255,0.4)",
						borderColor: "rgba(0,0,255,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(0,0,255,0.0)",
						pointHoverBorderColor: "rgba(220,220,220,0.0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Filtro 4-ETA2",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(128,128,128,0.4)",
						borderColor: "rgba(128,128,128,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(128,128,128,0)",
						pointHoverBorderColor: "rgba(220,220,220,0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Decantador ETA2",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(64,64,64,0.4)",
						borderColor: "rgba(64,64,64,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(64,64,64,0)",
						pointHoverBorderColor: "rgba(220,220,220,0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Filtro 1-6 ETA1",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(128,28,0,0.4)",
						borderColor: "rgba(128,28,0,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(128,28,0,0)",
						pointHoverBorderColor: "rgba(220,220,220,0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Filtro 7-12 ETA1",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(255,128,64,0.4)",
						borderColor: "rgba(255,128,64,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(255,128,64,0)",
						pointHoverBorderColor: "rgba(220,220,220,0)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Água tratada",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(75,192,192,0.4)",
						borderColor: "rgba(75,192,192,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(75,192,192,1)",
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
					},
					{
						data: [],
						label: "Lim. máximo",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(22,200,100,0.4)",
						borderColor: "rgba(22,200,100,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(22,200,100,1)",
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
						hidden: vm.hideMaxMin,
					},
					{
						data: [],
						label: "Lim. mínimo",
						fill: optionsSeries.fill,
						lineTension: optionsSeries.lineTension,
						borderWidth: optionsSeries.borderWidth,
						backgroundColor: "rgba(223,223,192,0.4)",
						borderColor: "rgba(223,223,192,1)",
						borderCapStyle: optionsSeries.borderCapStyle,
						borderDash: optionsSeries.borderDash,
						borderDashOffset: optionsSeries.borderDashOffset,
						borderJoinStyle: optionsSeries.borderJoinStyle,
						pointBorderColor: "rgba(75,192,192,1)",
						pointBackgroundColor: optionsSeries.pointBackgroundColor,
						pointBorderWidth: optionsSeries.pointBorderWidth,
						pointHoverRadius: optionsSeries.pointHoverRadius,
						pointHoverBackgroundColor: "rgba(223,223,192,1)",
						pointHoverBorderColor: "rgba(220,220,220,1)",
						pointHoverBorderWidth: optionsSeries.pointHoverBorderWidth,
						pointRadius: optionsSeries.pointRadius,
						pointHitRadius: optionsSeries.pointHitRadius,
						spanGaps: optionsSeries.spanGaps,
						hidden: vm.hideMaxMin,
					}
				]
			};

			vm.optionsChartEta = {
				legend: {
					display: true,
					position: 'top',
					labels: {
						boxWidth: 10,
						fontColor: '#606060',
						fontSize: 12,
						pointStyle: 'circle',
						usePointStyle: true,
						pointStyleWidth: 0,
						borderRadius: 0,
					}
				},
				scales: {
					yAxes: [{
						ticks: {
							fontSize: 10,
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Turbidez NTU'
						}
					}],

					xAxes: [{
						ticks: {
							fontSize: 10
						}
					}],
				}
			}

			vm.pluginsChartEta = [{

			}];

			vm.onChartClick = function (event) {
				//console.log(event);
			};

			vm.showHideLimits = function (value) {
				vm.dataChartEta.datasets[8].hidden = !vm.dataChartEta.datasets[8].hidden
				vm.dataChartEta.datasets[9].hidden = !vm.dataChartEta.datasets[9].hidden
			}



			function getPercentil(percentile, arr) {
				arr.sort(function (a, b) { return a - b; });

				var index = (percentile / 100) * arr.length;
				if (Math.floor(index) == index) {
					return (arr[index - 1] + arr[index]) / 2;
				}
				else {
					return arr[Math.floor(index)];
				}
				return;
			}


			realizaConsulta(vm.agrupamento, dataInicial, dataFinal, 104, 111)
			//Auto update - 10min
			$interval(function(){
				realizaConsulta(vm.agrupamento, dataInicial, dataFinal, 104, 111)
			}, 600000)

			function roundNum(number, decimalPlaces) {
				return +(Math.round(number + "e+" + decimalPlaces) + "e-" + decimalPlaces);
			}


			function realizaConsulta(tipo, datainicial, datafinal, tabelaInicial, tabelaFinal) {
				requestsMySql = []
				vm.dadosEta2 = []
				vm.dataChartEta.labels = []
				vm.dataChartEta.datasets[0].data = []
				vm.dataChartEta.datasets[1].data = []
				vm.dataChartEta.datasets[2].data = []
				vm.dataChartEta.datasets[3].data = []
				vm.dataChartEta.datasets[4].data = []
				vm.dataChartEta.datasets[5].data = []
				vm.dataChartEta.datasets[6].data = []
				vm.dataChartEta.datasets[7].data = []

				if (tipo == 'todos') {
					for (var i = tabelaInicial; i <= tabelaFinal; i++) {
						requestsMySql.push(querysql.queryGeral(`SELECT timestamp, descricao, valor FROM log_${i} WHERE timestamp >= '${moment(datainicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp <='${moment(datafinal).format('YYYY-MM-DD HH:mm:ss')}' ORDER BY timestamp ASC`))
					}
				}
				if (tipo == 'media-minuto') {
					for (var i = tabelaInicial; i <= tabelaFinal; i++) {
						requestsMySql.push(querysql.queryGeral(`SELECT timestamp, descricao, AVG(valor) AS valor FROM log_${i} WHERE timestamp >= '${moment(datainicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp <='${moment(datafinal).format('YYYY-MM-DD HH:mm:ss')}'GROUP BY DAY(timestamp), HOUR(timestamp), MINUTE(timestamp) ORDER BY timestamp ASC`))
					}
				}
				if (tipo == 'media-hora') {
					for (var i = tabelaInicial; i <= tabelaFinal; i++) {
						requestsMySql.push(querysql.queryGeral(`SELECT timestamp, descricao, AVG(valor) AS valor FROM log_${i} WHERE timestamp >= '${moment(datainicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp <='${moment(datafinal).format('YYYY-MM-DD HH:mm:ss')}'GROUP BY DAY(timestamp), HOUR(timestamp) ORDER BY timestamp ASC`))
					}
				}
				if (tipo == 'maximo') {
					vm.dataChartEta.datasets[8].hidden = true
					vm.dataChartEta.datasets[9].hidden = true
					for (var i = tabelaInicial; i <= tabelaFinal; i++) {
						requestsMySql.push(querysql.queryGeral(`SELECT timestamp, descricao, MAX(valor) AS valor FROM log_${i} WHERE timestamp >= '${moment(datainicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp <='${moment(datafinal).format('YYYY-MM-DD HH:mm:ss')}' ORDER BY timestamp ASC`))
					}
				}
				if (tipo == 'minimo') {
					vm.dataChartEta.datasets[8].hidden = true
					vm.dataChartEta.datasets[9].hidden = true
					for (var i = tabelaInicial; i <= tabelaFinal; i++) {
						requestsMySql.push(querysql.queryGeral(`SELECT timestamp, descricao, MIN(valor) AS valor FROM log_${i} WHERE timestamp >= '${moment(datainicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp <='${moment(datafinal).format('YYYY-MM-DD HH:mm:ss')}' ORDER BY timestamp ASC`))
					}
				}

				$q.all(requestsMySql).then(function (response) {
					if (response[0].data.length == 1) {
						vm.chartType = 'bar'
					} else {
						vm.chartType = 'line'
					}
					//formata dados para gráfico
					for (var j = 0; j < response[0].data.length; j++) {
						vm.dadosEta2.push({
							timestamp: response[0].data[j].timestamp,
							filtro1: roundNum(response[0].data[j].valor, 2),
							filtro2: roundNum(response[1].data[j].valor, 2),
							filtro3: roundNum(response[2].data[j].valor, 2),
							filtro4: roundNum(response[3].data[j].valor, 2),
							filtro5: roundNum(response[4].data[j].valor, 2),
							filtro6: roundNum(response[5].data[j].valor, 2),
							filtro7: roundNum(response[6].data[j].valor, 2),
							filtro8: roundNum(response[7].data[j].valor, 2),
							maxTurbidez: maxTurbidez,
							minTurbidez: minTurbidez,

						})
						if (vm.chartType == 'line') {
							vm.dataChartEta.labels.push(moment(response[0].data[j].timestamp).format('DD-MM-YYYY HH:mm:ss'))
						} else {
							vm.dataChartEta.labels.push('Dados')
						}
						vm.dataChartEta.datasets[0].data.push(roundNum(response[0].data[j].valor, 2))
						vm.dataChartEta.datasets[1].data.push(roundNum(response[1].data[j].valor, 2))
						vm.dataChartEta.datasets[2].data.push(roundNum(response[2].data[j].valor, 2))
						vm.dataChartEta.datasets[3].data.push(roundNum(response[3].data[j].valor, 2))
						vm.dataChartEta.datasets[4].data.push(roundNum(response[4].data[j].valor, 2))
						vm.dataChartEta.datasets[5].data.push(roundNum(response[5].data[j].valor, 2))
						vm.dataChartEta.datasets[6].data.push(roundNum(response[6].data[j].valor, 2))
						vm.dataChartEta.datasets[7].data.push(roundNum(response[7].data[j].valor, 2))
						vm.dataChartEta.datasets[8].data.push(roundNum(maxTurbidez, 2))
						vm.dataChartEta.datasets[9].data.push(roundNum(minTurbidez, 2))

					}
					//formata dados para análise geral
					vm.DataCalc = {}
					vm.DataCalc.numAmostras = vm.dataChartEta.labels.length * 8
					vm.DataCalc.calc01Value = 0
					vm.DataCalc.calc01Perc = 0
					vm.DataCalc.calc02Value = 0
					vm.DataCalc.calc02Perc = 0
					vm.DataCalc.calc03Value = 0
					vm.DataCalc.calc03Perc = 0
					vm.DataCalc.calc04Value = 0
					vm.DataCalc.calc04Perc = 0
					vm.DataCalc.calc05Value = 0
					vm.DataCalc.calc05Perc = 0
					vm.DataCalc.calc06Value = 0
					vm.DataCalc.calc06Perc = 0
					vm.DataCalc.calc07Value = 0
					vm.DataCalc.calc07Perc = 0
					vm.DataCalc.calc08Value = 0
					vm.DataCalc.calc08Perc = 0
					vm.dataSetsToPercentil = []
					for (let i = 0; i < vm.dataChartEta.labels.length; i++) {
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[0].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[1].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[2].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[3].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[4].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[5].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[6].data[i])
						vm.dataSetsToPercentil.push(vm.dataChartEta.datasets[7].data[i])
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 2.2) {
								vm.DataCalc.calc01Value++
							}
						}
						vm.DataCalc.calc01Perc = vm.DataCalc.calc01Value / vm.DataCalc.numAmostras * 100.0

						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 1.9 && vm.dataChartEta.datasets[j].data[i] <= 2.2) {
								vm.DataCalc.calc02Value++
							}
						}
						vm.DataCalc.calc02Perc = vm.DataCalc.calc02Value / vm.DataCalc.numAmostras * 100.0
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 1.6 && vm.dataChartEta.datasets[j].data[i] <= 1.9) {
								vm.DataCalc.calc03Value++
							}
						}
						vm.DataCalc.calc03Perc = vm.DataCalc.calc03Value / vm.DataCalc.numAmostras * 100.0
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 1.3 && vm.dataChartEta.datasets[j].data[i] <= 1.6) {
								vm.DataCalc.calc04Value++
							}
						}
						vm.DataCalc.calc04Perc = vm.DataCalc.calc04Value / vm.DataCalc.numAmostras * 100.0
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 1 && vm.dataChartEta.datasets[j].data[i] <= 1.3) {
								vm.DataCalc.calc05Value++
							}
						}
						vm.DataCalc.calc05Perc = vm.DataCalc.calc05Value / vm.DataCalc.numAmostras * 100.0
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 0.5 && vm.dataChartEta.datasets[j].data[i] <= 1) {
								vm.DataCalc.calc06Value++
							}
						}
						vm.DataCalc.calc06Perc = vm.DataCalc.calc06Value / vm.DataCalc.numAmostras * 100.0
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] > 0.3 && vm.dataChartEta.datasets[j].data[i] <= 0.5) {
								vm.DataCalc.calc07Value++
							}
						}
						vm.DataCalc.calc07Perc = vm.DataCalc.calc07Value / vm.DataCalc.numAmostras * 100.0
						for (let j = 0; j <= 7; j++) {
							if (vm.dataChartEta.datasets[j].data[i] <= 0.3) {
								vm.DataCalc.calc08Value++
							}
						}
						vm.DataCalc.calc08Perc = vm.DataCalc.calc08Value / vm.DataCalc.numAmostras * 100.0
					}
					vm.DataCalc.percentil = getPercentil(95, vm.dataSetsToPercentil)
					vm.DataCalcFiltro[0] = calcEstatisticasPorColuna(vm.dataChartEta,0)
					vm.DataCalcFiltro[1] = calcEstatisticasPorColuna(vm.dataChartEta,1)
					vm.DataCalcFiltro[2] = calcEstatisticasPorColuna(vm.dataChartEta,2)
					vm.DataCalcFiltro[3] = calcEstatisticasPorColuna(vm.dataChartEta,3)
					vm.DataCalcFiltro[4] = calcEstatisticasPorColuna(vm.dataChartEta,4)
					vm.DataCalcFiltro[5] = calcEstatisticasPorColuna(vm.dataChartEta,5)
					vm.DataCalcFiltro[6] = calcEstatisticasPorColuna(vm.dataChartEta,6)
					vm.DataCalcFiltro[7] = calcEstatisticasPorColuna(vm.dataChartEta,7)
				})

				


			}

			//função para calcula de estatísticas por filtro/coluna
			function calcEstatisticasPorColuna(dataArrayChar, indexData) {
				var dataEstatistica = {}
				dataEstatistica.numAmostras = dataArrayChar.labels.length * 1
				dataEstatistica.calc01Value = 0
				dataEstatistica.calc01Perc = 0
				dataEstatistica.calc02Value = 0
				dataEstatistica.calc02Perc = 0
				dataEstatistica.calc03Value = 0
				dataEstatistica.calc03Perc = 0
				dataEstatistica.calc04Value = 0
				dataEstatistica.calc04Perc = 0
				dataEstatistica.calc05Value = 0
				dataEstatistica.calc05Perc = 0
				dataEstatistica.calc06Value = 0
				dataEstatistica.calc06Perc = 0
				dataEstatistica.calc07Value = 0
				dataEstatistica.calc07Perc = 0
				dataEstatistica.calc08Value = 0
				dataEstatistica.calc08Perc = 0
				var dataSetsToPercentil = []
				for (let i = 0; i < dataArrayChar.labels.length; i++) {
					dataSetsToPercentil.push(dataArrayChar.datasets[indexData].data[i])
					if (dataArrayChar.datasets[indexData].data[i] > 2.2) {
						dataEstatistica.calc01Value++
					}
					dataEstatistica.calc01Perc = dataEstatistica.calc01Value / dataEstatistica.numAmostras * 100.0

					if (dataArrayChar.datasets[indexData].data[i] > 1.9 && dataArrayChar.datasets[indexData].data[i] <= 2.2) {
						dataEstatistica.calc02Value++
					}
					dataEstatistica.calc02Perc = dataEstatistica.calc02Value / dataEstatistica.numAmostras * 100.0
					if (dataArrayChar.datasets[indexData].data[i] > 1.6 && dataArrayChar.datasets[indexData].data[i] <= 1.9) {
						dataEstatistica.calc03Value++
					}
					dataEstatistica.calc03Perc = dataEstatistica.calc03Value / dataEstatistica.numAmostras * 100.0
					if (dataArrayChar.datasets[indexData].data[i] > 1.3 && dataArrayChar.datasets[indexData].data[i] <= 1.6) {
						dataEstatistica.calc04Value++
					}
					dataEstatistica.calc04Perc = dataEstatistica.calc04Value / dataEstatistica.numAmostras * 100.0
					if (dataArrayChar.datasets[indexData].data[i] > 1 && dataArrayChar.datasets[indexData].data[i] <= 1.3) {
						dataEstatistica.calc05Value++
					}
					dataEstatistica.calc05Perc = dataEstatistica.calc05Value / dataEstatistica.numAmostras * 100.0
					if (dataArrayChar.datasets[indexData].data[i] > 0.5 && dataArrayChar.datasets[indexData].data[i] <= 1) {
						dataEstatistica.calc06Value++
					}
					dataEstatistica.calc06Perc = dataEstatistica.calc06Value / dataEstatistica.numAmostras * 100.0

					if (dataArrayChar.datasets[indexData].data[i] > 0.3 && dataArrayChar.datasets[indexData].data[i] <= 0.5) {
						dataEstatistica.calc07Value++
					}
					dataEstatistica.calc07Perc = dataEstatistica.calc07Value / dataEstatistica.numAmostras * 100.0
					if (dataArrayChar.datasets[indexData].data[i] <= 0.3) {
						dataEstatistica.calc08Value++
					}
					dataEstatistica.calc08Perc = dataEstatistica.calc08Value / dataEstatistica.numAmostras * 100.0
				}
				dataEstatistica.percentil = getPercentil(95, dataSetsToPercentil)
				return dataEstatistica
			}

			vm.periodoClick = function () {
				vm.dadosEta2 = []
				vm.perInicio = moment(Date.now()).subtract(1, 'hours');
				vm.perFim = moment().format('YYYY-MM-DD HH:mm:ss')
			}


			vm.agrupamentoClick = function () {
				if (vm.filtro == 'diario') {
					dataInicial = moment().format('YYYY-MM-DD 00:00:00')
					dataFinal = moment().format('YYYY-MM-DD 23:59:59')
				}

				if (vm.filtro == 'semanal') {
					dataInicial = moment(Date.now()).subtract(7, 'days').format('YYYY-MM-DD 00:00:00')
					dataFinal = moment().format('YYYY-MM-DD 23:59:59')
				}

				if (vm.filtro == 'mensal') {
					dataInicial = moment(Date.now()).subtract(30, 'days').format('YYYY-MM-DD 00:00:00')
					dataFinal = moment().format('YYYY-MM-DD 23:59:59')
				}

				if (vm.filtro == 'periodo') {
					dataInicial = moment(vm.perInicio).format('YYYY-MM-DD HH:mm:ss')
					dataFinal = moment(vm.perFim).format('YYYY-MM-DD HH:mm:ss')
				}
				realizaConsulta(vm.agrupamento, dataInicial, dataFinal, 104, 111)
			}





		})//Finaliza get usuario

	}//Finaliza controller
	//------------------------------------
})()
