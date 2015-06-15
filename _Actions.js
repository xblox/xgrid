define([
    "xdojo/declare",
    'dojo/dom-class',
    'xide/types',
    'xide/utils',
    'xide/action/ActionStore',
    'xide/bean/Action',
    'xide/Keyboard',
    'xide/mixins/EventedMixin'
], function (declare,domClass,types,utils,ActionStore,Action,Keyboard,EventedMixin) {

    /**
     *
     * @type
     */
    var Implementation = {

        /////////////////////////////////////////////////////
        //
        //  Store Based Extension -
        //
        /////////////////////////////////////////////////////
        /**
         * @type module:xide/action/ActionStore
         */
        actionStore:null,
        actions:null,
        getActions:function(mixed){

            var query = mixed;

            //no query or function given
            if(!mixed){
                query = {
                    command:/\S+/
                }
            }

            return this.getActionStore().query(query);

        },
        getActionStore:function(){
            return this.createActionStore();
        },
        postMixInProperties:function() {

            this.inherited(arguments);

            this.createActionStore();

        },
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
        addAction:function(){

        },
        addActions:function(actions){

            var store = this.getActionStore();
            var result = [];

            actions = this._completeActions(actions);
            actions.forEach(function(action){
                result.push(store.putSync(action));
            }.bind(this));

            return result;

        },
        _completeActions:function(actions){

            var result = [];

            for (var i = 0; i < actions.length; i++) {
                var config = actions[i],
                    action;


                if (!(config instanceof Action)) {

                    action = this.createAction(
                        config.title,
                        config.command,
                        config.group,
                        config.icon,
                        config.handler,
                        config.accelKey,
                        config.keyCombo,
                        config.keyProfile,
                        config.keyTarget,
                        config.keyScope,
                        config.mixin);

                    action.parameters = config;
                } else {
                    action = config;
                }

                //this.setAction(action);
                this._addAction(result,action);
            }

            _.each(this.keyboardMappings,function(mapping){
                this.registerKeyboardMapping(mapping);
            },this);


            return result;

        },
        createActionStore:function(){
            if(!this.actionStore){
                var _actions = this._completeActions(this.actions || []);
                this.actionStore = new ActionStore({
                    data:_actions,
                    observedProperties:[
                        "value"
                    ]
                });
            }
            return this.actionStore;
        },
        /**
         *
         * @param title
         * @param command
         * @param group
         * @param icon
         * @param handler
         * @param accelKey
         * @param keyCombo
         * @param keyProfile
         * @param keyTarget
         * @param keyScope
         * @param mixin
         * @returns {xide/bean/Action}
         */
        createAction: function (title, command, group, icon, handler, accelKey, keyCombo, keyProfile, keyTarget, keyScope,mixin) {

            icon = icon || types.ACTION_ICON[command];

            var args = {accelKey: accelKey};
            if(mixin){
                utils.mixin(args,mixin);
            }


            var action = Action.createDefault(title, icon, command, group, handler,args).setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR, {label: ''});
            if (keyCombo) {


                var keyboardMappings;
                if(this.keyboardMappings){
                    keyboardMappings = this.keyboardMappings;
                }else{
                    action.keyboardMappings = keyboardMappings = [];
                }
                keyboardMappings.push(Keyboard.defaultMapping(keyCombo, handler, keyProfile || types.KEYBOARD_PROFILE.DEFAULT, keyTarget, keyScope));
            }

            if(action.onCreate){
                action.onCreate(action);
            }

            return action;
        },
        /**
         *
         * @param where
         * @param action
         * @returns {boolean}
         */
        _addAction:function(where,action){

            var actions = where || [],
                thiz = this;

            var eventCallbackResult = this._emit('addAction',action);
            if(eventCallbackResult===false){
                return false;

            }else if(utils.isObject(eventCallbackResult)){
                lang.mixin(action,eventCallbackResult);
            }
            actions.push(action);

            return true;
        },
        /////////////////////////////////////////////////////
        //
        //
        /////////////////////////////////////////////////////
        onItemClick:function(){},
        onContainerClick:function(){},
        _onSelectionChanged:function(evt){},
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
        startup:function(){

            if(this._started){
                return;
            }

            this.inherited(arguments);

            var thiz = this;

            var clickHandler = function(evt) {
                if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                    thiz.onContainerClick();
                }else{
                    thiz.onItemClick();
                }
            };

            this.on("click", function (evt) {
                clickHandler(evt);
            }.bind(this));

            this.on("contextmenu", function (evt) {
                clickHandler(evt);
            }.bind(this));

            this._on('selectionChanged',function(evt){
                this._onSelectionChanged(evt);
            }.bind(this));

        }
    };
    //package via declare
    var _class = declare('xgrid._Actions',[EventedMixin,Keyboard],Implementation);
    _class.Implementation = Implementation;
    return _class;
});