angular.module('knob',[])

	.directive('knob', function(){
		return {
			restrict: 'E',
			link: function(scope, el, atts){
				el.knob();		
			}

		}

	})