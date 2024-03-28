angular.module('intechApp').component('displayGauge', {
   bindings: {
     titulo:'@',
     unidade:'@',
      dispclique: '&',
      nivelmin: '<',
      nivelmax:'<' ,
      valor: '<',
      changing:'<',
      falha: '<',
      gatilho:'<',
      fator: '<',
      nivelbaixo: '<',
      nivelalto: '<',
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
       <div class="box-header" style="cursor: pointer; height: 147px;">

      <div style="margin: auto; margin-top:30px; width: 100%;  padding: 0px; text-align: center;">
            <label style="font-size:9px;font-weight: normal;" class="control-label"><i style="font-size:9px;font-weight: normal;" class="fa fa-arrow-down"  ng-style="($ctrl.valor*$ctrl.fator) < $ctrl.nivelbaixo && {'color':'red'}  || {'color':'grey'}"></i>&nbsp{{$ctrl.nivelbaixo}}</label>
            <label style="font-size:9px;font-weight: normal;"class="control-label"><i style="font-size:9px;font-weight: normal;" class="fa fa-arrow-up"  ng-style="($ctrl.valor*$ctrl.fator) >= $ctrl.nivelalto && {'color':'red'}  || {'color':'grey'}"></i>&nbsp{{$ctrl.nivelalto}}</label>
        </div>  

         <div style="margin-left: auto; margin-right: auto;display: table; margin-top:-50px;">
          

           <ng-gauge ng-if="$ctrl.fator!=1" size="150" type="semi" thick="14"
                   min="$ctrl.nivelmin" max="$ctrl.nivelmax" value="($ctrl.valor*$ctrl.fator)"
                   cap="round" label="{{$ctrl.unidade}}" append="" fraction-size="2"
                   foreground-color="#ffcc66" background-color="#EEE"
                     thresholds="$ctrl.gatilho">
         </ng-gauge>
           <ng-gauge ng-if="$ctrl.fator==1" size="150" type="semi" thick="14"
                   min="$ctrl.nivelmin" max="$ctrl.nivelmax" value="($ctrl.valor*$ctrl.fator)"
                   cap="round" label="{{$ctrl.unidade}}" append="" fraction-size="0"
                   foreground-color="#ffcc66" background-color="#EEE"
                     thresholds="$ctrl.gatilho">
         </ng-gauge>


         </div>

       </div>
     </div>
   </div>
   `
});
