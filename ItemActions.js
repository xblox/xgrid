/** module:xgrid/ItemActions **/
define([
    'dojo/_base/declare',
    'xide/types',
    'xide/action/ActionProvider'
], function (declare, types,ActionProvider) {
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
        itemActions:null,
        getItemActionProvider:function(){
            return this._itemActionProvider;
        },
        setItemActions:function(actions){

            var _actions = actions || this.itemActions || [],
                actionProvider = this._itemActionProvider;

            this._emit('onAddItemActions', {
                actions: _actions,
                provider: actionProvider
            });
            actionProvider.getActions = function () {
                return _actions;
            };

            return actionProvider._registerActions();
        },
        getItemActions:function(){
            return this.itemActions || [];
        },
        startup:function(){

            this.inherited(arguments);

            this._itemActionProvider = new ActionProvider({});

            try {

                var actions = this.itemActions || [],
                    actionProvider = this._itemActionProvider;

                this._emit('onAddItemActions', {
                    actions: actions,
                    provider: actionProvider
                });


                actionProvider.getActions = function () {
                    return actions;
                };
                actionProvider._registerActions();

            }catch(e){
                debugger;
            }
        }

    };

    //package via declare
    var _class = declare('xgrid.ItemActions',null,Implementation);
    _class.Implementation = Implementation;
    return _class;

});