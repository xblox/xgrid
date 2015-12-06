/** module xgrid/actions **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/mixins/ActionProvider',
    'xide/action/DefaultActions'
], function (declare,types,ActionProvider,DefaultActions) {

    var _debug = false;
    var _last = null;
    /**
     * @class xgrid.actions
     * 
     * All about actions:
     * 
     * 1. implements std before and after actions:
     * 1.1 on onAfterAction its restoring focus and selection automatically
     * 2. handles and forwards click, contextmenu and onAddActions
     * 3. 
     * 
     */
    var Implementation = {

        _ActionContextState:null,
        onActivateActionContext:function(context,e){

            var state = this._ActionContextState;
            if(this._isRestoring){
                return;
            }
            this._isRestoring=true;
/*
            if(state && state.selection && e.selection && e.selection==state.selection){
                this.focus();
                return;
            }
*/

            if(e!=null && e.selection && state){
                state.selection = e!=null ? e.selection : state.selection;
            }
            var self = this;

            _debug && console.log('onActivateActionContext',e);
            //self._restoreSelection(state,1,false,e);
            setTimeout(function(){

                var dfd = self._restoreSelection(state,1,false,'onActivateActionContext');
                if(dfd && dfd.then){
                    dfd.then(function(e){
                        self._isRestoring=false;
                    });
                }else {
                    self._isRestoring = false;
                }
            },1000);

        },
        onDeactivateActionContext:function(context,event){
            _debug && console.log('onDeactivateActionContext '  + this.id,event);
            this._ActionContextState = this._preserveSelection();

        },
        /**
         * Callback when action is performed:before (xide/widgets/_MenuMixin)
         * @param action {module:xide/bean/Action}
         */
        onBeforeAction:function(action){

            //console.log('on before');
            /*
            this._a = this._preserveSelection();
            console.log('on before');
            console.dir(this._a);
            */

        },
        /**
         * Callback when action is performed: after (xide/widgets/_MenuMixin)
         * 
         * @TODO Run the post selection only when we are active!
         * 
         * 
         * @param action {module:xide/bean/Action}
         */
        onAfterAction:function(action,actionDfdResult){
            
            _debug && console.log('on after',actionDfdResult);
            
            if(actionDfdResult!=null){
            	if(_.isObject(actionDfdResult)){
            		
            		// post work: selection & focus
            		var select = actionDfdResult.select,
            				focus = actionDfdResult.focus || true;
								
								if(select){
									var options = {
										append:actionDfdResult.append,
										focus:focus,
										delay:actionDfdResult.delay || 1,
										expand:actionDfdResult.expand
									};
                                    //focus == true ? null : this.focus();
									return this.select(select,null,true,options);
								}
            	}
            }

            this.focus();

        },
        hasPermission:function(permission){
            return DefaultActions.hasAction(this.permissions,permission);
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
                thiz.domNode.tabIndex = -1;
                var clickHandler = function (evt) {
                    //var active = thiz.isActive();
                    //container
                    if (evt && evt.target && $(evt.target).hasClass('dgrid-content')){
                        
                        thiz.select([],null,false);
                        thiz.deselectAll();
                        if(evt.type!=='contextmenu'){
                        	setTimeout(function(){
                                thiz.domNode.focus();
                                document.activeElement = thiz.domNode;
                                $(thiz.domNode).focus();
                        	},1);
                        }
                    }
                };
/*
                this.on("click", function (evt) {
                    clickHandler(evt);
                }.bind(this));

                this.on("contextmenu", function (evt) {
                    clickHandler(evt);
                }.bind(this));

*/
								this.on("click", clickHandler.bind(this));

                this.on("contextmenu",clickHandler.bind(this));
                

                this._on('selectionChanged', function (evt) {
                    this._onSelectionChanged(evt);
                }.bind(this));


                this._on('onAddActions', function (evt) {

                    var actions = evt.actions,
                        permissions = evt.permissions,
                        container = thiz.domNode,
                        action = types.ACTION.HEADER;

                    if(!evt.store.getSync(action)) {
                        actions.push(thiz.createAction('Header', action, 'fa-hdd-o', null, 'View', 'Show', 'item|view', null,
                            null,
                            {
                                addPermission: true,
                                tab: 'View'
                            }, null, null, permissions, container, thiz
                        ));
                    }

                });


            }catch(e){
                logError(e,'error in onAddActions');
            }

        }
    };
    //package via declare
    var _class = declare('xgrid.Actions',ActionProvider,Implementation);
    _class.Implementation = Implementation;
    return _class;
});