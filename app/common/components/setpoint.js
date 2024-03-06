angular.module('intechApp').component('setpoint', {
   bindings: {
     titulo:'@',
     unidade:'@',
      dispclique: '&',
      valor: '<',
      valorsetpoint:'<',
      changing:'<',
      falha: '<',
      fator: '<',
      acesso:'<',
      fonte: '<',
      texttop:'<'      
   },
   template: `

   <div class="col-xs-12 col-md-3 col-lg-3" id="401">
     <div class="box box-primary">
       <div class="box-header with-border" style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center;">{{$ctrl.titulo}}</p>
       </div>
       <!-- /.box-header -->
       <div class="box-header" style="height: 147px;">
         <p ng-if="$ctrl.acesso > 2"  style="cursor: not-allowed;font-size:12px; margin-top:-3px; text-align: right;" uib-tooltip="Você não tem acesso aos comandos"><i class="fa fa-cog fa-2x" aria-hidden="true"></i></p>
         <p ng-if="$ctrl.acesso <= 2"style="cursor: pointer; font-size:12px; margin-top:-3px; text-align: right;" ng-click="$ctrl.dispclique()"><i class="fa fa-cog fa-2x" aria-hidden="true"></i></p>
         <div class="inner" style="margin-top:{{$ctrl.texttop}}px;" >
          <p ng-if="$ctrl.fator==1" style="font-size: {{$ctrl.fonte}}px; text-align:center; margin-top:-10px;">{{$ctrl.valor}}<span style="font-size:20px; text-align: center; "> {{$ctrl.unidade}}</span></p>
          <p ng-if="$ctrl.fator!=1" style="font-size: {{$ctrl.fonte}}px; text-align:center; margin-top:-10px;">{{($ctrl.valor*$ctrl.fator)| number:1}}<span style="font-size:20px; text-align: center; "> {{$ctrl.unidade}}</span></p>
         </div>
         <div class="icon">
           <i class="ion ion-bag"></i>
         </div>
         <!--<div class="small-box-footer" style="height:30px;"> </div> -->
       </div>
     </div>
   </div>
   `
});
