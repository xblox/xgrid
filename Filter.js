/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'dojo/dom-construct'
], (declare, domConstruct) => {

    var Implementation = {
        showFooter: true,
        buildRendering: function () {
            this.inherited(arguments);
            var grid = this;
            var filterNode = this.filterNode = domConstruct.create('div', {
                className: 'dgrid-filter'
            }, this.footerNode);

            this.filterStatusNode = domConstruct.create('div', {
                className: 'dgrid-filter-status'
            }, filterNode);

            var inputNode = this.filterInputNode = domConstruct.create('input', {
                className: 'dgrid-filter-input',
                placeholder: 'Filter (regex)...'
            }, filterNode);
            this._filterTextBoxHandle = on(inputNode, 'keydown', debounce(() => {
                grid.set("collection", grid.collection);
            }, 250));
        },
        destroy: function () {
            this.inherited(arguments);
            if (this._filterTextBoxHandle) {
                this._filterTextBoxHandle.remove();
            }
        },
        _setCollection: function (collection) {
            this.inherited(arguments);
            var value = this.filterInputNode.value;
            var renderedCollection = this._renderedCollection;
            if (renderedCollection && value) {
                var rootFilter = new renderedCollection.Filter();
                var re = new RegExp(value, "i");
                var columns = this.columns;
                var matchFilters = [];
                for (var p in columns) {
                    if (columns.hasOwnProperty(p)) {
                        matchFilters.push(rootFilter.match(columns[p].field, re));
                    }
                }
                var combined = rootFilter.or.apply(rootFilter, matchFilters);
                var filtered = renderedCollection.filter(combined);
                this._renderedCollection = filtered;
                this.refresh();
            }
        },
        refresh: function() {
            var res = this.inherited(arguments);
            var value = this.filterInputNode.value;
            if (value) {
                this.filterStatusNode.innerHTML = this.get('total') + " filtered results";
            }else {
                this.filterStatusNode.innerHTML = "";
            }
            return res;
        }
    };
    //package via declare
    var _class = declare('xgrid.Filter',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});