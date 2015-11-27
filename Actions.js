define([
    "xdojo/declare",
    'xide/types',
    'xide/mixins/ActionProvider'
], function (declare,types,ActionProvider) {


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



                        //var row = thiz.row(evt.target);
                        //console.log('container click ' + thiz.isActive());


                        thiz.select([],null,false);
                        thiz.deselectAll();

                        if(thiz.onContainerClick) {
                            //thiz.onContainerClick();
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
                            //thiz.onItemClick();
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
                debugger;
            }

        }
    };
    //package via declare
    var _class = declare('xgrid.Actions',ActionProvider,Implementation);
    _class.Implementation = Implementation;
    return _class;
});