angular.module('filtros', [])
.filter('numberFixedLen', function () {
  return function (n, len) {
    var num = parseInt(n, 10)
    len = parseInt(len, 10)
    if (isNaN(num) || isNaN(len)) {
      return n
    }
    num = ''+num
    while (num.length < len) {
      num = '0'+num
    }
    return num
  }
})

angular.module('filtrosgauge', [])
.filter('scalegauge', function () {
  return function (value,maxin, minin) {
    var valueN = parseInt(value, 10)
    var maxinN = parseInt(maxin, 10)
    var mininN = parseInt(minin, 10)
    var num  = (valueN*100)/maxin

    return num.toFixed(1)
  }
})

angular.module('filtros', [])
.filter('acesso', function () {
  return function (value) {
    var valueN = parseInt(value, 10)
    if (valueN ==0){return 'Administrador Master'}
    if (valueN ==1){return 'Administrador Local'}
    if (valueN ==2){return 'Operador'}
    if (valueN ==3){return 'Convidado'}
  }
})

angular.module('filtrosmodulo', [])
.filter('tipomodulo', function () {
  return function (value) {
    var valueN = parseInt(value, 10)
    if (valueN ==0){return 'Controlador - INPI-CPU'}
    else if (valueN ==1){return '2 entradas digitais 2 entradas analógicas 2 saídas digitais - INPI-CPU'}
    else if (valueN ==2){return '8 entradas digitais - INPI-INP-8DI'}
    else if (valueN ==3){return '4 saídas digitais - INPI-OUT-4DO-REL'}
    else if (valueN ==4){return '4 entradas analógicas - INPI-INA-4AI'}
    else if (valueN ==5){return '8 saídas digitais triac - INPI-OUT-8DO-TRI'}
    else if (valueN ==6){return '8 saídas digitais transistor - INPI-OUT-8DO-TRA'}
    else if (valueN ==7){return '4 saídas analógicas - INPI-OUT-4AO'}
    else {return 'Desconhecido'}
  }
})

angular.module('convertUTC3', [])
.filter('utcBrasil', function () {
  return function (date) {
    moment.locale('pt-br')
    const dateConvert = moment(date).format('dddd, D [de] MMMM [de] YYYY')
    return dateConvert
  }
})

angular.module('convertUTC3sql', [])
.filter('utcBrasilsql', function () {
  return function (date) {
    moment.locale('pt-br')
    const dateConvert = moment(date).format('YYYY-MM-DD hh:mm:ss')
    return dateConvert
  }
})

angular.module('convertUTC3Short', [])
.filter('utcBrasilShortDate', function () {
  return function (date) {
    moment.locale('pt-br')
    const dateConvert = moment(date).format('DD/MM/YYYY HH:mm:ss')
    return dateConvert
  }
})
angular.module('convertDaysAgo', [])
.filter('daysAgo', function () {
  return function (date) {
    moment.locale('pt-br')
    var now = moment(new Date()); //todays date
    var end = moment(date); // another date
    var duration = moment.duration(now.diff(end));
    var days = duration.asDays();
    return Math.round(days)
  }
})

angular.module('diferenceDates', [])
.filter('dateDays', function () {
  return function (datein,dateout) {
    moment.locale('pt-br')
    var datainMoment = moment(datein); //todays date
    var dataoutMoment = moment(dateout); // another date
    var duration = moment.duration(dataoutMoment.diff(datainMoment));
    var durationFinal = duration.asSeconds();
    if (durationFinal<60){return `${durationFinal} segundos`}
    if (durationFinal>=60 && durationFinal<3600 ){return `${(durationFinal/60).toFixed(1)} minutos`}
    if (durationFinal>=3600 && durationFinal<86400 ){return `${(durationFinal/3600).toFixed(1)} horas`}
    if (durationFinal>=86400 && durationFinal<2592000 ){return `${(durationFinal/86400).toFixed(1)} dias`}
    if (durationFinal>=2592000 && durationFinal<31104000 ){return `${(durationFinal/2592000).toFixed(1)} meses`}
    if (durationFinal>=31104000){return `${(durationFinal/31104000).toFixed(1)} anos`}
  }
})

