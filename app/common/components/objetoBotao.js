angular.module('intechApp').component('botaoObj', {
   bindings: {
      lampstate: '<',
      lampwrite: '&',
      area: '@',
      changing:'<',
      acionamentos:'<',
      falha:'<',
      icoon: '@',
      icooff:'@',
      icorefresh:'@',
      acesso:'<',
      imagesize:'@',
      imagetop:'@'
   },
   template: `

   <div class="col-xs-6 col-md-3 col-lg-3">
     <div class="box box-primary" ng-style="$ctrl.falha && {'background-color':'rgba(255, 0, 0, 0.1)'} || {'background-color': 'white'}">
       <div class="box-header with-border"  style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.area}}</p>
       </div>
       <!-- /.box-header -->
       <div ng-if="$ctrl.acesso > 2" class="small-box bg-light" style="cursor: not-allowed;margin-top:0px; " uib-tooltip="Você não tem acesso aos comandos">
         <div class="user-panel" style="height:147px;">
         <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && $ctrl.lampstate" ng-src="/assets/imgs/objects/{{$ctrl.icoon}}" class="img-responsive center-block"/>
         <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && !$ctrl.lampstate" ng-src="/assets/imgs/objects/{{$ctrl.icooff}}" class="img-responsive center-block"/>
         <img height="auto" width="18%" style="margin-top:36px;" ng-if="$ctrl.changing" ng-src="/assets/imgs/objects/{{$ctrl.icorefresh}}"  class="img-responsive center-block"/>
         </div>
         <div class="icon">
           <i class="ion ion-bag"></i>
         </div>
         <!--<div class="small-box-footer"><p style="font-size:10px; text-align:center; color: gray;">acionamentos: <span style="font-size:10px; text-align: right; color: gray;"> {{$ctrl.acionamentos}}</span></p></div>-->
       </div>

       <div ng-if="$ctrl.acesso <= 2" class="small-box bg-light" style="cursor: pointer; margin-top:0px;" ng-click="$ctrl.lampwrite()">
         <div class="user-panel" style="height:147px;">
         <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && $ctrl.lampstate" ng-src="/assets/imgs/objects/{{$ctrl.icoon}}" class="img-responsive center-block"/>
         <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && !$ctrl.lampstate" ng-src="/assets/imgs/objects/{{$ctrl.icooff}}" class="img-responsive center-block"/>
         <img height="auto" width="18%" style="margin-top:36px;" ng-if="$ctrl.changing" ng-src="/assets/imgs/objects/{{$ctrl.icorefresh}}"  class="img-responsive center-block"/>
         </div>
         <div class="icon">
           <i class="ion ion-bag"></i>
         </div>
         <!--<div class="small-box-footer"><p style="font-size:0px; text-align:center; color: gray;">acionamentos: <span style="font-size:10px; text-align: right; color: gray;"> {{$ctrl.acionamentos}}</span></p></div>-->
       </div>

     </div>
   </div>

   `
});
