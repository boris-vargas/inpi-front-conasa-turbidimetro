angular.module('intechApp').component('botaoDimmer', {
   bindings: {
      state: '<',
      write: '&',
      titulo: '@',
      changing:'<',
      falha:'<',
      icoon: '@',
      icooff:'@',
      icorefresh:'@',
      acesso:'<',
      imagesize:'@',
      imagetop:'@',
      dimmerobject:'='
   },
   template: `


      <div class="col-xs-12 col-md-3 col-lg-3">
        <div class="box box-primary" ng-style="$ctrl.falha && {'background-color':'rgba(255, 0, 0, 0.1)'} || {'background-color': 'white'}">
          <div class="box-header with-border"  style="height: 30px;">
            <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
          </div>
          <!-- /.box-header -->

          <div ng-if="$ctrl.acesso > 2" class="small-box bg-light" style="cursor: not-allowed;margin-top:0px; margin-bottom: -20px;" uib-tooltip="Você não tem acesso aos comandos">
            <div class="user-panel" style="height:99px;">
              <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && $ctrl.state" ng-src="/assets/imgs/objects/{{$ctrl.icoon}}" class="img-responsive center-block"/>
              <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && !$ctrl.state" ng-src="/assets/imgs/objects/{{$ctrl.icooff}}" class="img-responsive center-block"/>
              <img height="auto" width="18%" style="margin-top:0px;" ng-if="$ctrl.changing" ng-src="/assets/imgs/objects/{{$ctrl.icorefresh}}"  class="img-responsive center-block"/>
            </div>
            <div class="icon">
              <i class="ion ion-bag"></i>
            </div>
          </div>
          <div ng-if="$ctrl.acesso > 2" class="small-box bg-light" style="cursor: not-allowed; padding: 7px; opacity: 0.5;" uib-tooltip="Você não tem acesso aos comandos">
            <rzslider class=""  rz-slider-options="$ctrl.dimmerobject.options" ></rzslider>
          </div>  


          <div ng-if="$ctrl.acesso <= 2" class="small-box bg-light" style="cursor: pointer; margin-top:0px; margin-bottom: -20px;" ng-click="$ctrl.write()">
            <div class="user-panel" style="height:99px;">
              <img height="auto" width="{{$ctrl.imagesize}}" style="opacity:{{(($ctrl.dimmerobject.value-0) * (100-30) / (100-0) + 20) / 100}} ; margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && $ctrl.state" ng-src="/assets/imgs/objects/{{$ctrl.icoon}}" class="img-responsive center-block"/>
              <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && !$ctrl.state" ng-src="/assets/imgs/objects/{{$ctrl.icooff}}" class="img-responsive center-block"/>
              <img height="auto" width="18%" style="margin-top:0px;" ng-if="$ctrl.changing" ng-src="/assets/imgs/objects/{{$ctrl.icorefresh}}"  class="img-responsive center-block"/>
            </div>
            <div class="icon">
              <i class="ion ion-bag"></i>
            </div>
          </div>
          <div ng-if="$ctrl.acesso <= 2" class="small-box bg-light" style="cursor: pointer; padding: 7px; opacity: 0.5;">
            <rzslider rz-slider-model="$ctrl.dimmerobject.value" rz-slider-options="$ctrl.dimmerobject.options" ></rzslider>
          </div>  


        </div>
      </div>

   `
});
