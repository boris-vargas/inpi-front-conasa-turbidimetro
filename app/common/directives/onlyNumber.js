var module = angular.module( "intechApp" )

module.directive('onlyNumber', function() {
    return {
      require: "ngModel",
      link: function(scope, element, attr, ngModelCtrl){
        function fromUser(text) {
            if (text) {
              var strTemp = text.toString()
                var transformedInput = strTemp.replace(/[^0-9]/g, '');

                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            return undefined;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    }

})
