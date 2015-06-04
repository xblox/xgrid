/** @module xgrid/GridActions **/
define([
    "xdojo/declare",
    "xide/types",
    "./Toolbar",
    "xide/views/_ActionMixin"
], function (declare,types,Toolbar,_ActionMixin) {
    /**
     * A grid feature
     * @class module:xgrid/GridActions
     * @augments xgrid/Toolbar
     */
    var Implementation = {
        /**
         * Instance to an _ActionMixin, used as action provider
         * @type {module:xide/views/_ActionMixin}
         */
        _gridActionProvider:null,
        getGridActionProvider:function(){
            return this._gridActionProvider;
        },
        startup:function(){

            this.inherited(arguments);

            this._gridActionProvider = new _ActionMixin({});

            var actions = [],
                container = this.domNode,
                ACTION_TYPE = types.ACTION,
                ACTION_ICON = types.ACTION_ICON,
                actionProvider = this._gridActionProvider,
                thiz = this,
                toolbar = this.getToolbar();


            actions.push(actionProvider.createActionParameters('SAVE', ACTION_TYPE.SAVE, 'save', types.ACTION_ICON.SAVE, function () {

            }, 'Enter | F4', ['f4', 'enter'], null, container, thiz,{
                widgetArgs:{
                    style:"float:left"
                }
            }));

            actions.push(actionProvider.createActionParameters('Edit', ACTION_TYPE.EDIT, 'edit', types.ACTION_ICON.EDIT, function () {

            }, 'Enter | F4', ['f4', 'enter'], null, container, thiz,{
                widgetArgs:{
                    style:"float:right"
                }
            }));

            this._emit('onAddGridActions',{
                actions:actions,
                provider:actionProvider
            });


            actionProvider.getActions = function(){
                return actions;
            };
            actionProvider._registerActions();
            var viewActions = actionProvider.getItemActions();
            /*toolbar.setItemActions({},viewActions);*/

        }

    };

    //package via declare
    var _class = declare('xgrid.GridActions',[Toolbar],Implementation);
    _class.Implementation = Implementation;
    return _class;
});
