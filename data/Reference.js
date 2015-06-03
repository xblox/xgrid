/** @module xgrid/data/Reference **/
define([
    "xdojo/declare"
], function (declare) {

    /**
     * A grid item feature
     * @class module:xgrid/data/Reference
     */
    var Implementation = {

        _sources:[],
        addSource:function(source){},
        removeSource:function(source){},

        updateSource:function(sources){},
        updateSources:function(sources){},

        onSourceUpdate:function(source){},

        onSourceRemoved:function(source){},
        onSourceDelete:function(source){}

    };
    //package via declare
    var _class = declare('xgrid.data.Reference',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});