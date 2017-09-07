/** @module xgrid/Defaults **/
define([
    'xdojo/declare'
], declare => /**
 * xGrid defaults
 * */
declare('xgrid/Defaults', null, {
    minRowsPerPage: 100,
    keepScrollPosition: true,
    rowsPerPage: 30,
    deselectOnRefresh: false,
    cellNavigation: false,
    _skipFirstRender: false,
    loadingMessage: null,
    preload: null,
    childSelector: ".dgrid-row",
    addUiClasses: false,
    noDataMessage: '<span class="textWarning">No data....</span>',
    showExtraSpace:true,
    expandOnClick:true
}));
