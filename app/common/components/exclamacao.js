angular.module('intechApp').component('exclamacao', {
   bindings: {
     texto:'@',
     color: '@'
   },
   template: `
   <div>
     <div class="col xs-12 col-md-12">
       <div class="box-body">
         <br>
       </div>
       <div class="overlay" style="display: table; margin: 0 auto;">
         <i class="fa fa-exclamation fa-3x"></i>
       </div>
       <div style="height:30px;"></div>
       <h4 style="background-color:white; color:{{$ctrl.color}}; font-size: 12px; text-align: center; padding: 7px 10px; margin-top: 0;">
        {{$ctrl.texto}}
       </h4>
     </div>
   </div>
   `
});
