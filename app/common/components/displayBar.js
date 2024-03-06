angular.module('intechApp').component('displayBar', {
   bindings: {
     titulo:'@',
     unidade:'@',
      dispclique: '&',
      nivelmin: '<',
      nivelmax:'<' ,
      nivelalto: '<',
      nivelbaixo:'<' ,
      valorlabel:'<',
      valor: '<',
      changing:'<',
      falha: '<',
      sparkdata: '&',
      fator: '<',
      cornormal: '@',
      corbaixo: '@',
      coralto: '@'
   },
   template: `

   <div class="col-xs-12 col-md-3">
     <div class="box box-primary" ng-style="$ctrl.falha && {'background-color':'rgba(255, 0, 0, 0.1)'} || {'background-color': 'white'}">
       <div class="box-header with-border"  style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
       </div>
       <!-- /.box-header -->
       <div class="small-box bg-light" style="cursor: pointer; height: 127px; margin-top:20px;">
         <div class="inner">
           <div class="level"  style="margin-left: auto; margin-right: auto;display: table;">
             <div class="level-min-max">
               <div class="level-min">{{$ctrl.nivelmin}}</div>
               <div class="level-max">{{$ctrl.nivelmax}}</div>
             </div>

            <div class="level-caption">
              <div class="level-a"><i  style="font-size:9px;font-weight: normal;" class="fa fa-arrow-up" ng-style="($ctrl.valorlabel*$ctrl.fator) >= $ctrl.nivelalto && {'color':'red'}  || {'color':'grey'}">&nbsp{{$ctrl.nivelalto}}</i></div>
              <div class="level-b"><i  style="font-size:9px;font-weight: normal;" class="fa fa-arrow-down" ng-style="($ctrl.valorlabel*$ctrl.fator) < $ctrl.nivelbaixo && {'color':'red'}  || {'color':'grey'}">&nbsp{{$ctrl.nivelbaixo}}</i></div>
            </div> 

             <div class="level-gauge" >

             <div class="level-value"  ng-if="$ctrl.valorlabel*$ctrl.fator <  $ctrl.nivelbaixo" style="background-color: #ff0000;" ng-style="{height: $ctrl.valor*$ctrl.fator}"></div>
             <div class="level-value"  ng-if="($ctrl.valorlabel*$ctrl.fator >= $ctrl.nivelbaixo) && ($ctrl.valor*$ctrl.fator < $ctrl.nivelalto)" style="background-color: #008000;" ng-style="{height: $ctrl.valor*$ctrl.fator}"></div>
             <div class="level-value"  ng-if="$ctrl.valorlabel*$ctrl.fator >= $ctrl.nivelalto" style="background-color:#ff0000;" ng-style="{height: $ctrl.valor*$ctrl.fator}"></div>




             </div>
             <div class="level-label" style=" margin-top:45px;" ng-if="$ctrl.fator==1 && $ctrl.valor < 100" ><span style="font-size:35px; color:#444444">{{$ctrl.valorlabel}}</span> <span style="font-size:18px">{{$ctrl.unidade}}</span></div>
             <div class="level-label" style=" margin-top:45px;" ng-if="$ctrl.fator!=1 && $ctrl.valor*$ctrl.fator < 100" ><span style="font-size:35px; color:#444444">{{($ctrl.valorlabel*$ctrl.fator) | number:1}}</span> <span style="font-size:18px">{{$ctrl.unidade}}</span></div>

             <div class="level-label-up" style=" margin-top:45px;" ng-if="$ctrl.fator==1 && $ctrl.valor >= 100" ><span style="font-size:35px; color:#444444">{{$ctrl.valorlabel}}</span> <span style="font-size:18px">{{$ctrl.unidade}}</span></div>
             <div class="level-label-up" style=" margin-top:45px;" ng-if="$ctrl.fator!=1 && $ctrl.valor*$ctrl.fator >= 100" ><span style="font-size:35px; color:#444444">{{($ctrl.valorlabel*$ctrl.fator) | number:1}}</span> <span style="font-size:18px">{{$ctrl.unidade}}</span></div>



         </div>
       </div>
     </div>

   </div>
 </div>








   `
});
