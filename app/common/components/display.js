angular.module('intechApp').component('display', {
   bindings: {
     titulo:'@',
     unidade:'@',
      dispclique: '&',
      valor: '<',
      changing:'<',
      falha: '<',
      fator: '<',
      fonte: '<',
      texttop:'<'
   },
   template: `

   <div class="col-xs-12 col-md-3 col-lg-3">
   <div class="box box-primary" ng-style="$ctrl.falha && {'background-color':'rgba(255, 0, 0, 0.1)'} || {'background-color': 'white'}">
       <div class="box-header with-border" style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
       </div>
       <!-- /.box-header -->
       <div class="box-header" style="height: 147px;" ng-click="$ctrl.dispclique()">
         <div class="inner" style="margin-top:{{$ctrl.texttop}}px;">
         <p ng-if="$ctrl.fator==1" style="font-size: {{$ctrl.fonte}}px; text-align:center; margin-top:25px;"> {{$ctrl.valor}}<span style="font-size:20px; text-align: center; "> {{$ctrl.unidade}}</span></p>
         <p ng-if="$ctrl.fator!=1" style="font-size: {{$ctrl.fonte}}px; text-align:center; margin-top:25px;"> {{($ctrl.valor*$ctrl.fator)| number:3 }}<span style="font-size:20px; text-align: center; "> {{$ctrl.unidade}}</span></p>
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
