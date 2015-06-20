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

            this.getToolbar().setItemActions({},this._getActionsFiltered('view'));

            //this.updateActions(this.getGridActionProvider ? this.getGridActionProvider() : null,this.getToolbar());

            this.inherited(arguments);
        },
        /**
         * callback when user clicks on an item, triggered in ./Actions
         */
        onItemClick:function(){
            //this.updateActions(this.getItemActionProvider ? this.getItemActionProvider() : null,this.getToolbar());
            this.getToolbar().setItemActions({},this._getActionsFiltered('item'));
            this.inherited(arguments);
        },
        _onSelectionChanged:function(evt){
            this.onItemClick();
            this.inherited(arguments);
        },
        startup:function(){

            if(this._started){
                return;
            }
            this.inherited(arguments);
        }
    };

    //package via declare
    var _class = declare('xgrid.Toolbar',[_Actions],Implementation);
    _class.Implementation = Implementation;

    return _class;
});