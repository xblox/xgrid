/** module:xgrid/ItemActions **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/types',
    'xide/Keyboard',
    'xide/bean/Action',
    'xide/views/_ActionMixin',
    './_Actions'
], function (declare, utils, types, Keyboard, Action,_ActionMixin,_Actions) {

    /**
     * A grid feature
     * @class module:xgrid/GridActions
     */
    var Implementation = {
        /**
         * Instance to an _ActionMixin, used as action provider
         * @type {module:xide/views/_ActionMixin}
         */
        _itemActionProvider:null,
        getItemActionProvider:function(){
            return this._itemActionProvider;
        },
        getItemActions:function(){

            var provider = this.getItemActionProvider();
            var actions = provider.getItemActions();
            return this._filterActions(this.getSelection(),actions,provider);

        },
        startup:function(){

            this.inherited(arguments);

            this._itemActionProvider = new _ActionMixin({});

            var actions = [],
                container = this.domNode,
                ACTION_TYPE = types.ACTION,
                ACTION_ICON = types.ACTION_ICON,
                actionProvider = this._itemActionProvider,
                thiz = this;



            actions.push(actionProvider.createActionParameters('Edit', ACTION_TYPE.EDIT, 'edit', types.ACTION_ICON.EDIT, function () {

            }, 'Enter | F4', ['f4', 'enter'], null, container, thiz,{
                widgetArgs:{
                    style:"float:right"
                }
            }));



            this._emit('onAddItemActions',{
                actions:actions,
                provider:actionProvider
            });


            actionProvider.getActions = function(){
                return actions;
            };
            actionProvider._registerActions();


            /*
            var contextMenu = this.getContextMenu ? this.getContextMenu(): null;
            if(contextMenu){
                contextMenu.setItemActions({},this.getItemActions());
            }
            */



            /*var viewActions = actionProvider.getItemActions();*/

        }

    };

    //package via declare
    var _class = declare('xgrid.ItemActions',null,Implementation);
    _class.Implementation = Implementation;
    return _class;

});