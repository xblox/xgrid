/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/widgets/ActionToolbar',
    './Layout',
    'dojo/dom-class',
    './Actions'
], function (declare,types,utils,ActionToolbar,Layout,domClass,Actions) {

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
                "class":"dijit dijitToolbar",
                style:'min-height:30px;height:auto;width:100%',
                subscribes:{
                    'onSetItemsActions':false
                }
            },this,this.header,true);
        },
        /**
         * callback when user clicks on the grid view (not an item), triggered ./Actions
         */
        onContainerClick:function(){
            this.getToolbar().setItemActions(this.getSelection()[0],this._getActionsFiltered('view'));
            this.inherited(arguments);
        },
        /**
         * callback when user clicks on an item, triggered in ./Actions
         */
        onItemClick:function(){
            var itemActions = this._getActionsFiltered('item');
            this.getToolbar().setItemActions(this.getSelection()[0],itemActions);
            this.inherited(arguments);
        }
    };

    //package via declare
    var _class = declare('xgrid.Toolbar',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});