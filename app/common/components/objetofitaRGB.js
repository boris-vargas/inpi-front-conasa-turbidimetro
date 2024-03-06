angular.module('intechApp').component('fitaRgb', {
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
      fitargbobject:'='
   },
   template: `


    <div class="col-xs-12 col-md-3 col-lg-3" id="tereco">
        <div class="box box-primary" style="background-color: white">
            <div class="box-header with-border"  style="height: 30px;">
                    <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
            </div>


            <div ng-if=" $ctrl.acesso <= 2" class="small-box bg-light" style="cursor: pointer; margin-top:0px;" ng-click="$ctrl.write()">
                <div class="user-panel" style="height:97px;">
                      <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing &&  $ctrl.state" ng-src="/assets/imgs/objects/{{$ctrl.icoon}}" class="img-responsive center-block"/>
                      <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-if="!$ctrl.changing && !$ctrl.state" ng-src="/assets/imgs/objects/{{$ctrl.icooff}}" class="img-responsive center-block"/>
                      <img height="auto" width="18%" style="margin-top:0px;" ng-if="$ctrl.changing" ng-src="/assets/imgs/objects/{{$ctrl.icorefresh}}"  class="img-responsive center-block"/>
                </div>
              </div>
              <div ng-if=" 0 <= 2" style="width:100%; height: 35px;" class="small-box bg-light" style="cursor: pointer; opacity: 0.5;">

                <div class="center" colorpicker="rgb" colorpicker-position="bottom" ng-model="$ctrl.fitargbobject.color" style=" cursor: pointer; background-color:{{$ctrl.fitargbobject.color}};  width:95%; margin-top: -5px;margin-bottom: 5px; ">

                </div>
            </div>  


        </div>
    </div>
   `
});
