/** @module xgrid/ListRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    './Renderer',
    'dojo/dom-construct',
    'dgrid/Grid'
], function (declare,types,Renderer,domConstruct,Grid) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ListRenderer
     * @extends module:xgrid/Renderer
     */
    var Implementation = {

        _getLabel:function(){ return "List"; },
        _getIcon:function(){ return "fa-th-list"; },
        activateRenderer:function(renderer){
            this._showHeader(true);
        },
        deactivateRenderer:function(renderer){},
        _configColumns: function () {
            return Grid.prototype._configColumns.apply(this, arguments);
        },
        insertRow:function(object,options) {
            return Grid.prototype.insertRow.apply(this, arguments);
        },
        renderRow:function(object,options){

            var self = this;
            var row = this.createRowCells('td', function (td, column) {
                var data = object;
                // Support get function or field property (similar to DataGrid)
                if (column.get) {
                    data = column.get(object);
                }
                else if ('field' in column && column.field !== '_item') {
                    data = data[column.field];
                }
                self._defaultRenderCell.call(column, object, data, td, options);
            }, options && options.subRows, object);
            // row gets a wrapper div for a couple reasons:
            // 1. So that one can set a fixed height on rows (heights can't be set on <table>'s AFAICT)
            // 2. So that outline style can be set on a row when it is focused,
            // and Safari's outline style is broken on <table>
            var div = domConstruct.create('div', { role: 'row' });
            div.appendChild(row);
            return div;
        }
    };

    //package via declare
    var _class = declare('xgrid.ListRenderer',[Renderer],Implementation);
    _class.Implementation = Implementation;

    return _class;
});