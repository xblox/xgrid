define([
    'dojo/_base/declare',
    'dojo/Deferred',
    'xide/types',
    'xide/factory',
    'xide/mixins/EventedMixin',
    "dgrid/Selection"
],function (declare,Deferred,types, factory, EventedMixin, Selection) {
    var _debug = false;
    /**
     * A minimal base class for the dgrid, used to override some basics and firing
     * a render event
     * */
    return declare('xgrid/Defaults',null,{

        /**
         * Override range from default 25 to 1000
         */
        minRowsPerPage: 1000,
        keepScrollPosition: true,
        rowsPerPage: 20,
        deselectOnRefresh: false,
        cellNavigation: false,
        publishRendering: false,
        _skipFirstRender: false,
        loadingMessage: null,
        preload: null,
        childSelector: ".dgrid-row",
        /**
         * Placeholder
         */
        delegate: {
            onDidRenderCollection: function () {}
        },
        /**
         * Return that this grid has actually rendered anything.
         * @returns {boolean}
         */
        isValid: function () {
            return this._renderIndex >= 0;
        }
    });
});