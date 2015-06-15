/** @module xgrid/GridActions **/
define([
    "xdojo/declare",
    "xide/types",
    'xide/action/ActionProvider'
], function (declare,types,ActionProvider) {
    /**
     * A grid feature
     * @class module:xgrid/GridActions
     * @augments xgrid/Toolbar
     */
    var Implementation = {
        /**
         * Instance to an _ActionMixin, used as action provider
         * @type {module:xide/views/ActionProvider}
         */
        _gridActionProvider:null,
        gridActions:[],
        getGridActionProvider:function(){
            return this._gridActionProvider;
        },
        startup:function(){

            if(this._started){
                return;
            }
            this.inherited(arguments);

            this._gridActionProvider = new ActionProvider({});

            var actions = this.gridActions || [],
                container = this.domNode,
                ACTION_TYPE = types.ACTION,
                ACTION_ICON = types.ACTION_ICON,
                actionProvider = this._gridActionProvider,
                thiz = this;

            //collect all actions from plugins and features
            this._emit('onAddGridActions',{
                actions:actions,
                provider:actionProvider
            });


            actionProvider.getActions = function(){
                return actions;
            };
            actionProvider._registerActions();

            //var viewActions = actionProvider.getItemActions();
        }
    };

    //package via declare
    var _class = declare('xgrid.GridActions',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});
