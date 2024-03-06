angular.module('intechApp').factory('popups', [
  'Popeye',
  '$http',
  'consts',

  abrirPopups
])

function abrirPopups(Popeye,$http,consts) {
  const vm = this
  const url = consts.apiUrl
  var empresas = {}

  var abrirPopupEmpresas =  function  (controllerTemplate, controllerAsTemplate) {
    const templateHtml = `
  <div>
    <div class="col-xs-12 col-md-12">
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">Empresas cadastradas</h3>
          <div class="input-group" style="margin-top:7px;">
            <div class="input-group-btn">
              <button type="button" class="btn btn-success" ng-click="${controllerAsTemplate}.empresaSearch()" uib-tooltip="Buscar"><i class="fa fa-share"></i></button>
            </div>
            <input type="text" class="form-control" ng-model="${controllerAsTemplate}.empresaSearchValue" ng-change="${controllerAsTemplate}.empresaSearch()" placeholder="Busca...">
          </div>
        </div>

        <div class="box-body">
          <div>
            <div class="box-body table-responsive no-padding" style="height:150px;">
              <table class="table table-hover">
                <tr class="info" style="font-size:12px;">
                  <th  width="200" style="text-align: left;">Razão Social</th>
                </tr>
                <tr ng-repeat="empresass in ${controllerAsTemplate}.empresas">
                  <td style="font-size:12px; text-align: left;vertical-align: middle;"><i class="fa fa-industry"></i><a class="" href="" title="Seleciona" target="_blank" ng-click="${controllerAsTemplate}.clickRowEmpresas($index)"> {{empresass.nome}}</td>
                </tr>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div class="modal-footer">
          <button class="btn btn-primary" type="button" ng-click="${controllerAsTemplate}.okEmpresas()">OK</button>
          <button class="btn btn-warning" type="button" ng-click="$close()">Cancel</button>
      </div>
  </div>
`
//============================================================================================
//Lista todas as empresas
//============================================================================================
  Popeye.openModal({
    template: templateHtml,//'../_dashboard/modal.html' ,
    containerClass: "demo-container zoom",
    controller: controllerAsTemplate
  });
}

return {abrirPopupEmpresas:abrirPopupEmpresas}
}
