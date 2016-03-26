/** @module xgrid/Renderer **/
define([
    "xdojo/declare",
    'xide/types'
], function (declare,types) {
    var Implementation = {
        _renderIndex: 0,
        _lastRenderedArray: null,
        publishRendering: false,
        _getLabel:function(){return ''},
        activateRenderer:function(renderer){},
        deactivateRenderer:function(renderer){},
        runAction:function(action){},
        /**
         * Placeholder
         */
        delegate: {
            onDidRenderCollection: function () {}
        },
        /**
         * Override render row to enable model side rendering
         * @param obj
         * @returns {*}
         */
        renderRow: function (obj) {
            if (obj.render) {
                return obj.render(obj, this.inherited);
            }
            return this.inherited(arguments);
        },
        /**
         * Override renderArray in dgrid/List to track the
         * last rendered array
         * @returns {HTMLElement[]}
         */
        renderArray: function () {

            this._lastRenderedArray = this.inherited(arguments);
            this._onDidRenderCollection(arguments);
            return this._lastRenderedArray;
        },
        /**
         * Callback for dgrid/List#refresh promise, used to publish
         * the last rendered collection
         *
         */
        _onDidRenderCollection: function () {

            var info = {
                collection: this._renderedCollection,
                elements: this._lastRenderedArray,
                grid: this
            };
            this._renderIndex++;
        },
        /**
         * Return that this grid has actually rendered anything.
         * @returns {boolean}
         */
        didRender: function () {
            return this._renderIndex >= 0;
        }
    };

    //package via declare
    var _class = declare('xgrid.Renderer',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});