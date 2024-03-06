angular.module('intechApp').component('alarmesComp', {
   bindings: {
     titulo:'@',
      dispclique: '&',
      dowloadclick: '&',
      dowloadclickpdf: '&',
      acesso:'<',
      largura: '<',
      alarmes: '<',
      modo: '<',
      parameters: '<',
      idtoexportpdf: '@'

   },
   template: `
    <div class="col-xs-12" id="{{$ctrl.idtoexportpdf}}">
    <div class="box box-primary" >
      <div class="box-header with-border"  style="height: 30px;">
        <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
         <p ng-if="$ctrl.acesso > 2"  style="cursor: not-allowed;font-size:12px; margin-top:-30px; margin-right:5px; text-align: right;" uib-tooltip="Você não tem acesso aos comandos"><i class="fa fa-cog fa-1x" aria-hidden="true"></i></p>
         <p ng-if="$ctrl.acesso <= 2" style="cursor: pointer;font-size:12px; margin-top:-30px; margin-right:5px; text-align: right;"  ng-click="$ctrl.dispclique()"><i class="fa fa-cog fa-1x" aria-hidden="true"></i></p>
         <p style="cursor: pointer;font-size:12px; margin-top:-27px; margin-right:25px; text-align: right;"  ng-click="$ctrl.dowloadclickpdf()"><i class="fa fa-file-pdf-o fa-1x" aria-hidden="true"></i></p>
         <p style="cursor: pointer;font-size:12px; margin-top:-27px; margin-right:46px; text-align: right;"  ng-click="$ctrl.dowloadclick()"><i class="fa fa-file-excel-o fa-1x" aria-hidden="true"></i></p>
      
      </div>
      <div  style="margin-top:20px; padding-top:0px; margin-top:0px;" class="">

        <div class="box-body table-responsive" style="padding-top:0px;">
          <table class="table table-hover">
            <thead>
              <tr class="" style="font-size:11px; text-align:center; vertical-align:middle;">
                <th style="text-align:center; vertical-align:middle; height:35px;">Ocorrido</th>
                <th style="text-align:center; " ng-if="$ctrl.modo=='historico'">Resolução</th>
                <th style="text-align:center; " ng-if="$ctrl.modo=='historico' && $ctrl.parameters.viewduracao=='1'">Duração</th>
                <th style="text-align:left; ">Descrição</th>
                <th style="text-align:center; " ng-if="$ctrl.parameters.viewequipamento=='1'">Objeto</th>
                <th style="text-align:center;" ng-if="$ctrl.parameters.viewmenu=='1'">Menu navegação</th>
                <th style="text-align:center; " ng-if="$ctrl.parameters.viewvalor=='1'">Valor</th>
                <th style="text-align:center; " ng-if="$ctrl.parameters.viewacao=='1'">Acão</th>
              </tr>
            </thead>
            <tbody>
              <tr ng-style="alarme.prioridade==0 && {'color':'red'}  || alarme.prioridade==1 && {'color':'orange'}  || alarme.prioridade==2 && {'color':'blue'}  || alarme.prioridade >=3 && {'color':'#808080'} " style="font-size:11px;" ng-repeat="alarme in $ctrl.alarmes">
                <td style="text-align:center; ">{{alarme.data_ocorrido | utcBrasilShortDate}}</td>
                <td style="text-align:center; color: green;" ng-if="$ctrl.modo=='historico'">{{alarme.data_resolucao | utcBrasilShortDate}}</td>
                <td style="text-align:center; " ng-if="$ctrl.modo=='historico' && $ctrl.parameters.viewduracao=='1'">{{alarme.data_ocorrido | dateDays: alarme.data_resolucao}}</td>
                <td style="text-align:left; ;">{{alarme.descricao}}</td>
                <td style="text-align:center;" ng-if="$ctrl.parameters.viewequipamento=='1'">{{alarme.equipamento}}</td>
                <td style="text-align:center; " ng-if="$ctrl.parameters.viewmenu=='1'">{{alarme.navegacao}}</td>
                <td style="text-align:center;" ng-if="$ctrl.parameters.viewvalor=='1'">{{alarme.valor}}</td>
                <td style="text-align:center;" ng-if="$ctrl.parameters.viewacao=='1'">
                  <button class="btn btn-danger btn-xs" ng-disabled="true" mw-confirm-click="" mw-confirm-click-message="Deseja realmente apagar o registro?" uib-tooltip="Remove material"><i class="fa fa-trash-o" ></i></button>
                </td>
              </tr>
            </tbody>
          </table>

        <div ng-if="$ctrl.alarmes.length==0" class="col-xs-12 col-md-12" style="margin-top:14px;margin-bottom:0px;">
        <p style="text-align:center; font-size:12px;">Sem resultados</p>
        </div>

        </div>
      </div>
    </div>
  </div>

   `
});




