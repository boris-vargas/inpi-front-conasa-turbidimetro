angular.module('intechApp').component('noresApiWait', {
   bindings: {
   },
   template: `
   <div>
     <div class="col xs-12 col-md-12">
       <div class="box-body">
         <br>
       </div>
       <div class="overlay">
         <i class="fa fa-exclamation fa-3x"></i>
       </div>
       <div style="height:30px;"></div>
       <h4 style="background-color:white; font-size: 12px; text-align: center; padding: 7px 10px; margin-top: 0;">
         Aguardando componentes...
       </h4>
     </div>
   </div>
   `
});
