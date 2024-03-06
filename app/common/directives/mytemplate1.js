var module = angular.module( "intechApp" );

module.directive('myTemplate', function($rootScope, $compile) {
    return {
    controller: function($element, $scope) {
        var vm = this;
        vm.name = "name";

      vm.insert = function() {
        var elStr = "<slideshow></slideshow>";
        var newScope = $rootScope.$new();
        var insertedEl = $compile(elStr)(newScope);
        $element.append(insertedEl);
      };
    },
    controllerAs: "vm",
    template: "<h1>Header</h1><p>Body</p><footer>Footer</footer><button ng-click='vm.insert()'>Add Component</button>"
  }
});


module.directive("slideshow", function() {
    return {
    controller: function() {
        this.text = "THIS IS A SLIDESHOW";
    },
    controllerAs: "vm",
    template: "<h1>{{vm.text}}</h1>"
  }
});
