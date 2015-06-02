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
         *
         * @type {module:xide/views/_ActionMixin}
         */
        _gridActionProvider:null,
        postCreate:function(){

            this._gridActionProvider = new _ActionMixin({});

            this.inherited(arguments);
        },
        startup:function(){

            this.inherited(arguments);

            var actions = [],
                container = this.domNode,
                ACTION_TYPE = types.ACTION,
                ACTION_ICON = types.ACTION_ICON,
                actionProvider = this._gridActionProvider,
                thiz = this,
                toolbar = this.getToolbar();

            actions.push(actionProvider.createActionParameters('Edit', ACTION_TYPE.EDIT, 'edit', types.ACTION_ICON.EDIT, function () {

            }, 'Enter | F4', ['f4', 'enter'], null, container, thiz,{
                widgetArgs:{
                    style:"float:right"
                }
            }));
            actionProvider.getActions = function(){
                return actions;
            };
            actionProvider._registerActions();
            var viewActions = actionProvider.getItemActions();
            toolbar.setItemActions({},viewActions);



        }

    };
    //package via declare
    var _class = declare('xgrid.GridActions',[Toolbar],Implementation);
    _class.Implementation = Implementation;
    return _class;
});
