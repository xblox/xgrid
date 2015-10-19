define([
    "xdojo/declare",
    'xide/types',
    'xide/action/ActionStore',
    'xide/mixins/ActionProvider'
], function (declare,types,ActionStore,ActionProvider) {

    /**
     *
     * All about actions
     */
    var Implementation = {

        /**
         * Callback when action is performed:before (xide/widgets/_MenuMixin)
         * @param action {module:xide/bean/Action}
         */
        onBeforeAction:function(action){

            /*
            this._a = this._preserveSelection();

            console.log('on before');
            console.dir(this._a);
            */

        },
        /**
         * Callback when action is performed: after (xide/widgets/_MenuMixin)
         * @param action {module:xide/bean/Action}
         */
        onAfterAction:function(action){

            /*
            console.log('on after');
            console.dir(this._a);
            */

        },
        /**
         *
         * @param where
         * @param action
         * @returns {boolean}
         */
        addAction:function(where,action){

            if(action.keyCombo && _.isArray(action.keyCombo)){

                if(action.keyCombo.indexOf('dblclick')!=-1){
                    var thiz = this;
                    this.on('dblclick',function(e){
                        var row  = thiz.row(e);
                        row && thiz.runAction(action,row.data);
                    });
                }
            }
            return this.inherited(arguments);
        },
        /**
         *
         * @param command{string}
         */
        getAction:function(command){
            return this.getActionStore().getSync(command);
        },
        /**
         * Update all actions referencing widgets
         */
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
        /**
         * Place holder
         * @param action
         * @returns {*}
         */
        runAction:function(action){

            if(action.command=='View/Show/Header'){
                this._setShowHeader(!this.showHeader);
            }
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

                thiz.domNode.tabIndex = 0;




                var clickHandler = function (evt) {

                    //container
                    if (evt && evt.target && $(evt.target).hasClass('dgrid-content')){


                        thiz.select([],null,false);
                        thiz.deselectAll();

                        if(thiz.onContainerClick) {
                            thiz.onContainerClick();
                        }

                        setTimeout(function(){

                            if(evt.type!=='contextmenu')
                            {
                                thiz.domNode.focus();
                                document.activeElement = thiz.domNode;
                                $(thiz.domNode).focus();
                            }

                        },1);


                    } else {
                        //item
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


                this._on('onAddActions', function (evt) {

                    var actions = evt.actions,
                        permissions = evt.permissions,
                        container = thiz.domNode;
/*
                    actions.push(thiz.createAction('Show', 'View/Show', 'fa-hdd-o',null, 'View', 'Show', 'item|view', null,
                        null,
                        {
                            addPermission: true,
                            tab: 'View',
                            dummy:true
                        }, null, null, permissions, container, thiz
                    ));
                    */

                    actions.push(thiz.createAction('Header', types.ACTION.HEADER, 'fa-hdd-o',null, 'View', 'Show', 'item|view', null,
                        null,
                        {
                            addPermission: true,
                            tab: 'View'
                        }, null, null, permissions, container, thiz
                    ));

                });


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