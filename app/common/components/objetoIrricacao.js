angular.module('intechApp').component('irrigacao', {
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
            <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.area}}</p>
          </div>
          <!-- /.box-header -->
          <div  style="margin-top:20px; cursor: not-allowed;" ng-if="$ctrl.acesso > 2" class="small-box bg-light" uib-tooltip="Você não tem acesso aos comandos">
            <div class="inner" style="height: 127px;">
              <img ng-if="!$ctrl.changing" ng-src="{{$ctrl.lampstate ? '/assets/imgs/irrigacao-on.png' : '/assets/imgs/irrigacao-off.png'}}" class="img-responsive center-block"/>
              <img  style="margin-top:14px; vertical-align: middle; height:50%; width:auto;" ng-if="$ctrl.changing" src="/assets/imgs/refresh-tr.png" class="img-responsive center-block" />
            </div>
            <div class="icon">
              <i class="ion ion-bag"></i>
            </div>
            <!--<div class="small-box-footer"><p style="font-size:10px; text-align:center; color: gray;">acionamentos: <span style="font-size:10px; text-align: right; color: gray;"> {{$ctrl.acionamentos}}</span></p></div>-->
          </div>

          <div style="margin-top:20px; cursor: pointer;" ng-if="$ctrl.acesso <= 2" class="small-box bg-light" ng-click="$ctrl.lampwrite()">
            <div class="inner" style="height: 127px;">
              <img ng-if="!$ctrl.changing" ng-src="{{$ctrl.lampstate ? '/assets/imgs/irrigacao-on.png' : '/assets/imgs/irrigacao-off.png'}}" class="img-responsive center-block"/>
              <img  style="margin-top:14px; vertical-align: middle; height:50%; width:auto;" ng-if="$ctrl.changing" src="/assets/imgs/refresh-tr.png" class="img-responsive center-block" />
            </div>
            <div class="icon">
              <i class="ion ion-bag"></i>
            </div>
            <!--<div class="small-box-footer"><p style="font-size:10px; text-align:center; color: gray;">acionamentos: <span style="font-size:10px; text-align: right; color: gray;"> {{$ctrl.acionamentos}}</span></p></div>-->
          </div>


        </div>
      </div>


   `
});
