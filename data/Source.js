define([
    "xdojo/declare"
], function (declare) {


    var Implementation={
        
        _references:[],
        addReference:function(Reference){},
        removeReference:function(Reference){},

        updateReference:function(References){},
        updateReferences:function(References){},

        onReferenceUpdate:function(Reference){},

        onReferenceRemoved:function(Reference){},
        onReferenceDelete:function(Reference){}

    };

    //package via declare
    var _class = declare('xgrid.data.Source',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});