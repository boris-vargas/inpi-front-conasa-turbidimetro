angular.module('intechApp').component('waitApi', {
   bindings: {
   },
   template: `
   <div>
     <div class="col xs-12 col-md-12">
       <div class="box-body">
         <br>
       </div>

       <div class="overlay" style="text-align:center; ">
         <i class="fa fa-cog fa-spin fa-3x fa-fw" style="color:#404040;"></i>
       </div>
      
       <h4  style="font-size: 12px; color:#404040; text-align: center; padding: auto;">Atualizando...</h4>
     </div>
   </div>
   `
});
