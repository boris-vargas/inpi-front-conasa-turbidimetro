(()=>{
	
	angular.module("intechApp").component("silosB", {
		bindings: {
			titulo: "@",
			valor: "@",
			unidade: "@",
			mmin: "@",
			min: "@",
			max: "@",
			mmax: "@",
		},
		template: ` 
			<div class="col-xs-12 col-md-3 col-lg-3">
		        <div class="box box-primary">
		            <div class="box-header with-border" style="height: 30px;">
		                <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{ $ctrl.titulo }}</p>
		            </div>
		            <div class="box-header" style="height: 147px; padding-top: 0px">
		                <div class="inner siloReto" style="margin-top: 0;transform: translateY(-5px);">

		                    <div class="xsilo xprogress">
		                    	<div class="pos-a">
			                    	<div class="xvalues">    
			                	        <label style="color: {{$ctrl.color}}">{{ $ctrl.valormostrar }}<span style="font-size: 10px; padding-left:3px;">{{$ctrl.unidade}}</span></label>
			                    	</div>
			                    </div>
		                    	<div class="xbarra" id="{{ $ctrl.idCor }}" style="height: {{$ctrl.porcento}}%"></div>
		                    </div>
							
							<div class="flex jcc aic lateral">
			                    <div class="xmark">
			                        <i class="fa fa-chevron-right" style="top: calc({{$ctrl.marque1}}%); {{ $ctrl.classDisplay2 }}" aria-hidden="true"></i>
			                        <i class="fa fa-chevron-right" style="top: calc({{$ctrl.marque2}}%); {{ $ctrl.classDisplay2 }}" aria-hidden="true"></i>
			                        <i class="fa fa-chevron-right" style="top: calc({{$ctrl.marque3}}% - 7px); {{ $ctrl.classDisplay2 }}" aria-hidden="true"></i>
			                        <i class="fa fa-chevron-right" style="top: calc({{$ctrl.marque4}}% - 7px); {{ $ctrl.classDisplay2 }}" aria-hidden="true"></i>
			                    </div>
			                    <div class="xscale">
			                        <div class="xgrayback" style="bottom: {{$ctrl.porcento}}%"></div>
			                        <div class="xstrips"></div>
			                    </div>
			                    <div class="xscalelabels">    
			                        <label style="top: calc({{$ctrl.marque1}}% - 2px); {{ $ctrl.classDisplay1 }}">{{ $ctrl.mmax }}</label>
			                        <label style="top: calc({{$ctrl.marque2}}% - 2px);">{{ $ctrl.max }}</label>
			                        <label style="top: calc({{$ctrl.marque3}}% - 7px);">{{ $ctrl.min }}</label>
			                        <label style="top: calc({{$ctrl.marque4}}% - 7px); {{ $ctrl.classDisplay2 }}">{{ $ctrl.mmin }}</label>
			                    </div>
			                </div>

		                </div>
		            </div>
		        </div>
		    </div>
		`,
		controller:[
            '$scope',
            '$element',
            'gridSystem',
            'trocaDados',

            function($scope, $element, gridSystem, trocaDados){
                const vm = this
                vm.valor2 = 0.0
                setTimeout(() => {
                    vm.gridClasses = gridSystem.toCssClasses(vm.grid)             
                })

                function map(x, in_min, in_max, out_min, out_max) {
                    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
                }

                vm.porcento = map(vm.valor, vm.mmax, vm.mmin, 0, 100).toFixed(1)

                if (vm.porcento < 0) {
                	vm.porcento = 0
                }

                $scope.$watch(()=>{
                    return vm.valor
                }, ()=>{

					vm.porcento = map(vm.valor, vm.mmax, vm.mmin, 100, 0)
					
					vm.valor = parseFloat(vm.valor).toFixed(1)

					if (vm.unidade == "%") {
                		vm.valormostrar = vm.porcento.toFixed(1).replace(".", ",")
					}else{
                		vm.valormostrar = (vm.valor).toFixed(1).replace('.', ',')
					}

                	
                	if (parseFloat(vm.valor) > parseFloat(vm.min)) {
                		vm.idCor = "green"
                	}else if (parseFloat(vm.valor) < parseFloat(vm.min)) {
                		vm.idCor = "red"
                	}

                	vm.marque1 = map(vm.mmax, vm.mmin, vm.mmax, 100, 0)
                	vm.marque2 = map(vm.max, vm.mmin, vm.mmax, 100, 0)
                	vm.marque3 = map(vm.min, vm.mmin, vm.mmax, 100, 0)
                	vm.marque4 = map(vm.mmin, vm.mmin, vm.mmax, 100, 0)
                    
                	if (vm.marque2 <= 9) {
                		vm.classDisplay1 = "display: none;";
                	}else{
                		vm.classDisplay1 = "display: block;"
                	}

                	if (vm.marque3 >= 91) {
                		vm.classDisplay2 = "display: none;";
                	}else{
                		vm.classDisplay2 = "display: block;"
                	}

                	if (vm.porcento <= 63){
                		vm.color = "rgba(0,0,0,0.7)"
                	}else{
                		vm.color = "white"
                	}

                })
            }
        ]
	})

})()