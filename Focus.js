define([
    "xdojo/declare",
    "xide/types",
    "xide/utils"
], function (declare,types,utils) {

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
        _onFocusChanged:function(focused,type){


            if(this._focused && !focused){
                this._onBlur();

                //console.log('lost focus '  + this.id);
                /*
                if(this.id==='xide_widgets_TemplatedWidgetBase_0'){
                    console.log('   left blur');
                }
                */
            }

            if(!this._focused && focused){
                this._emit(types.EVENTS.ON_VIEW_SHOW,this);
            }

            this._focused = focused;

            this.highlight  && this.highlight(focused);
        },
        getFocused:function(domNode){
            if(this._focusedNode){
                return this.row(this._focusedNode)[domNode? 'element' : 'data' ];
            }
            return null;
        },
        startup:function(){

            this.inherited(arguments);

            var thiz = this,
                node = thiz.domNode.parentNode;

            this._focused  = this.isActive();

            function _detectBlur(element) {

                var testNode = element.target,
                    row = thiz.row(testNode);

                var node = node = thiz.domNode;

                if(utils.isDescendant(node,testNode)) {
                    var active = thiz.isActive();
                    thiz._onFocusChanged(active, ' blur',testNode);

                }
            }

            function _detectFocus(element) {

                //thiz._onFocusChanged(thiz.isActive());

                var testNode = element.target;

                if(utils.isDescendant(node,testNode)){

                    thiz._onFocusChanged(thiz.isActive(testNode),'focus',testNode);
                    /*
                     if(thiz._lostFocus){
                     thiz._lostFocus=false;
                     thiz._onFocus();
                     }
                     */
                }

            }

            this._detectFocus = _detectFocus;
            this._detectBlur = _detectBlur;

            function attachEvents() {
                window.addEventListener ? window.addEventListener('focus', _detectFocus, true) : window.attachEvent('onfocusout', _detectFocus);
                window.addEventListener ? window.addEventListener('blur', _detectBlur, true) : window.attachEvent('onblur', _detectBlur);
            }
            attachEvents();

        }

    };
    //package via declare
    var _class = declare('xgrid.Focus',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});