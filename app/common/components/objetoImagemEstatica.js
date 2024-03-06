angular.module('intechApp').component('imgObj', {
   bindings: {
      titulo: '@',
      img: '@',
      imagesize:'@',
      imagetop:'@',
      largura:'@'
   },
   template: `

   <div class="{{$ctrl.largura}}">
     <div class="box box-primary" >
       <div class="box-header with-border"  style="height: 30px;">
         <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
       </div>
       <div class="small-box bg-light" style="cursor: auto ;margin-top:0px;">
         <div class="user-panel" style="height:auto;">
         <img height="auto" width="{{$ctrl.imagesize}}" style="margin-top:{{$ctrl.imagetop}}px;" ng-src="/assets/imgs/general/{{$ctrl.img}}" class="img-responsive center-block"/>
         </div>
         <div class="icon">
           <i class="ion ion-bag"></i>
         </div>

       </div>

     </div>
   </div>

   `
});
