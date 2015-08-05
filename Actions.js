define([
    "xdojo/declare",
    'dojo/dom-class',
    'xide/action/ActionStore',
    'xide/mixins/ActionProvider'
], function (declare,domClass,ActionStore,ActionProvider) {

    /**
     *
     * All about actions
     *
     * @type
     */
    var Implementation = {

        refreshActions:function(){
            var allActions = this.getActions();
            var selection = this.getSelection();
            for (var i = 0; i < allActions.length; i++) {
                var action = allActions[i];
                if(action.refresh) {
                    action.refresh(selection);
                }
            }
        },
        runAction:function(action){
            console.log('Actions : run action',action);
            return this.inherited(arguments);

        },
        /**
         * Callback when selection changed, refreshes all actions
         * @param evt
         * @private
         */
        _onSelectionChanged:function(evt){

            this.inherited(arguments);
            this.refreshActions();
        },


        ////////////////////////////////////////////////////////////////////////////
        //
        //  Original ActionMixin
        //
        ///////////////////////////////////////////////////////////////////////////
        resetActions:function(){

            for (var action in this.actions){
                this.actions[action].destroy();
            }

            delete this.actions;

            for (var i = 0; i < this.keyboardMappings.length; i++) {
                this.keyboardMappings[i].destroy();
            }

            delete this.keyboardMappings;

            this._registerActions();

        },
        __createActionStore:function(){
            if(!this.actionStore){
                var _actions = this._completeActions(this.actions || []);
                this.actionStore = new ActionStore({
                    data:_actions,
                    observedProperties:[
                        "value",
                        "disabled"
                    ]
                });
            }
            return this.actionStore;
        },
        /////////////////////////////////////////////////////
        //
        //
        /////////////////////////////////////////////////////
        /**
         *
         * @param provider
         * @param target
         */
        updateActions:function(provider,target){

            var actions,
                actionsFiltered,
                provider,
                selection = this.getSelection();

            if(provider && target){

                actions = provider.getItemActions();

                actionsFiltered = this._filterActions(selection,actions,provider);

                target.setItemActions({},actionsFiltered);

            }else{
                console.error('updateActions : have no provider or target' );
            }

        },
        _filterActions:function(selection,actions,actionProvider){
            var result = [];
            for (var i = 0; i < actions.length; i++) {
                var _action = actions[i];
                if(_action.shouldShow && _action.shouldShow()==false){
                    continue;
                }
                if(this.shouldShowAction && this.shouldShowAction(_action,selection,actionProvider)==false){
                    continue;
                }
                result.push(_action);
            }
            return result;
        },


        /**
         * Startup
         */
        startup:function(){

            if(this._started){
                return;
            }

            this.inherited(arguments);

            try {
                var thiz = this;



                var clickHandler = function (evt) {
                    if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                        thiz.select([],null,false);
                        thiz.deselectAll();
                        if(thiz.onContainerClick) {
                            thiz.onContainerClick();
                        }
                    } else {
                        if(thiz.onItemClick) {
                            thiz.onItemClick();
                        }
                    }
                };

                this.on("click", function (evt) {
                    clickHandler(evt);
                }.bind(this));

                this.on("contextmenu", function (evt) {
                    clickHandler(evt);
                }.bind(this));


                this._on('selectionChanged', function (evt) {
                    this._onSelectionChanged(evt);
                }.bind(this));

            }catch(e){
                debugger;
            }

        }
    };
    //package via declare
    var _class = declare('xgrid.Actions',ActionProvider,Implementation);
    _class.Implementation = Implementation;
    return _class;
});