/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/widgets/ActionToolbar',
    './Layout'
], function (declare,types,utils,ActionToolbar,Layout) {

    /**
     * A grid feature
     * @class module:xgrid/Toolbar
     * @extends xgrid/Layout
     */
    var Implementation = {
        _toolbar:null,
        getToolbar:function(){
          return this._toolbar;
        },
        buildRendering:function(){

            this.inherited(arguments);
            this._toolbar = utils.addWidget(ActionToolbar,{
                style:'height:30px;width:100%',
                //disable global integration
                subscribes:{
                    'onSetItemsActions':false
                }
            },this,this.header,true);
        }
    };

    //package via declare
    var _class = declare('xgrid.Toolbar',[Layout],Implementation);
    _class.Implementation = Implementation;

    return _class;
});