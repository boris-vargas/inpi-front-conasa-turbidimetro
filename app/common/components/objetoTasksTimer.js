angular.module('intechApp').component('taskTimer', {
   bindings: {
      titulo: '@',
      addhoraliga: '&',
      deletehoraliga: '&',
      addhoraligaregistro: '&',
      deletehoraligaregistro: '&',
      addhoradesliga: '&',
      deletehoradesliga: '&',
      addhoradesligaregistro: '&',
      deletehoradesligaregistro: '&',
      confirmaedicao:'&',
      dados: '=',
   },
   template: `
   <div class="col-xs-12 col-md-4 col-lg-4">
     <div class="box box-primary">
       <div class="box-header with-border" style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
       </div>
       <!-- /.box-header -->
       <div class="box-header" >
         <div class="box-footer no-padding">
           <ul class="nav nav-stacked">

             <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
             Acordion ligar
             +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
             <uib-accordion ng-click="cfgPiCtrl.acordion2()">
               <div uib-accordion-group class="panel-default" is-open="cfgPiCtrl.openAc2">
                 <uib-accordion-heading >
                   <i class="pull-left fa fa-clock-o"></i><Label style="font-size:12px;">Horário para iniciar</label><i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': cfgPiCtrl.openAc2, 'glyphicon-chevron-right': !cfgPiCtrl.openAc2}"></i>
                   </uib-accordion-heading>
                   <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                   Hora ligar
                   +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                   <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                     <table class="table">
                       <thead>
                         <tr style="font-size:12px;">
                           <th>Hora para ligar</th>
                           <th>Ação</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr ng-repeat="horaLiga in $ctrl.dados.horaLiga  track by $index">
                           <td>
                             <div uib-timepicker ng-model="horaLiga.hora" ng-change="changed()" show-seconds="true" hour-step="1" minute-step="1" show-meridian="false"></div>
                           </td>
                           <td style="height:100px;vertical-align: middle;" ng-if="$index < 1">
                             <button class="btn btn-success btn-xs"  ng-click="$ctrl.addhoraliga($index)"><i class="fa fa-plus"></i></button>
                             <button class="btn btn-danger btn-xs"  ng-click="$ctrl.deletehoraliga($index)"><i class="fa fa-trash-o"></i></button>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                   <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                   Registros a acionar
                   +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                   <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                     <h6>Objeto para acionar</h6>
                     <table class="table">
                       <thead>
                         <tr style="font-size:12px;">
                           <th>Endereço</th>
                           <th>Registro</th>
                           <th>Ação</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr ng-repeat="tagsWriteOn in $ctrl.dados.tagsWriteOn  track by $index">
                           <td>
                             <input type="number" style="width:68px;" ng-model="tagsWriteOn.id" class="form-control input-sm" placeholder="Endereço" />
                           </td>
                           <td>
                             <input type="number" style="width:68px;" ng-model="tagsWriteOn.reg" class="form-control input-sm" placeholder="Informe o registro"/>
                           </td>
                           <td  ng-if="$index < 1">
                             <button class="btn btn-success btn-xs"  ng-click="$ctrl.addhoraligaregistro($index)"><i class="fa fa-plus"></i></button>
                             <button class="btn btn-danger btn-xs"  ng-click="$ctrl.deletehoraligaregistro($index)"><i class="fa fa-trash-o"></i></button>
                           </td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                   <button class="btn btn-warning btn-xs pull-right"  ng-click="$ctrl.confirmaedicao()"><i class="fa fa-pencil"></i><span> Confirma edição</span></button>
                </div>
               </uib-accordion>
               <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
               Acordion Desligar
               +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
               <uib-accordion ng-click="cfgPiCtrl.acordion2()">
                 <div uib-accordion-group class="panel-default" is-open="cfgPiCtrl.openAc2">
                   <uib-accordion-heading >
                     <i class="pull-left fa fa-clock-o"></i><Label style="font-size:12px;">Horários para finalizar tarefa</label><i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': cfgPiCtrl.openAc2, 'glyphicon-chevron-right': !cfgPiCtrl.openAc2}"></i>
                     </uib-accordion-heading>
                     <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                     Hora desligar
                     +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                     <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                       <table class="table">
                         <thead>
                           <tr style="font-size:12px;">
                             <th>Hora para desligar</th>
                             <th>Ação</th>
                           </tr>
                         </thead>
                         <tbody>
                           <tr ng-repeat="horaDesliga in $ctrl.dados.horaDesliga track by $index">
                             <td>
                               <div uib-timepicker ng-model="horaDesliga.hora" ng-change="changed()" show-seconds="true" hour-step="1" minute-step="1" show-meridian="false"></div>
                               <!-- <input ng-model="horaDesliga.hora" class="form-control input-sm" placeholder="Informe o Valor"/> -->
                             </td>
                             <td style="height:100px;vertical-align: middle;"  ng-if="$index < 1">
                               <button class="btn btn-success btn-xs" ng-click="$ctrl.addhoradesliga($index)"><i class="fa fa-plus"></i></button>
                               <button class="btn btn-danger btn-xs" ng-click="$ctrl.deletehoradesliga($index)"><i class="fa fa-trash-o"></i></button>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                     <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                     Registro desligar
                     +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                     <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                       <h6>Objeto para desligar</h6>
                       <table class="table">
                         <thead>
                           <tr style="font-size:12px;">
                             <th>Endereço</th>
                             <th>Registro</th>
                             <th>Ação</th>
                           </tr>
                         </thead>
                         <tbody>
                           <tr ng-repeat="tagsWriteOff in $ctrl.dados.tagsWriteOff  track by $index">
                             <td>
                               <input type="number" style="width:68px;" ng-model="tagsWriteOff.id" class="form-control input-sm" placeholder="Endereço"/>
                             </td>
                             <td>
                               <input type="number" style="width:68px;" ng-model="tagsWriteOff.reg" class="form-control input-sm" placeholder="Informe o registro"/>
                             </td>
                             <td  ng-if="$index < 1">
                               <button class="btn btn-success btn-xs"  ng-click="$ctrl.addhoradesligaregistro($index)"><i class="fa fa-plus"></i></button>
                               <button class="btn btn-danger btn-xs"  ng-click="$ctrl.deletehoradesligaregistro($index)"><i class="fa fa-trash-o"></i></button>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                     <button class="btn btn-warning btn-xs pull-right"  ng-click="$ctrl.confirmaedicao()"><i class="fa fa-pencil"></i><span> Confirma edição</span></button>
                   </div>
                 </uib-accordion>
               </ul>
             </div>
           </div>
         </div>
       </div>

   `
});
