angular.module('intechApp').component('chart', {
   bindings: {
     titulo:'@',
     datachart: '<',
     labelschart: '<',
     optionschart: '<',
     overridechart: '<',
     heightchart :'<',
     largura:'<',
     acesso:'<',
     dowloadclick: '&',
     idtoexportpdf: '@',
     dispclique: '&'

   },
   template: `
   <div class="{{$ctrl.largura}}" id="{{$ctrl.idtoexportpdf}}">
     <div class="box box-primary">
       <div class="box-header with-border"  style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
         <br ng-if="!$ctrl.titulo">
         <p style="cursor: pointer;font-size:12px; margin-top:-29px; margin-right:25px; text-align: right;"  ng-click="$ctrl.dowloadclick()"><i class="fa fa-file-pdf-o fa-1x" aria-hidden="true"></i></p>
         <p style="cursor: pointer;font-size:12px; margin-top:-27px; margin-right:5px; text-align: right;"  ng-click="$ctrl.dispclique()"><i class="fa fa-cog fa-1x" aria-hidden="true"></i></p>
      </div>
       <div  style="margin-top:20px;" class="small-box bg-light">
         <div class="inner" style="width: 100%;">

           <canvas id="base" class="chart-bar" chart-data="$ctrl.datachart" responsive="true"
           chart-labels="$ctrl.labelschart" chart-series="" chart-options="$ctrl.optionschart"
           chart-dataset-override="$ctrl.overridechart" chart-click=""
           height="{{$ctrl.heightchart}}"
           >
         </canvas>
       </div>
     </div>
   </div>
 </div>
   `
});
