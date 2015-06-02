/** @module xgrid/ListRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    './Renderer'
], function (declare,types,Renderer) {

    var Implementation = {

    };

    //package via declare
    var _class = declare('xgrid.Renderer',[Renderer],Implementation);
    _class.Implementation = Implementation;

    return _class;
});