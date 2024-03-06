(function() {
	angular.module('intechApp').factory('generalfunc', [

		generalfunc
	])

	function generalfunc() {
		//============================================================================================
		//Ajusta dados recebidos da consulta - Labels eixo X
		//============================================================================================
		function adjustLabel (data, resolucao){
			var labels = []
			for (var i = 0; i < data.length; i++) {
				if (resolucao==1) {
					labels[i] = moment(data[i].timestamp).utcOffset(-180).format("HH:mm:ss");
				}
				if (resolucao==60) {
					labels[i] = moment(data[i].timestamp).utcOffset(-180).format("HH:mm");
				}
				if (resolucao==3600) {
					labels[i] = moment(data[i].timestamp).utcOffset(-180).format("DD/MM/YY HH:mm");
				}
				if (resolucao==1440) {
					labels[i] = moment(data[i].timestamp).utcOffset(-180).format("DD/MM/YY HH:mm");
				}
				if (resolucao==10080) {
					labels[i] = moment(data[i].timestamp).utcOffset(-180).format("DD/MM/YY HH:mm");
				}
			}
			return labels

		}

		//============================================================================================
		//Ajusta dados recebidos da consulta
		//============================================================================================
		function adjustPeriod(periodo){
			var dateDiff
			switch(periodo) {
				case "ultima-hora": dateDiff = moment().subtract(60,'minutes').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultimo-dia": dateDiff = moment().subtract(1,'days').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultima-semana": dateDiff = moment().subtract(1,'weeks').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultimo-mes": dateDiff = moment().subtract(1,'months').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultimo-3-meses": dateDiff = moment().subtract(3,'months').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultimo-6-meses": dateDiff = moment().subtract(6,'months').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultimo-9-meses": dateDiff = moment().subtract(9,'months').format('YYYY-MM-DD HH:mm:ss')
				break;
				case "ultimo-12-meses": dateDiff = moment().subtract(12,'months').format('YYYY-MM-DD HH:mm:ss')
				break;
				default:console.log('Sem seleção de período no componente chart');
			}
			return dateDiff
		}
		//============================================================================================
		//Toca arquivo  de audio
		//============================================================================================
		function playAudio(song) {
        	var audio = new Audio(`/assets/song/${song}`);
        	audio.play();
    		}
		//============================================================================================
		//Ramdom array do chart
		//============================================================================================
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





			return {adjustLabel,adjustPeriod, playAudio, ramdomArray}
		}

	})()
