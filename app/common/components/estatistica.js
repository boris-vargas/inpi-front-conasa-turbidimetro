angular.module('intechApp').component('estatistica', {
    bindings: {
        dowloadclickest: '&',
        titulo: '@',
        numamostras: '<',
        percentil: '<',
        calc01value: '<',
        calc01perc: '<',
        calc02value: '<',
        calc02perc: '<',
        calc03value: '<',
        calc03perc: '<',
        calc04value: '<',
        calc04perc: '<',
        calc05value: '<',
        calc05perc: '<',
        calc06value: '<',
        calc06perc: '<',
        calc07value: '<',
        calc07perc: '<',
        calc08value: '<',
        calc08perc: '<',

    },
    template: `
<div class="col-xs-12 col-md-3" id="relatorio">
<div class="box box-primary">
    <div class="box-header with-border" style="height: 30px;">
        <p style="font-size:12px; margin-top:-3px; text-align: center; ">{{$ctrl.titulo}}</p>
        <br>
        <p ng-click="$ctrl.dowloadclickest()" class="icon-p" uib-tooltip="Exportar para excel"><i
                class="fa fa-file-excel-o" aria-hidden="true"></i></p>
    </div>
    <div class="small-box" style="pointer-events: none;">
        <div class="inner" style="width: 100%; height: 70%;">
            <div class="div-label-amostras">
                <span class="control-label">Amostras</span>
                <span class="control-label label-amostras-valor">{{$ctrl.numamostras}}</span>
                <span class="control-label label-amostras-valor"></span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">Percentil 95%</span>
                <span class="control-label label-amostras-valor">{{$ctrl.percentil |
                    number:2}}</span>
                <span class="control-label label-amostras-percent"></span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">2,2 &#60 X</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc01value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc01perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">1,9 &#60 X &#60= 2,2</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc02value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc02perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">1,6 &#60 X &#60= 1,9</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc03value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc03perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">1,3 &#60 X &#60= 1,6</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc04value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc04perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">1 &#60 X &#60= 1,3</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc05value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc05perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">0,5 &#60 X &#60= 1</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc06value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc06perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">0,3 &#60 X &#60= 0,5</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc07value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc07perc |
                    number:1}}%</span>
            </div>
            <div class="div-label-amostras">
                <span class="control-label">X &#60= 0,3</span>
                <span class="control-label label-amostras-valor">{{$ctrl.calc08value}}</span>
                <span class="control-label label-amostras-percent">{{$ctrl.calc08perc |
                    number:1}}%</span>
            </div>

        </div>
    </div>
</div>
</div>
`
});