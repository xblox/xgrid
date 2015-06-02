/** @module xgrid/Defaults **/
define([
    'dojo/_base/declare'
],function (declare) {
    /**
     * A minimal base class for the dgrid, used to override some basics in dgrid.
     * */
    return declare('xgrid/Defaults',null,{

        minRowsPerPage: 1000,
        keepScrollPosition: true,
        rowsPerPage: 20,
        deselectOnRefresh: false,
        cellNavigation: false,
        _skipFirstRender: false,
        loadingMessage: null,
        preload: null,
        childSelector: ".dgrid-row"
    });
});