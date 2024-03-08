
(function(){
	angular.module('intechApp').controller('ConfigController',[
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
		'trocaDados',
		'querysql',
		'auth',
		'$uibModal',
		ConfigController
		])

	function ConfigController($scope, $http, consts, msgs, $compile, $interval, $location, lodash,$window, $element, $timeout, trocaDados, querysql, auth, $uibModal) {

		var vm = this;
		const url = consts.apiUrl
		const registroModbusPorComponente = 2
		const CONTROLLER = 'cfgCtrl'
		var UPDATE_COMP_MS = 5000
		var indexComponenteTasks = 0
		vm.openAc1 = true
		vm.selecFilterComponente = 'tipo'
		vm.componente_unidade_medida = '%'
		vm.componente_unidade_medida_temp = '%'
		vm.componente_nivel_min = 0
		vm.componente_nivel_max = 100
		vm.componente_nivel_baixo = 10
		vm.componente_nivel_alto = 90
		vm.componente_log_tempo = 0
		vm.componente_banda_morta = 0
		vm.componente_visivel = '1'
		vm.imagesize  = 65
		vm.font_size  = 38
		vm.imagetop  = 10
		vm.pathImagemObjetoOn = 'finger-on.png'
		vm.pathImagemObjetoOff = 'finger-off.png'
		vm.componente_sequencia = 1
		vm.componente_alarme = ''
		vm.is_sistema_new = false
		vm.componente_device_modbus_write_id = 0
		vm.componente_device_modbus_write_reg = 0
		vm.componente_device_modbus_write_id_1 = 0
		vm.componente_device_modbus_write_reg_1 = 0
		vm.componente_device_modbus_write_id_2 = 0
		vm.componente_device_modbus_write_reg_2 = 0
		vm.componente_device_modbus_read_id = 0
		vm.componente_device_modbus_read_reg  = 0
		vm.componente_tipo = 'display'
		vm.componente_modulo_plcpi = 'inPi-off-out-4DO'
		vm.componenteEscrita = new Array(256).fill(0)
		vm.componenteLeitura = new Array(256).fill(0)
		vm.componenteLeituraFcon = new Array(256).fill(0)
		vm.compChanging  = new Array(256).fill(0)
		vm.countComponent = 0
		vm.componente_fator = 1
		vm.componente_bke = []
		vm.readingComponentes = true
		//============================================================================================
		//template alarme componente
		//============================================================================================
		const tipicoAlm = 
		{
			habilita:'0',
			tipo: 'digitalon',
			texton:'',
			prioridadetexton:3,
			textoff:'',
			prioridadetextoff:3,
			valorhh:90,
			textohh:'',
			prioridadehh:3,
			habilitahh:false,
			valorh:70,
			textoh:'',
			prioridadeh:3,
			habilitah:false,
			valorl:40,
			textol:'',
			prioridadel:3,
			habilital:false,
			valorll:10,
			textoll:'',
			prioridadell:3,
			habilitall:false,
			emails:[{
				to:'lider@empresa.com.br',
				habilita:false,
				ultimoenvio:null,
			}],
			sms:[]
		}

		vm.componente_alarme = JSON.parse(JSON.stringify(tipicoAlm))
		vm.componente_alarme_telegram = JSON.parse(JSON.stringify(tipicoAlm))

     	//============================================================================================
		//template componente dimmer
		//============================================================================================
		vm.template_dimmer = {value: 2,options: {floor: 0,ceil: 100,step: 1,precision: 0,draggableRange: false,showSelectionBar: false, hideLimitLabels: true, readOnly: false, disabled: false, showTicks: false, showTicksValues: false, translate: function (value) {return value +'%'}, onChange: function () { }}};


		//============================================================================================
		//Adiciona email no alarme dos componentes
		//============================================================================================
		vm.addAlarmeEmail = function(index){
			vm.componente_alarme.emails.splice(index+1,0,{to:null,habilita:false, ultimoenvio:null})
		}
		//============================================================================================
		//remove email no alarme dos componentes
		//============================================================================================
		vm.deleteAlarmeEmail = function(index){
			if(vm.componente_alarme.emails.length > 1){
				vm.componente_alarme.emails.splice(index,1)
			}
		}

		//============================================================================================
		// verifica pede para token
		//============================================================================================
		vm.verificarToken = function() {
			if (vm.tokenBot != "") {
				querysql.verificarToken(vm.tokenBot).then(function(response) {
					msgs.addSuccess("Confirmação Feita")
				}).catch(function(err) {
					console.log(err)
				})
			}else{
				msgs.addError("Token não informado")
			}
		}

		//============================================================================================
		// teste do alarme
		//============================================================================================
		vm.testeAlarme = function() {
			if (vm.tokenBot) {
				if (vm.idChat) {
					querysql.testeAlarme(vm.tokenBot, vm.idChat).then(function(response) {
						msgs.addSuccess("Confirmação Feita")
					}).catch(function(err) {
						console.log(err)
					})
				}else{
					msgs.addError("ID chat não informado")
				}
			}else{
				msgs.addError("Token não informado")
			}
		}


		//============================================================================================
		// teste do alarme
		//============================================================================================
		vm.listarTelegram = function() {
			var sql = (`SELECT * FROM telegram`)
			querysql.queryGeral(sql).then(function(response) {
				vm.telegramBot = response.data
				//console.log(vm.telegramBot)
			})
		}

		vm.listarTelegram()

		//============================================================================================
		//Tamanho de um objeto
		//============================================================================================
		vm.getLenObject = function(objeto){
			return lodash.size(objeto);
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
			//Lista de imagens pasta objects
			//============================================================================================
			vm.getImageList = function(){
				querysql.getImageList(consts.addressFileObjects, 'png-jpg-gif').then(function(response){
					vm.arquivosImagem = response.data
				})
			}
			vm.getImageList()
			//============================================================================================
			//Lista de imagens pasta general
			//============================================================================================
			vm.getImageListGeneral = function(){
				querysql.getImageList(consts.addressFileGeneral, 'png-jpg-gif').then(function(response){
					vm.arquivosImagemGeneral = response.data
				})
			}
			vm.getImageListGeneral()			
			//============================================================================================
			//Modelo compoente task
			//============================================================================================
			vm.hstep = 1;
			vm.mstep = 1;
			vm.compTasksModel ={
				habilita: true,
				horaLiga: [
				{
					hora: 1524970800000
				}
				],
				horaDesliga: [
				{
					hora: 1524970800000
				}
				],
				tagsWriteOn: [
				{
					id: 0,
					reg: 0
				}
				],
				tagsWriteOff: [
				{
					id: 0,
					reg: 0
				}
				]
			}
			//============================================================================================
			//Componentes tasks funcões objeto dinamico
			//============================================================================================
			vm.addHoraLigaTaskComp = function(index) {

				vm.objetosDinamicos[vm.indexTasks].bke_tasks.horaLiga.splice(index + 1, 0, {hora:1524970800000})
			}
			vm.deleteHoraLigaTaskComp = function(index){
				if(vm.objetosDinamicos[vm.indexTasks].bke_tasks.horaLiga.length > 1){
					vm.objetosDinamicos[vm.indexTasks].bke_tasks.horaLiga.splice(index,1)
				}
			}

			vm.addTagLigaTaskComp = function(index) {
				vm.objetosDinamicos[vm.indexTasks].bke_tasks.tagsWriteOn.splice(index + 1, 0, {id:0, reg:0})
			}

			vm.deleteTagLigaTaskComp = function(index){
				if(vm.objetosDinamicos[vm.indexTasks].bke_tasks.tagsWriteOn.length > 1){
					vm.objetosDinamicos[vm.indexTasks].bke_tasks.tagsWriteOn.splice(index,1)
				}
			}

			vm.addHoraDesligaTaskComp = function(index) {
				vm.objetosDinamicos[vm.indexTasks].bke_tasks.horaDesliga.splice(index + 1, 0, {hora:1524970800000})
			}
			vm.deleteHoraDesligaTaskComp = function(index){
				if(vm.objetosDinamicos[vm.indexTasks].bke_tasks.horaDesliga.length > 1){
					vm.objetosDinamicos[vm.indexTasks].bke_tasks.horaDesliga.splice(index,1)
				}
			}

			vm.addTagDesligaTaskComp = function(index) {
				vm.objetosDinamicos[vm.indexTasks].bke_tasks.tagsWriteOff.splice(index + 1, 0, {id:0, reg:0})
			}

			vm.deleteTagDesligaTaskComp = function(index){
				if(vm.objetosDinamicos[vm.indexTasks].bke_tasks.tagsWriteOff.length > 1){
					vm.objetosDinamicos[vm.indexTasks].bke_tasks.tagsWriteOff.splice(index,1)
				}
			}
			//============================================================================================
			//Atualiza informações BKE tasks - componente tarefas
			//============================================================================================
			vm.confirmaEdicaoComp = function(){
				const cmdSql=  "UPDATE config_compontes SET "+
				"bke_tasks='"+JSON.stringify(vm.objetosDinamicos[vm.indexTasks].bke_tasks)+ "' " +
				"WHERE id = '"+ vm.objetosDinamicos[vm.indexTasks].id +"'"
				querysql.queryGeral(cmdSql).then(function(){
					msgs.addSuccess('Registro atualizado! :)')
				}).catch(function(){
					msgs.addError('Erro na atualização')
				})
			}
			//============================================================================================
			//Componentes tasks configuração na inserção ou edição do componente
			//============================================================================================
			vm.addHoraLigaTask = function(index) {
				vm.componente_bke.horaLiga.splice(index + 1, 0, {hora:1524970800000})
			}
			vm.deleteHoraLigaTask = function(index){
				if(vm.componente_bke.horaLiga.length > 1){
					vm.componente_bke.horaLiga.splice(index,1)
				}
			}
			vm.addHoraDesligaTask = function(index) {
				vm.componente_bke.horaDesliga.splice(index + 1, 0, {hora:1524970800000})
			}
			vm.deleteHoraDesligaTask = function(index){
				if(vm.componente_bke.horaDesliga.length > 1){
					vm.componente_bke.horaDesliga.splice(index,1)
				}
			}

			vm.addTagLigaTask = function(index) {
				vm.componente_bke.tagsWriteOn.splice(index + 1, 0, {id:0, reg:0})
			}
			vm.deleteTagLigaTask = function(index){
				if(vm.componente_bke.tagsWriteOn.length > 1){
					vm.componente_bke.tagsWriteOn.splice(index,1)
				}
			}

			vm.addTagDesligaTask = function(index) {
				vm.componente_bke.tagsWriteOff.splice(index + 1, 0, {id:0, reg:0})
			}
			vm.deleteTagDesligaTask = function(index){
				if(vm.componente_bke.tagsWriteOff.length > 1){
					vm.componente_bke.tagsWriteOff.splice(index,1)
				}
			}
			vm.selectunidade = function(){
				if (vm.componente_unidade_medida_temp!='user') {
					vm.componente_unidade_medida = vm.componente_unidade_medida_temp
				}
			}

			//============================================================================================
			//envia informações de qual viwew esta ativa
			//0=Dashboard
			//1=Menu1
			//2=Menu2
			//100=configura componentes
			//101=configura PLCpi
			//============================================================================================
			trocaDados.set(100,0)
			//============================================================================================
			//preenche combo com menus default
			//============================================================================================
			vm.menu_default = {
				id: "Dashboard"
			}
			vm.menus = []
			//
			// vm.tiposObjetosAnalogicos =[
			// 	{objeto:'display'},
			// 	{objeto:'display-bar'},
			// 	{objeto:'display-gauge'},
			// ]
			//============================================================================================
			//Restart objetos dinamicos
			//============================================================================================
			vm.objetoDinamicoHtmlReset = function(){
				var myEl = angular.element(document.querySelector( "[id='objetoDinamicoHtml']"))
				myEl.empty();
				//myEl.remove()
			}
			//============================================================================================
			//Evento click dos objetos
			//============================================================================================
			vm.eventsCom = function(e){
				vm.indexTasks = e.currentTarget.id
			}
			//============================================================================================
			//Destroy scope
			//============================================================================================
			$scope.$on("$destroy", function() {
				if (timerReqModbus) {
					$interval.cancel(timerReqModbus)
				}
				if (timerTemplate) {
					$interval.cancel(timerTemplate)
				}
			})
			//============================================================================================
			//Animação template
			//============================================================================================
			vm.componente_medida_template = 0
			var timerTemplate = $interval(function(){
				vm.componente_medida_template++
				vm.template_estado = !vm.template_estado
				if (vm.componente_medida_template>100) {
					vm.componente_medida_template = 20
				}
			}, 500)

			//============================================================================================
			//Funcões realcionadas ao objeto chart
			//============================================================================================
			const optionChart = consts.optionChart
			const addYChart = consts.addYChart
			const overrideChart = consts.overrideChart
			function getRandomInt(min, max) {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min)) + min;
			}
			function ramdomArray(){
				var dados = []
				dados[0] = getRandomInt(0,120)
				dados[1] = getRandomInt(0,120)
				dados[2] = getRandomInt(0,120)
				dados[3] = getRandomInt(0,120)
				dados[4] = getRandomInt(0,120)
				dados[5] = getRandomInt(0,120)
				dados[6] = getRandomInt(0,120)
				dados[7] = getRandomInt(0,120)
				dados[8] = getRandomInt(0,120)
				dados[9] = getRandomInt(0,120)
				dados[10] = getRandomInt(0,120)
				dados[11] = getRandomInt(0,120)
				dados[12] = getRandomInt(0,120)
				return dados
			}
			//============================================================================================
			//Adiciona e remove pena na configuração
			//============================================================================================
			vm.addPenaConfig = function(index) {
				//++++++++++++++++++++++++++++++++++++++++++++++++++++++
				//Validações
				//++++++++++++++++++++++++++++++++++++++++++++++++++++++
				if ((typeof(vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString) == 'undefined') || !vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString) {
					msgs.addError('O label do eixo X deve ser preenchido')
					return
				}
				if (vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString.length<1) {
					msgs.addError('O label do eixo X deve ser preenchido')
					return
				}
				if (!vm.mainChart.optionsChart.scales.yAxes[0]) {
					msgs.addError('O campo label do eixo Y deve ser preenchido ou pelo menos uma série deve ser criada')
					return
				}
				if (vm.mainChart.optionsChart.scales.yAxes[0].scaleLabel.labelString.length<1) {
					msgs.addError('O label do eixo Y deve ser preenchido')
					return
				}
				vm.mainChart.optionsChart.scales.yAxes[0].scaleLabel.labelString = "Título eixo Y"
				vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString = "Título eixo X"
				vm.mainChart.optionsChart.config.series.splice(index + 1, 0, {nome:'serie'})
				vm.addOptionChart(index)
				vm.addOptionOverrideChart(index)
				vm.mainChart.overrideChart[index].label = vm.mainChart.optionsChart.config.series[index].nome.descricao
				vm.mainChart.dataChart.push(ramdomArray())
			}
			vm.deleteConfigPena = function(index){
				if(vm.mainChart.optionsChart.config.series.length > 1){
					vm.mainChart.optionsChart.config.series.splice(index,1)
					vm.mainChart.overrideChart.pop()
					vm.mainChart.optionsChart.scales.yAxes.pop()
					vm.mainChart.dataChart.pop()
				}
			}
			//============================================================================================
			//Incializa chart
			//============================================================================================
			vm.initChart = function(){
				vm.mainChart = {}
				vm.mainChart.overrideChart = []
				vm.mainChart.dataChart = []
				vm.mainChart.labelsChart = ['ponto 1','ponto 2', 'ponto 3','ponto 4','ponto 5','ponto 6','ponto 7','ponto 8','ponto 9','ponto 10','ponto 11','ponto 12','ponto 13']
				//============================================================================================
				//Pré configura eixo X
				//============================================================================================
				vm.mainChart.optionsChart = JSON.parse(optionChart)
				vm.mainChart.optionsChart.config ={}
				vm.mainChart.optionsChart.config.series = [{nome:'serie', periodo: '',modo:'config', resolucao:'60'}]
				vm.mainChart.optionsChart.heigth = 100
				vm.mainChart.optionsChart.width = "col-xs-12 col-md-12"
				vm.mainChart.optionsChart.legend.display = null //mostra Legenda
				vm.mainChart.optionsChart.legend.position = "top" //configura posição legenda
				vm.mainChart.optionsChart.legend.labels.boxWidth = 12 //tamanho do box da legenda
				vm.mainChart.optionsChart.legend.labels.fontColor= '#808080' //Cor da fonte da legenda
				vm.mainChart.optionsChart.legend.labels.fontSize = 10 //tamanho do box da legenda
				vm.mainChart.optionsChart.animation.duration= 10//
				vm.mainChart.optionsChart.scales.xAxes[0].display = null //mostra eixo x
				vm.mainChart.optionsChart.scales.xAxes[0].ticks.display = null//mostra escala X
				vm.mainChart.optionsChart.scales.xAxes[0].gridLines.display = null //mostra grids
				vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.display = null //mostra label X
				vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString = 'Título eixo X' //Titulo eixo x
			}
			vm.initChart()

			//============================================================================================
			//Pré configura serie inserida
			//============================================================================================
			vm.addOptionChart = function(index){
				vm.mainChart.optionsChart.scales.yAxes.push(JSON.parse(addYChart))
				vm.mainChart.optionsChart.scales.yAxes[index].id = `y-axis-${index}` //define o nome da serie
				vm.mainChart.optionsChart.scales.yAxes[index].display = null//(index > 0) ? false : true //mostra ou nao escala da serie
				vm.mainChart.optionsChart.scales.yAxes[index].position = "left" //mostra ou nao escala da serie
				//vm.mainChart.optionsChart.scales.yAxes[index].gridLines.display = null
				vm.mainChart.optionsChart.scales.yAxes[index].scaleLabel.display = null// index < 1 ? true : false //mostra ou nao label da serie
				vm.mainChart.optionsChart.scales.yAxes[index].scaleLabel.labelString = "Título eixo Y" //nome do label
				//vm.mainChart.optionsChart.scales.yAxes[index].ticks.suggestedMax = 120 //escala maxima da série
				//vm.mainChart.optionsChart.scales.yAxes[index].ticks.suggestedMin = 0 //escoala minima da série
				return vm.mainChart.optionsChart.scales.yAxes[index]
			}
			vm.addOptionChart(0)
			//============================================================================================
			//Configura serie inserida
			//============================================================================================
			vm.addOptionOverrideChart = 	function (index){
				vm.mainChart.overrideChart.push(JSON.parse(overrideChart))
				//vm.mainChart.overrideChart[index].yAxisID = `y-axis-${index}`
				//vm.mainChart.overrideChart[index].backgroundColor = vm.corFundo
				//vm.mainChart.overrideChart[index].borderColor = vm.corBorda
				//vm.mainChart.overrideChart[index].borderWidth = 1
				vm.mainChart.overrideChart[index].label = `y-axis-${index}`
				//vm.mainChart.overrideChart[index].pointBackgroundColor = vm.corPonto
				//	vm.mainChart.overrideChart[index].pointBorderColor = vm.corBordaPonto
				//vm.mainChart.overrideChart[index].type = `line`
				return vm.mainChart.overrideChart[index]
			}
			vm.addOptionOverrideChart(0)
			//============================================================================================
			//incializa variavel de sistemas
			//============================================================================================
			vm.sistemasReset = function(){
				vm.sistemas = {
					length: 0,
					addElem: function addElem(elem) {
						[].push.call(this, elem);
					},
				}
			}
			vm.sistemasReset()
			vm.sistemas.addElem({
				nome: "Carregando..."
			}
			)

		//============================================================================================
		//Vai para rota especifica
		//============================================================================================
		vm.gotoPage = function(strPath){
			$location.path(strPath)
		}
		//============================================================================================
		//get informações das variaveis modbus
		//============================================================================================
		vm.readModbus = function(indexVar,count){
			const cmdhttp = `${url}modbusread/${vm.objetosDinamicosFilaReqLeitura[indexVar].idMb}/${vm.objetosDinamicosFilaReqLeitura[indexVar].regMb}/2`
			$http.get(cmdhttp).then(function(response){
				vm.componenteLeitura[(indexVar*registroModbusPorComponente)+0] =  response.data[0]
				vm.componenteLeitura[(indexVar*registroModbusPorComponente)+1] =  response.data[1]
				vm.compChanging[count] = 0
				vm.componenteLeituraFcon[(indexVar*registroModbusPorComponente)+0] =  0
				if (response.data.name=="ModbusResponseTimeout") {
					vm.componenteLeituraFcon[(indexVar*registroModbusPorComponente)+0] =  1
				}
			}).catch(function(response){
				vm.componenteLeituraFcon[(indexVar*registroModbusPorComponente)+0] =  1
			})
		}
		//============================================================================================
		//Leitura dos registros modbus
		//============================================================================================
		function readModbusFunc(){
			var sizeObject = lodash.size(vm.objetosDinamicosFilaReqLeitura);
			for (var i = 0; i < sizeObject; i++) {
				vm.readModbus(i, vm.objetosDinamicosFilaReqLeitura[i].count)
			}
		}

		var timerReqModbus //= $interval(readModbusFunc,5000)
		//============================================================================================
		//Escrita nos registro modbus
		//============================================================================================
		vm.writeModbus = function(varState,index,id,count){
			var varStateTemp = varState
			if (varState==1){varStateTemp = 0}else {varStateTemp = 1}
				var cmdhttp = id+"/"+index+"/"+varStateTemp
			vm.compChanging[count] = 1
			$http.get(`${url}modbuswrite/${cmdhttp}`).then(function(response){
			})
		}
		//============================================================================================
		//monta objeto com componentes dinamicamente (reset)
		//============================================================================================
		vm.objetosDinamicosReset = function(){
			vm.objetosDinamicos = {}
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
		vm.objetosDinamicosFilaReset = function(){
			vm.objetosDinamicosFilaReqLeitura = {}
			vm.objetosDinamicosFilaReqLeitura = {
				length: 0,
				addElem: function addElem(elem) {
					[].push.call(this, elem);
				},
			}
		}
		//============================================================================================
		//Adiciona objeto
		//============================================================================================
		vm.adicionarObjHtml = function(type, count, area,idModbusWrite,regModbusWrite,varModbusRead,varChanging,varAct, varFalha, unidade,
			nivelmin, nivelmax,nivelbaixo, nivelalto, fator, bke_tasks, indexComponenteTasks){
				const modelo_luz_incand = 	`
				<luz-incand id= luz_incand${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" acesso="${CONTROLLER}.getUser().acesso"
				></luz-incand>
				`
				const modelo_display = 	`
				<display titulo="${area}" unidade ="${unidade}" dispclique="" valor="${varModbusRead}" fator="${fator}" falha="${varFalha}">
				</display>
				`
				const modelo_indica_led = 	`
				<indica-led area="${area}" lampstate="${varModbusRead}" acionamentos="${varAct}" falha="${varFalha}">
				</indica-led>
				`
				const modelo_irrigacao = 	`
				<irrigacao id= irriga${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" acesso="${CONTROLLER}.getUser().acesso"
				></irrigacao>
				`

				const modelo_display_bar = 	`
				<display-bar id="irriga${count}" titulo="${area}" unidade="${unidade}" valorlabel="${varModbusRead}" valor="${varModbusRead}  | scalegauge:${nivelmax}:${nivelmin}" fator="${fator}" falha="${varFalha}"
				nivelmin="${nivelmin}" nivelmax="${nivelmax}" nivelbaixo="${nivelbaixo}" nivelalto="${nivelalto}"
				>
				</display-bar>
				`
				const modelo_display_gauge = 	`
				<display-gauge titulo="${area}" unidade="${unidade}" valor="${varModbusRead}" fator="${fator}"
				nivelmin="${nivelmin}" nivelmax="${nivelmax}" gatilho="{'0': {color: 'orange'},'${nivelbaixo}': {color: 'green'},'${nivelalto}': {color: 'red'}}" falha="${varFalha}">
				</display-gauge>
				`
				const modelo_botao = 	`
				<botao-obj id= botaoobj${count} area="${area}" lampstate="${varModbusRead}"
				lampwrite="${CONTROLLER}.writeModbus(${varModbusRead},${regModbusWrite},${idModbusWrite},${count})"
				changing = "${varChanging}" acionamentos="${varAct}" falha="${varFalha}" icoon="finger-on.png" icooff="finger-off.png"
				icorefresh="refresh-tr.png" acesso="${CONTROLLER}.getUser().acesso"
				></botao-obj>
				`

				const modelo_task_horario = 	`
				<task-timer ng-click="cfgCtrl.eventsCom($event)" id="${indexComponenteTasks}" titulo="${area}" dados="${bke_tasks}"
				addhoraliga="${CONTROLLER}.addHoraLigaTaskComp()" deletehoraliga="${CONTROLLER}.deleteHoraLigaTaskComp()"
				addhoraligaregistro="${CONTROLLER}.addTagLigaTaskComp()" deletehoraligaregistro="${CONTROLLER}.deleteTagLigaTaskComp()"
				addhoradesliga="${CONTROLLER}.addHoraDesligaTaskComp()" deletehoradesliga="${CONTROLLER}.deleteHoraDesligaTaskComp()"
				addhoradesligaregistro="${CONTROLLER}.addTagDesligaTaskComp()" deletehoradesligaregistro="${CONTROLLER}.deleteTagDesligaTaskComp()"
				confirmaedicao="${CONTROLLER}.confirmaEdicaoComp()">
				</task-timer>
				`
				var modelo
				if (type=='luz-incand') {modelo = modelo_luz_incand}
					if (type=='display') {modelo = modelo_display}
						if (type=='indica-led') {modelo = modelo_indica_led}
							if (type=='irrigacao') {modelo = modelo_irrigacao}
								if (type=='display-bar') {modelo = modelo_display_bar}
									if (type=='display-gauge') {modelo = modelo_display_gauge}
										if (type=='botao-obj') {modelo = modelo_botao}
											if (type=='task-horario') {modelo = modelo_task_horario}

												angular.element(document.getElementById('objetoDinamicoHtml')).append($compile(modelo)($scope));
										}

			//============================================================================================
			//Atualiza compoenentes
			//============================================================================================
			vm.sistemaUpdateComp = function(){
				vm.objetosDinamicosReset()
				vm.objetosDinamicosFilaReset()
				vm.readingComponentes=true
				vm.queryAllcompomentes(vm.sistemaSelecionado.id)


			}
			//============================================================================================
			//Lista todos os sistemas
			//============================================================================================
			vm.updateSistema = function(id){
				querysql.querySistem(id).then(function(response){
					vm.sistemas = (response.data)
					vm.sistemaSelecionado = vm.sistemas[0]
					vm.sistemaUpdateComp()
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
					//if (vm.sistemasById[0].menu1_nome) {vm.menus.push({id:vm.sistemasById[0].menu1_nome})}

					if (vm.sistemasById[0].menu2_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu2_nome})}
						if (vm.sistemasById[0].menu3_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu3_nome})}
							if (vm.sistemasById[0].menu4_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu4_nome})}
								if (vm.sistemasById[0].menu5_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu5_nome})}
									if (vm.sistemasById[0].menu6_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu6_nome})}
										if (vm.sistemasById[0].menu7_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu7_nome})}
											if (vm.sistemasById[0].menu8_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu8_nome})}
												if (vm.sistemasById[0].menu9_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu9_nome})}
													if (vm.sistemasById[0].menu10_nome.length>2) {vm.menus.push({id:vm.sistemasById[0].menu10_nome})}
					//adicionar menus aqui

			})
			}
			//============================================================================================
			//Cria objetos dinamicos
			//============================================================================================
			function createObjetos(componentes){
				vm.objetosDinamicosReset()
				vm.objetosDinamicosFilaReset()
				for (var i = 0; i < vm.componentes.length; i++) {
					vm.objetosDinamicos.addElem({
						tipo:componentes[i].tipo,
						id:componentes[i].id,
						descricao:componentes[i].descricao,
						tipo:componentes[i].tipo,
						device_modbus_write_id:componentes[i].device_modbus_write_id ,
						device_modbus_write_reg:componentes[i].device_modbus_write_reg ,
						device_modbus_write_id_1:componentes[i].device_modbus_write_id_1 ,
						device_modbus_write_reg_1:componentes[i].device_modbus_write_reg_1 ,
						device_modbus_write_id_2:componentes[i].device_modbus_write_id_2 ,
						device_modbus_write_reg_2:componentes[i].device_modbus_write_reg_2 ,
						device_modbus_read_id:componentes[i]. device_modbus_read_id,
						device_modbus_read_reg:componentes[i].device_modbus_read_reg,
						unidade_medida: componentes[i].unidade_medida,
						modulo_plcpi: componentes[i].modulo_plcpi,
						menu_navegacao: componentes[i].menu_navegacao,
						nivel_min: componentes[i].nivel_min,
						nivel_max:componentes[i].nivel_max,
						nivel_alto:componentes[i].nivel_alto,
						nivel_baixo: componentes[i].nivel_baixo,
						fator: parseFloat(componentes[i].fator),
						bke_tasks: 	JSON.parse(componentes[i].bke_tasks),
						log: componentes[i].log,
						sequencia: componentes[i].sequencia,
						visivel: componentes[i].visivel,
						visivelBool: componentes[i].visivel=='1'? true:false,
						nome_tabela_log: componentes[i].nome_tabela_log,
						font_size: componentes[i].font_size,

					});
					//============================================================================================
					//Cria lista para requisição dinamica Modbus
					//============================================================================================
					vm.objetosDinamicosFilaReqLeitura.addElem({
						tipo:componentes[i].tipo ,
						count: vm.countComponent,
						idMb:componentes[i]. device_modbus_read_id,
						regMb:componentes[i].device_modbus_read_reg,
						varResult:"cfgCtrl.componenteLeitura["+vm.countComponent+"]",
						varChanging: "cfgCtrl.compChanging["+vm.countComponent+"]",
						varAct:"cfgCtrl.componenteLeitura["+(vm.countComponent+1)+"]",
						varFalha: "cfgCtrl.componenteLeituraFcon["+vm.countComponent+"]",
						unidade_medida:componentes[i].unidade_medida,
						fator: parseFloat(componentes[i].fator),
						bke_tasks: "cfgCtrl.objetosDinamicos["+(vm.countComponent/2)+"].bke_tasks",
						log: componentes[i].log

					});
					//============================================================================================
					//Adiciona objeto em tela
					//============================================================================================
					vm.adicionarObjHtml(vm.objetosDinamicos[i].tipo, vm.countComponent, vm.objetosDinamicos[i].descricao,vm.objetosDinamicos[i].device_modbus_write_id,
						vm.objetosDinamicos[i].device_modbus_write_reg, vm.objetosDinamicosFilaReqLeitura[i].varResult, vm.objetosDinamicosFilaReqLeitura[i].varChanging,
						vm.objetosDinamicosFilaReqLeitura[i].varAct, vm.objetosDinamicosFilaReqLeitura[i].varFalha,componentes[i].unidade_medida,
						componentes[i].nivel_min,componentes[i].nivel_max, componentes[i].nivel_baixo,componentes[i].nivel_alto,
						parseFloat(componentes[i].fator), vm.objetosDinamicosFilaReqLeitura[i].bke_tasks, indexComponenteTasks,vm.objetosDinamicos[i].visivel
						)
					//============================================================================================
					//Determina o numero de dados por compoente (ex: 2 = 2 registros modbus)
					//============================================================================================
					vm.countComponent = vm.countComponent+ registroModbusPorComponente
					indexComponenteTasks++
					vm.objetosDinamicosLen = lodash.size(vm.objetosDinamicos);
				}
			}
			//============================================================================================
			//Lista todos os componentes
			//============================================================================================
			vm.queryAllcompomentes = function(idSistema){

				const cmdSql= "SELECT * FROM config_compontes WHERE id_sistema = "+ idSistema +" ORDER BY menu_navegacao ASC"
				querysql.queryMysqlGetPost(cmdSql).then(function(response){
					vm.componentes = (response.data)
					vm.readingComponentes = false
					UPDATE_COMP_MS = vm.componentes.length > 0 ? vm.componentes.length * consts.tempoCommPorComp : 1500
					createObjetos(vm.componentes)

				})

			}
			//============================================================================================
			//Filtra componentes para visualização
			//============================================================================================
			vm.searchComponente = function(){

				const cmdSql= "SELECT * FROM config_compontes WHERE LOCATE('"+ vm.searchComponenteValue+"',"+ vm.selecFilterComponente+") ORDER BY menu_navegacao ASC"
				querysql.queryMysqlGetPost(cmdSql).then(function(response){
					vm.componentes = response.data
					createObjetos(vm.componentes)
				})

			}

			//============================================================================================
			//Incluir componente
			//============================================================================================
			vm.componenteNovo = function(){
				vm.iscomponente_new = true
				vm.iscomponente_edit = false
				vm.querySistema(ID_SISTEMA_USER)
				vm.componente_bke = vm.compTasksModel
				vm.initChart()
				vm.componente_device_modbus_write_id = 0
				vm.componente_device_modbus_write_reg = 0
				vm.componente_device_modbus_read_id = 0
				vm.componente_device_modbus_read_reg  = 0
			}
			//============================================================================================
			//Cancelar componente
			//============================================================================================
			vm.componenteCancelar = function(){
				//$window.location.reload()
				vm.objetoDinamicoHtmlReset()
				vm.iscomponente_new = false
				vm.iscomponente_edit = false
				vm.componente_alarme = tipicoAlm
				vm.sistemaUpdateComp()
			}

			//============================================================================================
			//Incluir compoemente
			//============================================================================================
			vm.componenteIncluir = function(){
				vm.searchComponenteValue = ''
				var templateParameterChart = {
					modo:'',
					dataInicial:moment(),
					dataFinal:moment(),
					periodo:'',
					resolucao:''
				}

				if (vm.componente_tipo=='chart') {
					vm.componente_alarme_telegram = ""
					//++++++++++++++++++++++++++++++++++++++++++++++++++++++
					//Validações
					//++++++++++++++++++++++++++++++++++++++++++++++++++++++
					if (typeof(vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString) == 'undefined') {
						msgs.addError('O label do eixo X deve ser preenchido')
						return
					}
					if (vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString.length<1) {
						msgs.addError('O label do eixo X deve ser preenchido')
						return
					}
					if (!vm.mainChart.optionsChart.scales.yAxes[0]) {
						msgs.addError('O label do eixo Y deve ser preenchido ou pelo menos uma série deve ser criada')
						return
					}
					if (vm.mainChart.optionsChart.scales.yAxes[0].scaleLabel.labelString.length<1) {
						msgs.addError('O label do eixo Y deve ser preenchido')
						return
					}
					for (var i = 0; i < vm.mainChart.optionsChart.config.series.length; i++) {
						if (vm.mainChart.optionsChart.config.series[i].nome.bke_tasks) vm.mainChart.optionsChart.config.series[i].nome.bke_tasks = ''
						if (vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes) vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes = ''
						if(vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes_telegram) vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes_telegram = ''
						if(vm.mainChart.optionsChart.config.series[i].nome.parameters) vm.mainChart.optionsChart.config.series[i].nome.parameters = ''
							}
						vm.componente_bke = vm.mainChart
						vm.componente_log = false
						vm.componente_mudanca_estado = false
				}else{
					templateParameterChart = {}
				}

					if (!vm.componente_fator) {
						vm.componente_fator = 1
					}

					if(vm.componente_alarme_telegram.bot){
						vm.componente_alarme_telegram.bot = JSON.parse(vm.componente_alarme_telegram.bot)
					}

					if (vm.componente_tipo=='fita-rgb') {
						vm.componente_device_modbus_read_id = vm.componente_device_modbus_write_id
						vm.componente_device_modbus_read_reg = vm.componente_device_modbus_write_reg
					}

					if (vm.componente_descricao && !isNaN(vm.componente_device_modbus_write_id &&
						!isNaN(vm.componente_device_modbus_write_reg)&& !isNaN(vm.componente_device_modbus_read_id) &&
						!isNaN(vm.componente_device_modbus_read_reg))){
									
						const cmdSql= "INSERT INTO config_compontes ("+
						"id_sistema, "+
						"descricao, "+
						"device_modbus_write_id, "+
						"device_modbus_write_reg, "+
						"device_modbus_write_id_1, "+
						"device_modbus_write_reg_1, "+
						"device_modbus_write_id_2, "+
						"device_modbus_write_reg_2, "+
						"device_modbus_read_id, "+
						"device_modbus_read_reg, "+
						"tipo, "+
						"modulo_plcpi, "+
						"unidade_medida, "+
						"unidade_medida_temp, "+
						"menu_navegacao, "+
						"nivel_min, "+
						"nivel_max, "+
						"nivel_alto, "+
						"nivel_baixo, "+
						"bke_tasks, "+
						"fator ,"+
						"log, "+
						"mudanca_estado, "+
						"log_tempo,"+
						"banda_morta,"+
						"sequencia,"+
						"visivel,"+
						"icoon,"+
						"icooff,"+
						"imagesize,"+
						"font_size,"+
						"imagetop,"+
						"tamanho,"+
						"parameters,"+
						"bke_alarmes,"+
						"bke_alarmes_telegram"+

						") "+
						"VALUES ('"+
						vm.sistemaSelecionado.id +"','"+
						vm.componente_descricao +"','"+
						vm.componente_device_modbus_write_id +"','"+
						vm.componente_device_modbus_write_reg +"','"+
						vm.componente_device_modbus_write_id_1 +"','"+
						vm.componente_device_modbus_write_reg_1 +"','"+
						vm.componente_device_modbus_write_id_2 +"','"+
						vm.componente_device_modbus_write_reg_2 +"','"+
						vm.componente_device_modbus_read_id+"','"+
						vm.componente_device_modbus_read_reg+"','"+
						vm.componente_tipo+"','"+
						vm.componente_modulo_plcpi+"','"+
						vm.componente_unidade_medida+"','"+
						vm.componente_unidade_medida_temp+"','"+
						vm.menu_default.id+"','"+
						vm.componente_nivel_min+"','"+
						vm.componente_nivel_max+"','"+
						vm.componente_nivel_alto+"','"+
						vm.componente_nivel_baixo+"','"+
						JSON.stringify(vm.componente_bke)+"','"+
						vm.componente_fator +"','"+
						((vm.componente_log==true) ? 1 : 0)+"','"+
						((vm.componente_mudanca_estado==true) ? 1 : 0)+"','"+
						((vm.componente_log_tempo == 'null') ? 0 : vm.componente_log_tempo) +"','"+
						((vm.componente_banda_morta == 'null') ? 0 : vm.componente_banda_morta) +"','"+
						vm.componente_sequencia +"','"+
						vm.componente_visivel +"','"+
						vm.pathImagemObjetoOn +"','"+
						vm.pathImagemObjetoOff +"','"+
						vm.imagesize +"','"+
						vm.font_size +"','"+
						vm.imagetop +"','"+
						vm.componente_tamanho +"','"+
						JSON.stringify(templateParameterChart)+"','"+
						JSON.stringify(vm.componente_alarme)+"','"+
						JSON.stringify(vm.componente_alarme_telegram)+"')"

						querysql.queryMysqlNewComp(cmdSql, vm.componente_log).then(function(response){
							if (response.data.affectedRows==1) {
								msgs.addSuccess('Registro adicionado')
								vm.componenteCancelar()

							} else {
								msgs.addError('Falha na gravação no banco! '+ response.data.sqlMessage)
							}

						})

					}else {
						msgs.addError('Ops! :( este campo não pode ser nulo ou inválido!')
					}
				}
				//============================================================================================
				//Editar componente
				//============================================================================================
				vm.componenteEditar = function(index){

					vm.componente_bke = JSON.parse(vm.componentes[index].bke_tasks)
					vm.componente_alarme= JSON.parse(vm.componentes[index].bke_alarmes)
					if (vm.componentes[index].bke_alarmes_telegram) {
						vm.componente_alarme_telegram= JSON.parse(vm.componentes[index].bke_alarmes_telegram)
					}
					if (vm.componente_alarme_telegram) {
						vm.componente_alarme_telegram.bot = JSON.stringify(vm.componente_alarme_telegram.bot)
					}

					if (vm.objetosDinamicos[index].tipo=='chart') {
						vm.mainChart = vm.componente_bke
						vm.componente_log = false
						vm.componente_alarme = ''
					}
					if (lodash.size(vm.compoente_bke)<1) {
						vm.compoente_bke = vm.compTasksModel
					}
					vm.iscomponente_new = false
					vm.iscomponente_edit = true
					vm.componente_descricao = vm.objetosDinamicos[index].descricao
					vm.componente_tipo = vm.objetosDinamicos[index].tipo
					vm.componente_device_modbus_write_id = vm.objetosDinamicos[index].device_modbus_write_id ? vm.objetosDinamicos[index].device_modbus_write_id.toString() : 0
					vm.componente_device_modbus_write_reg = vm.objetosDinamicos[index].device_modbus_write_reg ? vm.objetosDinamicos[index].device_modbus_write_reg.toString() : 0
					vm.componente_device_modbus_write_id_1 = vm.objetosDinamicos[index].device_modbus_write_id_1 ? vm.objetosDinamicos[index].device_modbus_write_id_1.toString() : 0
					vm.componente_device_modbus_write_reg_1 = vm.objetosDinamicos[index].device_modbus_write_reg_1 ? vm.objetosDinamicos[index].device_modbus_write_reg_1.toString() : 0
					vm.componente_device_modbus_write_id_2 = vm.objetosDinamicos[index].device_modbus_write_id_2 ? vm.objetosDinamicos[index].device_modbus_write_id_2.toString() : 0
					vm.componente_device_modbus_write_reg_2 = vm.objetosDinamicos[index].device_modbus_write_reg_2 ? vm.objetosDinamicos[index].device_modbus_write_reg_2.toString() : 0
					vm.componente_device_modbus_read_id = vm.objetosDinamicos[index].device_modbus_read_id ? vm.objetosDinamicos[index].device_modbus_read_id.toString() : 0
					vm.componente_device_modbus_read_reg  = vm.objetosDinamicos[index].device_modbus_read_reg ? vm.objetosDinamicos[index].device_modbus_read_reg.toString() : 0

					vm.componente_modulo_plcpi = vm.componentes[index].modulo_plcpi
					vm.componente_unidade_medida = vm.componentes[index].unidade_medida
					vm.componente_unidade_medida_temp = vm.componentes[index].unidade_medida_temp
					vm.menu_default.id = vm.componentes[index].menu_navegacao

					vm.componente_nivel_min = vm.componentes[index].nivel_min
					vm.componente_nivel_max = vm.componentes[index].nivel_max
					vm.componente_nivel_alto = vm.componentes[index].nivel_alto
					vm.componente_nivel_baixo = vm.componentes[index].nivel_baixo
					vm.componente_fator = parseFloat(vm.componentes[index].fator)
					vm.componente_log = vm.componentes[index].log == 1 ? true : false
					vm.componente_mudanca_estado = vm.componentes[index].mudanca_estado == 1 ? true : false
					vm.componente_log_tempo = vm.componentes[index].log_tempo
					vm.componente_banda_morta = vm.componentes[index].banda_morta
					vm.componente_sequencia = vm.componentes[index].sequencia
					vm.componente_visivel = vm.componentes[index].visivel
					vm.pathImagemObjetoOn = vm.componentes[index].icoon
					vm.pathImagemObjetoOff = vm.componentes[index].icooff
					vm.imagesize = parseInt(vm.componentes[index].imagesize)
					vm.imagetop = parseInt(vm.componentes[index].imagetop)
					vm.componente_tamanho = vm.componentes[index].tamanho
					vm.font_size = parseInt(vm.componentes[index].font_size)

					vm.indexEditComponente = index
					vm.querySistema(ID_SISTEMA_USER)
				}

				//============================================================================================
				//Confirma edição de registro de componentes
				//============================================================================================
				vm.componenteEditarConfirma = function(){
					if (!vm.componente_fator) {
						vm.componente_fator = 1
					}
					if (vm.componente_tipo=='chart') {

						vm.componente_alarme_telegram = ""
						//++++++++++++++++++++++++++++++++++++++++++++++++++++++
						//Validações
						//++++++++++++++++++++++++++++++++++++++++++++++++++++++
						if (typeof(vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString) == 'undefined') {
							msgs.addError('O label do eixo X deve ser preenchido')
							return
						}
						if (vm.mainChart.optionsChart.scales.xAxes[0].scaleLabel.labelString.length<1) {
							msgs.addError('O label do eixo X deve ser preenchido')
							return
						}
						if (!vm.mainChart.optionsChart.scales.yAxes[0]) {
							msgs.addError('O label do eixo Y deve ser preenchido ou pelo menos uma série deve ser criada')
							return
						}
						if (vm.mainChart.optionsChart.scales.yAxes[0].scaleLabel.labelString.length<1) {
							msgs.addError('O label do eixo Y deve ser preenchido')
							return
						}

						for (var i = 0; i < vm.mainChart.optionsChart.config.series.length; i++) {
							if (vm.mainChart.optionsChart.config.series[i].nome.bke_tasks) vm.mainChart.optionsChart.config.series[i].nome.bke_tasks = ''
								if (vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes) vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes = ''
									if (vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes_telegram) vm.mainChart.optionsChart.config.series[i].nome.bke_alarmes_telegram = ''
									if (vm.mainChart.optionsChart.config.series[i].nome.parameters) vm.mainChart.optionsChart.config.series[i].nome.parameters = ''
								}
							vm.componente_bke = vm.mainChart


						}

						if(vm.componente_alarme_telegram.bot){
							if (typeof vm.componente_alarme_telegram.bot == "string") {
								vm.componente_alarme_telegram.bot = JSON.parse(vm.componente_alarme_telegram.bot)
							}
						}

						if (vm.componente_tipo=='fita-rgb') {
							vm.componente_device_modbus_read_id = vm.componente_device_modbus_write_id
							vm.componente_device_modbus_read_reg = vm.componente_device_modbus_write_reg
						}

						vm.searchComponenteValue = ''
						const cmdSql=  "UPDATE config_compontes SET "+
						"descricao='" + vm.componente_descricao + "' " +
						",device_modbus_write_id='" + vm.componente_device_modbus_write_id  + "' " +
						",device_modbus_write_reg='" + vm.componente_device_modbus_write_reg + "' " +
						",device_modbus_write_id_1='" + vm.componente_device_modbus_write_id_1  + "' " +
						",device_modbus_write_reg_1='" + vm.componente_device_modbus_write_reg_1 + "' " +
						",device_modbus_write_id_2='" + vm.componente_device_modbus_write_id_2  + "' " +
						",device_modbus_write_reg_2='" + vm.componente_device_modbus_write_reg_2 + "' " +
						",device_modbus_read_id='" + vm.componente_device_modbus_read_id + "' " +
						",device_modbus_read_reg='" + vm.componente_device_modbus_read_reg + "' " +
						",tipo='" + vm.componente_tipo + "' " +
						",modulo_plcpi='" + vm.componente_modulo_plcpi + "' " +
						",unidade_medida='" + vm.componente_unidade_medida + "' " +
						",unidade_medida_temp='" + vm.componente_unidade_medida_temp + "' " +
						",menu_navegacao='" + vm.menu_default.id+ "' " +
						",nivel_min='" + vm.componente_nivel_min+ "' " +
						",nivel_max='" + vm.componente_nivel_max+ "' " +
						",nivel_baixo='" + vm.componente_nivel_baixo+ "' " +
						",nivel_alto='" + vm.componente_nivel_alto+ "' " +
						",fator='" + vm.componente_fator+ "' " +
						",bke_tasks='"+JSON.stringify(vm.componente_bke)+ "' " +
						",log='"+((vm.componente_log==true) ? 1 : 0) + "' " +
						",mudanca_estado='"+((vm.componente_mudanca_estado==true) ? 1 : 0) + "' " +
						",log_tempo='"+ ((vm.componente_log_tempo == 'null') ? 0 : vm.componente_log_tempo) + "' " +
						",banda_morta='"+ ((vm.componente_banda_morta == 'null') ? 0 : vm.componente_banda_morta) + "' " +
						",sequencia='"+ vm.componente_sequencia + "' " +
						",visivel='"+ vm.componente_visivel + "' " +
						",icoon='"+ vm.pathImagemObjetoOn + "' " +
						",icooff='"+ vm.pathImagemObjetoOff + "' " +
						",imagesize='"+ vm.imagesize + "' " +
						",imagetop='"+ vm.imagetop+ "' " +
						",bke_alarmes='"+ JSON.stringify(vm.componente_alarme) + "' " +
						",tamanho='"+ vm.componente_tamanho + "' " +
						",font_size='"+ vm.font_size + "' " +
						",bke_alarmes_telegram='"+ JSON.stringify(vm.componente_alarme_telegram) +"' "+

						"WHERE id = '"+ vm.objetosDinamicos[vm.indexEditComponente].id +"'"

					querysql.queryMysqlNewComp(cmdSql, vm.componente_log, `log${vm.objetosDinamicos[vm.indexEditComponente].id}`).then(function(response){
						if (response.data.affectedRows==1) {
							msgs.addSuccess('Registro atualizado')
							vm.componenteCancelar()

						} else if(response.data.affectedRows==0) {
							msgs.addError('O registro nao sofreu nenhuma alteração')
						}
						else {

							msgs.addError('Falha na gravação no banco! '+ response.data.sqlMessage)
						}

					})
				}
				//============================================================================================
				//Delete componente
				//============================================================================================
				vm.componenteDelete = function(index){
					var cmdSql = "DELETE FROM config_compontes WHERE id = '"+ vm.componentes[index].id +"'"
					var tableName = `log_${vm.componentes[index].id }`
					querysql.queryMysqlInsertPostDeleteComp(cmdSql,tableName).then(function(response){
						msgs.addSuccess('Componente removido!')
						vm.componenteCancelar()
					}).catch(function(response){
						msgs.addError('Problemas na exclusão dos dados!')
					})
					cmdSql = "DELETE FROM alarmes WHERE id_componente = '"+ vm.componentes[index].id +"'"
					querysql.queryGeral(cmdSql).then(function(response){
						vm.componenteCancelar()
					}).catch(function(response){
						msgs.addError('Problemas na exclusão dos alarmes!')
					})
				}

				//============================================================================================
				//Clonar objeto
				//============================================================================================
				vm.componenteClonar = function(index){
					var camposTabela = `
					id_sistema,descricao,device_modbus_write_id,device_modbus_write_reg,device_modbus_read_id,device_modbus_read_reg,tipo,modulo_plcpi,unidade_medida,menu_navegacao,nivel_min,nivel_max,nivel_alto,nivel_baixo,fator,bke_tasks,log,log_tempo,sequencia,visivel,bke_alarmes,icoon,icooff,imagesize,imagetop,parameters,unidade_medida_temp,ultimo_valor,cor_normal,cor_baixo,cor_alto,tamanho,font_size,
					device_modbus_write_id_1,device_modbus_write_reg_1,device_modbus_write_id_2,device_modbus_write_reg_2,banda_morta
					`
					var cmdSql = `INSERT INTO config_compontes (${camposTabela}) SELECT ${camposTabela} FROM config_compontes WHERE id=${vm.componentes[index].id}`
					querysql.queryGeral(cmdSql).then(function(response){
						msgs.addSuccess('Componente clonado com sucesso! :)')
						vm.componenteCancelar()
					}).catch(function(response){
						msgs.addError('Não foi possível clonar o componente')
					})
				}

			//============================================================================================
			//Abre modal configuração  de  período para limpar dados.
			//============================================================================================
			vm.popConfigDate = function (size,index) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configuracoes/popConfigDate.html',
					controller: 'popConfigDate',
					controllerAs: $scope,
					size: size,
					resolve: {
						nome_tabela_log: function(){return {nome_tabela_log:vm.componentes[index].nome_tabela_log}},
						textoPopUp: function(){return {textoPopUp: 'Período para apagar'}}
					}
				});
				modalInstance.result.then(function(response){
					if (response) {
						
						var cmdSql = `DELETE FROM ${response.tabela.nome_tabela_log} WHERE timestamp>='${moment(response.dataInicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp<='${moment(response.dataFinal).format('YYYY-MM-DD HH:mm:ss')}'`
						vm.waitResponseDatabase = []
						vm.waitResponseDatabase[index] = true
						querysql.queryGeral(cmdSql).then(function(response){
							if (response.data.affectedRows>0) {
								msgs.addSuccess(`${response.data.affectedRows} registros apagados: `)
								vm.waitResponseDatabase[index] = false
							} else if(response.data.affectedRows==0) {
								msgs.addError('A tabela não sofreu nenhuma alteração')
								vm.waitResponseDatabase[index] = false
							}
							else {
								msgs.addError('Falha na gravação no banco! '+ response.data.sqlMessage)
								vm.waitResponseDatabase[index] = false
							}
						})
					}
				})
			}


			//============================================================================================
			//Abre modal configuração  de  período para salvar
			//============================================================================================
			vm.popConfigDateToSave = function (size,index) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configuracoes/popConfigDate.html',
					controller: 'popConfigDate',
					controllerAs: $scope,
					size: size,
					resolve: {
						nome_tabela_log: function(){return {nome_tabela_log:vm.componentes[index].nome_tabela_log}},
						textoPopUp: function(){return {textoPopUp: 'Período para salvar'}}
					}
				});
				modalInstance.result.then(function(response){
					if (response) {
						
						var cmdSql = `SELECT * FROM ${response.tabela.nome_tabela_log} WHERE timestamp>='${moment(response.dataInicial).format('YYYY-MM-DD HH:mm:ss')}' AND timestamp<='${moment(response.dataFinal).format('YYYY-MM-DD HH:mm:ss')}'`
						vm.waitResponseDatabase = []
						vm.waitResponseDatabase[index] = true
						querysql.queryGeral(cmdSql).then(function(response){
							vm.waitResponseDatabase[index] = false
							vm.xlsExportDatabase('backup', response.data)

						})
					}
				})
			}


				//============================================================================================
				//Função exportar alarmes para xls
				//============================================================================================
				vm.xlsExportDatabase = function (tableName, tableData) {
					var objectToExport = []
					for (var i = 0; i < tableData.length; i++) {
						objectToExport.push({
							"id": tableData[i].id,
							"timestamp": moment(tableData[i].timestamp).format("DD/MM/YYYY HH:mm:ss"),
							"descricao": tableData[i].descricao,
							"valor": tableData[i].valor
						})

					}
					alasql(`SELECT * INTO XLSX("${tableName}.xlsx",{headers:true}) FROM ?`,[objectToExport]);
				}

				//============================================================================================
				//Função informação da tabela de log
				//============================================================================================
				vm.infoTablesLogs = function(index){
					var dadosTabelas; 

					vm.waitResponseDatabase = []
					vm.waitResponseDatabase[index] = true					
					var cmdSql = `
						OPTIMIZE TABLE ${vm.componentes[index].nome_tabela_log};
					`   
					querysql.queryGeral(cmdSql).then(function(response){
						cmdSql = `
							SELECT 	table_name AS 'Table', 
							round(((data_length + index_length) / 1024 / 1024), 2) 'sizeMB' 
							FROM information_schema.TABLES 
							WHERE table_schema = "iot"
							AND table_name = "${vm.componentes[index].nome_tabela_log}";
						`   
						querysql.queryGeral(cmdSql).then(function(response){
							dadosTabelas = response.data
							cmdSql = `
								SELECT table_schema "database",
								        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) "sizeMB" 
								FROM information_schema.tables 
								GROUP BY table_schema; 
								`   
							querysql.queryGeral(cmdSql).then(function(response){
								vm.popInfos(dadosTabelas, response.data[1])
								vm.waitResponseDatabase[index] = false
							})
						})	
					}).catch(function(err){
						msgs.addError('Não foi possível conectar ao  servidor')
						vm.waitResponseDatabase[index] = false
					})

				}


			//============================================================================================
			//Abre modal Infos
			//============================================================================================
			vm.popInfos = function (infos, infosDatabase) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configuracoes/popInfos.html',
					controller: 'popInfos',
					controllerAs: $scope,
					size: 'md',
					resolve: {
						infos: function(){return infos},
						infosDatabase: function(){return infosDatabase},
						textoPopUp: function(){return 'Informações'}
					}
				});
				modalInstance.result.then(function(response){

				})
			}
							
			//============================================================================================
			//Incluir sistema
			//============================================================================================
			vm.sistemaNovo = function(){
				vm.is_sistema_new = true
				vm.is_sistema_edit = false
			}
			//============================================================================================
			//Cancelar sistema
			//============================================================================================
			vm.sistemaCancelar = function(){
				vm.is_sistema_new = false
				vm.is_sistema_edit = false
			}
			//============================================================================================
			//Editar sistema
			//============================================================================================
			vm.sistemaEditar = function(){
				vm.is_sistema_new = false
				vm.is_sistema_edit = true
			}
			//============================================================================================
			//Incluir sistema
			//============================================================================================
			vm.sistemaIncluir = function(){
				if (vm.sistema_nome){
					const cmdSql= "INSERT INTO config_sistema ("+
					"nome"+
					") "+
					"VALUES ('"+
					vm.sistema_nome +
					"')"
					querysql.queryMysqlGetPost(cmdSql).then(function(response){
						if (response.data.affectedRows==1) {
							msgs.addSuccess('Registro adicionado')
							//vm.queryAllsistemas()
							vm.updateSistema(vm.getUser().id_sistema)
						} else {
							msgs.addError('Falha na gravação no banco! '+ response.data.sqlMessage)
						}

					})

				}else {
					msgs.addError('Ops! :( este campo não pode ser nulo!')
				}
			}

			//============================================================================================
			//Abre modal Infos
			//============================================================================================
			vm.popImportCsv = function (index) {
				var modalInstance = $uibModal.open({
					templateUrl: '/_configuracoes/popImportCsv.html',
					controller: 'popimportcsv',
					controllerAs: $scope,
					size: 'md',
					resolve: {
						tableName: function(){return vm.componentes[index].nome_tabela_log},
						textoPopUp: function(){return 'Impotar dados CSV para tabela de log'},
						objectName: function(){return vm.componentes[index].descricao},

					}
				});
				modalInstance.result.then(function(response){

				})
			}	

			vm.updateSistema(vm.getUser().id_sistema)
			})//end getuser----------------------------------
			
		
		

		}//end function------------------------------------
	})()
