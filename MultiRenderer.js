/** @module xgrid/MultiRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    'xgrid/Renderer'
], function (declare, types, Renderer) {
    /**
     * @class module:xgrid/MultiRenderer
     * @extends module:xgrid/Renderer
     */
    var Implementation = {
        renderers: null,
        selectedRenderer: null,
        lastRenderer: null,
        rendererActionRootCommand: 'View/Layout',
        runAction:function(action){
            action = this.getAction(action);
            if(action.command.indexOf(this.rendererActionRootCommand)!=-1){
                var parentAction = action.getParent ?  action.getParent() : null;
                action._originEvent = 'change';
                this.setRenderer(action.value);
                if(parentAction) {
                    parentAction.set('icon', action.get('icon'));
                    var rendererActions = parentAction.getChildren();
                    _.each(rendererActions, function (child) {
                        child.set('icon', child._oldIcon);
                    });
                }
                if(action.set) {
                    action.set('icon', 'fa-check');
                }
                return true;
            }
            return this.inherited(arguments);
        },
        /**
         * Impl. set state
         * @param state
         * @returns {object|null}
         */
        setState:function(state){
            var renderer = dojo.getObject(state.selectedRenderer);
            if(renderer){
                this.setRenderer(renderer);
                this.set('collection',this.collection.getDefaultCollection());

            }
            return this.inherited(arguments);
        },
        /**
         * Impl. get state
         * @param state
         * @returns {object}
         */
        getState:function(state){
            state = this.inherited(arguments) || {};
            if(this.selectedRenderer) {
                state.selectedRenderer = this.getSelectedRenderer.declaredClass;
            }
            return state;
        },
        getRendererActions: function (_renderers, actions) {
            var root = this.rendererActionRootCommand,
                thiz = this,
                renderActions = [],
                renderers = _renderers || this.getRenderers(),
                VISIBILITY = types.ACTION_VISIBILITY,
                index = 1;

            actions = actions || [];

            //root
            renderActions.push(this.createAction({
                label: 'Layout',
                command: root,
                icon: 'fa-laptop',
                tab: 'View',
                group: 'Layout',
                mixin:{
                    closeOnClick:false
                },
                onCreate:function(action){
                    action.set('value',thiz.selectedRenderer);
                    action.setVisibility(VISIBILITY.ACTION_TOOLBAR, false);
                }
            }));
            /**
             *
             * @param col
             * @private
             */
            function createEntry(label, icon, Renderer) {
                var selected = Renderer == thiz.selectedRenderer;
                /*
                var mapping = {
                    "change":{
                        //action to widget mapping
                        input:ActionValueWidget.createTriggerSetting('value','checked',function(event,value,mapping){
                            //return this.actionValue;
                            return value;
                        }),

                        //widget to action mapping
                        output:utils.mixin(ActionValueWidget.createTriggerSetting('checked','value',function(){
                            return this.actionValue;
                        }),{
                            ignore:function(event,value){
                                return value === false;
                            }
                        })
                    }
                };
                */

                /*
                var widgetArgs = {
                    actionValue:Renderer,
                    mapping:mapping,
                    checked: selected,
                    label:label
                };
                */

                var keycombo = 'shift f' + index;
                index++;

                var _renderer = Renderer;
                var _action = null;
                var ACTION = null;

                _action = thiz.createAction({
                    label: label,
                    command: root + '/' + label,
                    icon: icon,
                    tab: 'View',
                    group: 'Layout',
                    mixin:{
                        value:Renderer,
                        addPermission:true,
                        closeOnClick:false
                    },
                    keycombo:[keycombo],
                    onCreate:function(action){
                        action._oldIcon = icon;
                        action.actionType = types.ACTION_TYPE.SINGLE_TOGGLE;
                        action.set('value',Renderer);
                        /*
                        var _visibilityMixin = {
                            widgetArgs: {
                                actionValue:Renderer,
                                mapping:mapping,
                                group: thiz.id+'_renderer_all',
                                checked: selected,
                                label:label,
                                iconClass: null,
                                title:'test'
                            }
                        };
                        action.setVisibility(types.ACTION_VISIBILITY_ALL,_visibilityMixin);
                        */

                    }
                });
                renderActions.push(_action);
                return renderActions;
            }

            _.each(renderers,function (Renderer) {
                var impl = Renderer.Implementation || Renderer.prototype;
                if (impl._getLabel) {
                    createEntry(impl._getLabel(), impl._getIcon(), Renderer);
                }
            });
            return renderActions;
        },
        getSelectedRenderer:function(){
            return this.selectedRenderer.prototype;
        },
        startup: function () {
            var thiz = this;
            this._on('onAddGridActions', function (evt) {
                var renderActions = thiz.getRendererActions(thiz.getRenderers(), evt.actions);
                renderActions.forEach(function (action) {
                    evt.actions.push(action);
                });
            });
            this.inherited(arguments);
            //add new root class
            this.selectedRenderer && $(this.domNode).addClass(this.getSelectedRenderer()._getLabel());
        },
        getRenderers: function () {
            return this.renderers;
        },
        setRenderer: function (renderer,_focus) {
            //track focus and selection
            var self = this,
                selection = self.getSelection(),
                focused = self.getFocused(),
                selected = self.getSelectedRenderer();

            var args = {
                'new': renderer,
                'old': self.selectedRenderer
            };
            var node$ = $(this.domNode);
            //remove renderer root css class
            node$.removeClass(selected._getLabel());
            //call renderer API
            selected.deactivateRenderer.apply(this, args);

            //tell everyone
            this._emit('onChangeRenderer', args);

            //update locals
            this.lastRenderer = this.selectedRenderer;
            this.selectedRenderer = renderer;

            //?
            this.selectedRendererClass = renderer.prototype.declaredClass;

            //add new root class
            node$.addClass(renderer.prototype._getLabel());

            //call  API
            renderer.prototype.activateRenderer.apply(this, args);

            //reset store
            this.collection.reset();

            //refresh, then restore sel/focus
            var refresh = this.refresh();


            refresh && refresh.then && refresh.then(function(){
                self._emit('onChangedRenderer', args);
                //@TODO: really?
                if(_focus!==false) {
                    //restore focus & selection
                    if (focused) {
                        self.focus(self.row(focused));
                    }
                    self.select(selection, null, true, {
                        silent: true,
                        append: false,
                        focus: true
                    });
                }
                //@TODO: really?
                //resize
                self.publish(types.EVENTS.RESIZE, {
                    view: self
                });
            });
            return refresh;
        }
    };


    /**
     * Forward custom renderer method
     * @param who
     * @param method
     */
    function forward(who,method){
        Implementation[method]=function(){
            var parent = this.getSelectedRenderer();
            if (parent[method]) {
                return parent[method].apply(this, arguments);
            }
            return this.inherited(arguments);
        };
    }

    //@TODO: this should be all public methods in dgrid/List ?
    _.each(['row','removeRow','renderRow','insertRow','activateRenderer','deactivateRenderer'],function(method){
        forward(Implementation,method);
    })


    //package via declare
    var _class = declare('xgrid.MultiRenderer', null, Implementation);
    _class.Implementation = Implementation;

    return _class;
});