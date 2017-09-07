define([
    "xdojo/declare",
    "xide/types",
    "xide/utils"
], (declare, types, utils) => {

    var Implementation = {
        _focused:false,
        _detectFocus:null,
        _detectBlur:null,
        destroy:function(){
            this.inherited(arguments);
            window.removeEventListener('focus', this._detectFocus, true);
            window.removeEventListener('blur', this._detectBlur, true);
        },
        _onBlur:function(){
        },
        set:function(what,value){
            if(what=='focused'){
                this._onFocusChanged(value);
              }
            return this.inherited(arguments);
        },
        _onFocusChanged:function(focused,type){
            if(this._focused && !focused){
                this._onBlur();
            }
            if(!this._focused && focused){
                this._emit(types.EVENTS.ON_VIEW_SHOW,this);
            }
            this._focused = focused;
            this.highlight  && this.highlight(focused);
        },
        getFocused:function(domNode){
            if(this._focusedNode){
                var row = this.row(this._focusedNode);
                if(row){
                    return row[domNode? 'element' : 'data' ];
                }
            }
            return null;
        },
        startup:function(){
            this.inherited(arguments);
            var thiz = this,
                node = thiz.domNode.parentNode;


            //@TODO: /active=true
            this.headerNode.tabIndex=-1;
            this._focused  = true;
        }

    };
    //package via declare
    var _class = declare('xgrid.Focus',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});