
angular.module('intechApp').factory('focus', [
  '$timeout',
  '$window',
  focus
])

function focus($timeout,$window) {

return  function(id) {
  $timeout(function() {
    var element = $window.document.getElementById(id);
    if(element){
      element.focus();
      element.select();
    }
  });
}

}
