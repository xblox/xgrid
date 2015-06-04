/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/widgets/ActionToolbar',
    './Layout',
    'dojo/dom-class',
    './_Actions'
], function (declare,types,utils,ActionToolbar,Layout,domClass,_Actions) {

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

        },
        onContainerClick:function(){
            this.updateActions(this.getGridActionProvider ? this.getGridActionProvider() : null,this.getToolbar());
            this.inherited(arguments);
        },
        onItemClick:function(){
            this.updateActions(this.getItemActionProvider ? this.getItemActionProvider() : null,this.getToolbar());
            this.inherited(arguments);
        },
        startup:function(){

            if(this._started){
                return;
            }
            this.inherited(arguments);
            this.onContainerClick();
        }
    };

    //package via declare
    var _class = declare('xgrid.Toolbar',[Layout,_Actions],Implementation);
    _class.Implementation = Implementation;

    return _class;
});