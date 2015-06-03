/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'dstore/Trackable'
], function (declare,types,utils,Trackable) {
    /**
     * A grid feature
     * @class module:xgrid/data/ObservableStore
     */
    var Implementation={

    };

    //package via declare
    var _class = declare('xgrid.Toolbar',[Trackable],Implementation);
    _class.Implementation = Implementation;

    return _class;
});