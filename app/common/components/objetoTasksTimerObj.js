angular.module('intechApp').component('taskTimerobj', {
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
      allcomponentes: '=',
      changeselectcomp: '&',
      acesso:'<'
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
             <uib-accordion ng-click="$ctrl.acordion1()">
               <div uib-accordion-group class="panel-default" is-open="$ctrl.openAc1">
                 <uib-accordion-heading >
                   <i class="pull-left fa fa-clock-o"></i><Label style="font-size:12px;">Horário para iniciar</label><i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': $ctrl.openAc2, 'glyphicon-chevron-right': !$ctrl.openAc2}"></i>
                   </uib-accordion-heading>
                   <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                   Hora ligar
                   +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                   <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                     <table class="table">
                       <thead>
                         <tr style="font-size:12px;">
                           <th>Hora para ligar</th>
                         </tr>
                       </thead>
                       <tbody>
                         <tr ng-repeat="horaLiga in $ctrl.dados.horaLiga  track by $index">
                           <td>
                             <div style="transform: scale(1); margin-left:-10px;">
                               <div uib-timepicker ng-model="horaLiga.hora" ng-change="changed()" show-seconds="true" hour-step="1" minute-step="1" show-meridian="false"></div>
                             </div>
                             <div class="">
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox1" ng-model="horaLiga.diaSemana[0]">Domingo
                               </label>
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox2" ng-model="horaLiga.diaSemana[1]">Segunda
                               </label>
                               <br>
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox3" ng-model="horaLiga.diaSemana[2]">Terça
                               </label>
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox4" ng-model="horaLiga.diaSemana[3]">Quarta
                               </label>
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox5" ng-model="horaLiga.diaSemana[4]">Quinta
                               </label>
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox6" ng-model="horaLiga.diaSemana[5]">Sexta
                               </label>
                               <label style="font-size:12px;">
                                 <input type="checkbox" id="inlineCheckbox7" ng-model="horaLiga.diaSemana[6]">Sábado
                               </label>
                               <br>
                               <label style="font-size:12px;">
                                 <button style="width:60px;" class="btn btn-xs" id="" ng-click="horaLiga.diaSemana = [true,true,true,true,true,true,true]"> Todos</button>
                               </label>
                               <label style="font-size:12px;">
                                 <button style="width:60px;" class="btn btn-xs" id="" ng-click="horaLiga.diaSemana = [false,false,false,false,false,false,false]"> Nenhum</button>
                               </label>
                             </div>
                             <td ng-if="$index < 1" style="width:100px;vertical-align: top;">
                               <button style="margin-top:40px;"class="btn btn-success btn-xs"  data-ng-click="$ctrl.addhoraliga({id:12})"><i class="fa fa-plus"></i></button>
                               <button style="margin-top:40px;"class="btn btn-danger btn-xs"  data-ng-click="$ctrl.deletehoraliga({id:12})"><i class="fa fa-trash-o"></i></button>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                     <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                     Registros a acionar
                     +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                     <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                       <h6>Objetos para acionar</h6>
                       <table class="table">
                         <tbody>
                           <tr class="" ng-repeat="tagsWriteOn in $ctrl.dados.tagsWriteOn  track by $index">
                             <td class="">
                               <select ng-change="$ctrl.changeselectcomp({index:$index, select: tagsWriteOn.selectObj})" class="form-control input-sm" style="width:140px;" ng-options="item as item.descricao for item in $ctrl.allcomponentes | filter: {tipo: '!task-horario'} | filter: {tipo: '!chart'} | filter: {tipo: '!display'} | filter: {tipo: '!display-bar'} | filter: {tipo: '!display-gauge'} | filter: {tipo: '!indica-led'}  track by item.id" ng-model="tagsWriteOn.selectObj"></select>
                               <div class="row form-group " style="padding:15px; margin-top:-10px">
                                 <input  style="text-align:center; width:140px" ng-if="tagsWriteOn.selectObj.tipo == 'generico'"  type="number" ng-model="tagsWriteOn.id" class="form-control input-sm" placeholder="End." uib-tooltip="Endereço"/>
                                 <input  style="text-align:center;margin-top:5px;width:140px;" ng-if="tagsWriteOn.selectObj.tipo == 'generico'" type="number" ng-model="tagsWriteOn.reg" class="form-control input-sm" placeholder="Reg." uib-tooltip="Registro"/>
                                 <input  style="text-align:center;margin-top:5px;width:140px;" ng-if="tagsWriteOn.selectObj.tipo == 'generico'"  type="number" ng-model="tagsWriteOn.valor" class="form-control input-sm" placeholder="Valor" uib-tooltip="Valor"/>
                               </div>
                             </td>
                             <td class="" ng-if="$index < 1" style="style=width:200px; vertical-align: top;">
                               <button class="btn btn-success btn-xs"  ng-click="$ctrl.addhoraligaregistro({index:$index})"><i class="fa fa-plus"></i></button>
                               <button class="btn btn-danger btn-xs"  ng-click="$ctrl.deletehoraligaregistro({index:$index})"><i class="fa fa-trash-o"></i></button>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                         <button ng-if="$ctrl.acesso > 2"  style="cursor: pointer" class="btn btn-warning btn-xs pull-right" uib-tooltip="Você não tem acesso aos comandos"><i class="fa fa-pencil"></i><span> Confirma edição</span></button>
                         <button ng-if="$ctrl.acesso <= 2"  style="cursor: pointer"class="btn btn-warning btn-xs pull-right"  ng-click="$ctrl.confirmaedicao()"><i class="fa fa-pencil"></i><span> Confirma edição</span></button>
                   </div>
                 </uib-accordion>
                 <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                 Acordion Desligar
                 +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                 <uib-accordion ng-click="$ctrl.acordion2()">
                   <div uib-accordion-group class="panel-default" is-open="$ctrl.openAc2">
                     <uib-accordion-heading >
                       <i class="pull-left fa fa-clock-o"></i><Label style="font-size:12px;">Horários para finalizar tarefa</label><i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': $ctrl.openAc2, 'glyphicon-chevron-right': !$ctrl.openAc2}"></i>
                       </uib-accordion-heading>
                       <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++
                       Hora desligar
                       +++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
                       <div class="col-xs-12 col-md-12" style="padding:0px; margin:0px;">
                         <table class="table">
                           <thead>
                             <tr style="font-size:12px;">
                               <th>Hora para Desligar</th>
                             </tr>
                           </thead>
                           <tbody>
                             <tr ng-repeat="horaDesliga in $ctrl.dados.horaDesliga  track by $index">
                               <td>
                                 <div style="transform: scale(1); margin-left:-10px;">
                                   <div uib-timepicker ng-model="horaDesliga.hora" ng-change="changed()" show-seconds="true" hour-step="1" minute-step="1" show-meridian="false"></div>
                                 </div>
                                 <div class="">
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox1" ng-model="horaDesliga.diaSemana[0]">Domingo
                                   </label>
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox2" ng-model="horaDesliga.diaSemana[1]">Segunda
                                   </label>
                                   <br>
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox3" ng-model="horaDesliga.diaSemana[2]">Terça
                                   </label>
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox4" ng-model="horaDesliga.diaSemana[3]">Quarta
                                   </label>
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox5" ng-model="horaDesliga.diaSemana[4]">Quinta
                                   </label>
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox6" ng-model="horaDesliga.diaSemana[5]">Sexta
                                   </label>
                                   <label style="font-size:12px;">
                                     <input type="checkbox" id="inlineCheckbox7" ng-model="horaDesliga.diaSemana[6]">Sábado
                                   </label>
                                   <br>
                                   <label style="font-size:12px;">
                                     <button style="width:60px;" class="btn btn-xs" id="" ng-click="horaDesliga.diaSemana = [true,true,true,true,true,true,true]"> Todos</button>
                                   </label>
                                   <label style="font-size:12px;">
                                     <button style="width:60px;" class="btn btn-xs" id="" ng-click="horaDesliga.diaSemana = [false,false,false,false,false,false,false]"> Nenhum</button>
                                   </label>
                                 </div>
                                 <td ng-if="$index < 1" style="width:100px;vertical-align: top;">
                                   <button style="margin-top:40px;"class="btn btn-success btn-xs"  data-ng-click="$ctrl.addhoradesliga({id:12})"><i class="fa fa-plus"></i></button>
                                   <button style="margin-top:40px;"class="btn btn-danger btn-xs"  data-ng-click="$ctrl.deletehoradesliga({id:12})"><i class="fa fa-trash-o"></i></button>
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
                             <tbody>
                               <tr class="" ng-repeat="tagsWriteOff in $ctrl.dados.tagsWriteOff  track by $index">
                                 <td class="">
                                   <select ng-change="$ctrl.changeselectcomp({index:$index, select: tagsWriteOff.selectObj})" class="form-control input-sm" style="width:140px;" ng-options="item as item.descricao for item in $ctrl.allcomponentes | filter: {tipo: '!task-horario'} | filter: {tipo: '!chart'} | filter: {tipo: '!display'} | filter: {tipo: '!display-bar'} | filter: {tipo: '!display-gauge'} | filter: {tipo: '!indica-led'} track by item.id" ng-model="tagsWriteOff.selectObj"></select>
                                   <div class="row form-group " style="padding:15px; margin-top:-10px">
                                     <input  style="text-align:center; width:140px" ng-if="tagsWriteOff.selectObj.tipo == 'generico'"  type="number" ng-model="tagsWriteOff.id" class="form-control input-sm" placeholder="End." uib-tooltip="Endereço"/>
                                     <input  style="text-align:center;margin-top:5px;width:140px;" ng-if="tagsWriteOff.selectObj.tipo == 'generico'" type="number" ng-model="tagsWriteOff.reg" class="form-control input-sm" placeholder="Reg." uib-tooltip="Registro"/>
                                     <input  style="text-align:center;margin-top:5px;width:140px;" ng-if="tagsWriteOff.selectObj.tipo == 'generico'"  type="number" ng-model="tagsWriteOff.valor" class="form-control input-sm" placeholder="Valor" uib-tooltip="Valor"/>
                                   </div>
                                 </td>
                                 <td class="" ng-if="$index < 1" style="style=width:200px; vertical-align: top;">
                                   <button class="btn btn-success btn-xs"  ng-click="$ctrl.addhoradesligaregistro({index:$index})"><i class="fa fa-plus"></i></button>
                                   <button class="btn btn-danger btn-xs"  ng-click="$ctrl.deletehoradesligaregistro({index:$index})"><i class="fa fa-trash-o"></i></button>
                                 </td>
                               </tr>
                             </tbody>
                           </table>
                         </div>
                         <button ng-if="$ctrl.acesso > 2"  style="cursor: pointer" class="btn btn-warning btn-xs pull-right" uib-tooltip="Você não tem acesso aos comandos"><i class="fa fa-pencil"></i><span> Confirma edição</span></button>
                         <button ng-if="$ctrl.acesso <= 2"  style="cursor: pointer"class="btn btn-warning btn-xs pull-right"  ng-click="$ctrl.confirmaedicao()"><i class="fa fa-pencil"></i><span> Confirma edição</span></button>

                       </div>

                   </uib-accordion>
                 </ul>
               </div>
             </div>
           </div>
         </div>
   `








});
