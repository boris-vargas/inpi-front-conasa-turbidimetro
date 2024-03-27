angular.module('intechApp').constant('consts', {
  appName: 'Portal in-Tech Pardal\'s',
  version: '1.0',
  vsoftware: '1.2.1', //versão do front
  vfirmware: '1.2.1', //versão do back
  vFolder:'.',
  owner: 'sirob',
  year: '2017',
  site: 'http://www.intech-automacao.com.br',
  apiUrl: '',
  oapiUrl: '',
  noderedUrl: '',
  idSistema: 8,
  tempoCommPorComp: 150,
  retryModbusCom: 10,
  userKey: '(*&¨%$%¨&*(*&¨%$%¨&*()(*&¨%)))',
  addressFileGeneral: "/var/www/html/assets/imgs/general", 
  addressFileObjects: "/var/www/html/assets/imgs/objects",
  // addressFileGeneral: "C:/Users/boris/Dropbox/000 - Pessoal/000 - Boris/000 - Projetos/099 - in-Tech/002 - Telemetria IoT/000 - inWeb/front-v2.1/public/assets/imgs/general",
  // addressFileObjects: "C:/Users/boris/Dropbox/000 - Pessoal/000 - Boris/000 - Projetos/099 - in-Tech/002 - Telemetria IoT/000 - inWeb/front-v2.1/public/assets/imgs/objects",
  optionChart : `
  {
    "responsive":true,
    "animation": {
      "duration":10
    },
    "legend": {
      "reverse":false,
      "position": "top",
      "display": false,
      "labels": {
        "fontColor": "rgb(128, 128, 128)",
        "boxWidth": 15
      }
    },
    "scales": {
      "xAxes": [{
        "gridLines": {
          "display":false
        },
        "scaleLabel": {
          "display": false,
          "labelString": "Legenda X"
        },
        "ticks": {
          "display":false
        }
      }],
      "yAxes": []
      },
      "pan": {
        "enabled": true,
        "mode": "x",
        "speed": 10,
        "threshold": 10
      },
      "zoom": {
        "enabled": true,
        "drag": false,
        "mode": "xy",
        "limits": {
            "max": 10,
            "min": 0.5
      }
    }  


  }
  `,
  addYChart : 	`{
      "id": "y-axis-1",
      "type": "linear",
      "display": false,
      "position": "left",
      "gridLines" : {
        "display":false
      },
      "ticks": {
        "beginAtZero":true,
        "suggestedMin": 0,
        "suggestedMax": 120
      },
      "scaleLabel": {
        "display": false,
        "labelString": "none"
      }
    }
    `,
    overrideChart  : `
          {
            "yAxisID": "y-axis-0",
            "type": "line",
            "label": "indefinido",
            "borderWidth": 1,
            "backgroundColor": "rgba(255, 159, 64, 0.2)",
            "borderColor":"rgba(255, 159, 64, 0.3)",
            "pointBackgroundColor":"rgba(255, 159, 64, 0.5)",
            "pointBorderColor": "rgba(255, 255, 255, 1)",
            "lineTension": 0.4
          }
    `
}).run(['$rootScope', 'consts', 'trocaDados','$location', function($rootScope, consts, trocaDados, $location) {
  $rootScope.consts = consts

  //  const apiUrl = $location.$$protocol+'://'+$location.$$host+':'+10000+'/api/'
  //  const oapiUrl = $location.$$protocol+'://'+$location.$$host+':'+10000+'/oapi/'
  //  const noderedUrl = $location.$$protocol+'://'+$location.$$host+':'+ 1880

     // const apiUrl = 'http://192.168.0.201:10000/api/'
     // const oapiUrl = 'http://192.168.0.201:10000/oapi/'
     // const noderedUrl = 'http://192.168.0.201:1880'

     const apiUrl = 'http://192.168.15.115:10000/api/'
     const oapiUrl = 'http://192.168.15.115:10000/oapi/'
     const noderedUrl = 'http://192.168.15.115:1880'

      // const apiUrl = 'http://erp.intech-automacao.com.br:10000/api/'
      // const oapiUrl = 'http://erp.intech-automacao.com.br:10000/oapi/'
      // const noderedUrl = 'http://erp.intech-automacao.com.br:1880'

     
  trocaDados.setapiUrl(apiUrl)
  trocaDados.setoapiUrl(oapiUrl)
  trocaDados.setnoderedUrl(noderedUrl)

  $rootScope.consts.apiUrl = trocaDados.getapiUrl()                                                                                                   
  $rootScope.consts.oapiUrl = trocaDados.getoapiUrl()
  $rootScope.consts.noderedUrl = trocaDados.getnoderedUrl()

}])
