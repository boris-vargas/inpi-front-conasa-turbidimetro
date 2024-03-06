angular.module('intechApp').component('luzIncand', {
   bindings: {
      lampstate: '<',
      lampwrite: '&',
      area: '@',
      changing:'<',
      acionamentos:'<',
      falha:'<',
      acesso:'<'
   },
   template: `

   <div class="col-xs-6 col-md-3 col-lg-3">
     <div class="box box-primary" ng-style="$ctrl.falha && {'background-color':'rgba(255, 0, 0, 0.1)'} || {'background-color': 'white'}">

       <div class="box-header with-border"  style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center;">{{$ctrl.area}}</p>
       </div>
       <!-- /.box-header -->
       <div ng-if="$ctrl.acesso > 2" class="small-box bg-light" style="cursor: not-allowed;" uib-tooltip="Você não tem acesso aos comandos">
         <div class="inner" style="height:147px; margin-left: auto; margin-right: auto;display: table;">
           <img style="margin-top:24px;" ng-if="!$ctrl.changing" ng-src="{{$ctrl.lampstate ? '/assets/imgs/lamp-acesa.png' : '/assets/imgs/lamp-apagada.png'}}" class="img-responsive center-block"/>
           <img  style="margin-top:27px; vertical-align: middle; height:40%; width:auto;" ng-if="$ctrl.changing" src="/assets/imgs/refresh-tr.png" />
         </div>
         <div class="icon">
           <i class="ion ion-bag"></i>
         </div>
         <!--<div class="small-box-footer" style="height:30px;"> </div> -->
       </div>

       <div ng-if="$ctrl.acesso <= 2" class="small-box bg-light" style="cursor: pointer;" ng-click="$ctrl.lampwrite()">
         <div class="inner" style="height:147px; margin-left: auto; margin-right: auto;display: table;">
           <img style="margin-top:24px;" ng-if="!$ctrl.changing" ng-src="{{$ctrl.lampstate ? '/assets/imgs/lamp-acesa.png' : '/assets/imgs/lamp-apagada.png'}}" class="img-responsive center-block"/>
           <img  style="margin-top:27px; vertical-align: middle; height:40%; width:auto;" ng-if="$ctrl.changing" src="/assets/imgs/refresh-tr.png" />
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
