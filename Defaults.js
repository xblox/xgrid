/** @module xgrid/Defaults **/
define([
    'dojo/_base/declare'
], function (declare) {
    /**
     * xGrid defaults
     * */
    return declare('xgrid/Defaults', null, {

        minRowsPerPage: 100,
        keepScrollPosition: true,
        rowsPerPage: 30,
        deselectOnRefresh: false,
        cellNavigation: false,
        _skipFirstRender: false,
        loadingMessage: null,
        preload: null,
        childSelector: ".dgrid-row",
        addUiClasses: false
    });
});
