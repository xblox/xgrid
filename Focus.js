define([
    "xdojo/declare"
], function (declare) {

    var Implementation = {
        getFocused:function(domNode){
            if(this._focusedNode){
                return this.row(this._focusedNode)[domNode? 'element' : 'data' ];
            }
            return null;
        }
    };
    //package via declare
    var _class = declare('xgrid.Focus',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});