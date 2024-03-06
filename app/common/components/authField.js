(function(){
angular.module('intechApp').component('authField', {
	bindings: {
	id: '@',
	label: '@',
	type: '@',
	grid: '@',
	icon: '@',
	model: '=',
	placeholder: '@',
	valor: '@',
	hide: '<'
	},
	controller: function() {
		this.$onInit = () => {
			this.iconClasses = `glyphicon glyphicon-${this.icon} form-controlfeedback`
		}
	},
	template: `
		<div class="col-xs-12">
			<input ng-model="$ctrl.model" id="{{ $ctrl.id }}" class="form-control input-sm" type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}" ng-hide="$ctrl.hide"/>
			<span class="{{ $ctrl.iconClasses }}"></span>
		</div>
	`
})
})()
