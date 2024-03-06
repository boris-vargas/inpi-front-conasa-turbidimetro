var module = angular.module( "intechApp" );

module.directive('dynamicbar', function() {
  return {
    scope: {
      data: '='
    },
    link: function(scope, element) {
      element.sparkline(scope.data, {
        type: 'line',
        barColor: 'green',
        width: 80,
        height: '20',
        barWidth: 4,
        barSpacing: 1,
        colorMap: ["green", "green", "green"],
        chartRangeMin: 0
      });
    }
  }
})
