angular.module('intechApp').component('empSearch', {
   bindings: {
     empresas: '=',
     show:'=',
     onClick:'&',
     indice:'='
   },
   template: `
   <div ng-if="$ctrl.show">
       <div class="box-header with-border">
         <h3 class="box-title" style="font-size:12px;">Empresas cadastradas</h3>
       </div>
         <div>
           <div class="box-body table-responsive no-padding" style="height:150px;">
             <table class="table table-hover">
               <tr class="info" style="font-size:12px;">
                 <th  width="200" style="text-align: left;">Razão Social</th>
               </tr>
               <tr  ng-repeat="empresa in $ctrl.empresas">
                 <td style="font-size:12px; text-align: left;vertical-align: middle;"><i class="fa fa-industry"></i><a class="" href="" title="Seleciona" target="_blank" ng-click="$ctrl.onClick($index)"> {{empresa.razao_social}}</td>
               </tr>
           </table>
           </div>
         </div>
     <div class="modal-footer">
         <button class="btn btn-primary" type="button" ng-click="$ctrl.onClick()">OK</button>
         <button class="btn btn-warning" type="button" ng-click="$close()">Cancel</button>
     </div>
  </div>
   `
});
