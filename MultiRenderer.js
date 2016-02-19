/** @module xgrid/MultiRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    "dojo/dom-class",
    './Renderer',
    'xide/widgets/ActionValueWidget'
], function (declare, types, utils,domClass,Renderer, ActionValueWidget) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
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

                if(action.set) {
                    action.set('value', Renderer);
                }

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

            !_.find(actions, {command: root}) && renderActions.push(this.createAction({
                label: 'Layout',
                command: root,
                icon: 'fa-laptop',
                tab: 'View',
                group: 'Layout',
                mixin:{
                    closeOnClick:false
                },
                onCreate:function(action){

                    action.setVisibility(VISIBILITY.RIBBON,{
                        expand:true
                    });

                    action.set('value',thiz.selectedRenderer);
                }
            }));


            /*
            !_.find(actions, {command: root}) && renderActions.push(
                DefaultActions.createActionParameters('Layout', root, 'Layout', 'fa-laptop', function () {

            }, '', null, null, thiz, thiz, {
                dummy: true,
                tab:'View',
                filterGroup:"item|view",
                onCreate: function (action) {
                    action.setVisibility(VISIBILITY.RIBBON,{
                        expand:true
                    });

                    action.set('value',thiz.selectedRenderer);
                }
            }));
            */
            /**
             *
             * @param col
             * @private
             */
            function createEntry(label, icon, Renderer) {

                //icon = null;

                var selected = Renderer == thiz.selectedRenderer;
                //console.dir([selected,Renderer,thiz.selectedRenderer]);

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

                var widgetArgs = {
                    actionValue:Renderer,
                    mapping:mapping,
                    checked: selected,
                    label:label
                };

                var keycombo = 'ctrl f' + index;
                index++;

                var _renderer = Renderer;
                var _action = null;
                var ACTION = null;
                var handler = function(){
                    thiz.setRenderer(Renderer);
                    ACTION.set('value',Renderer);
                };


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


                        var _action = this;

                        action._oldIcon = icon;

                        action.actionType = types.ACTION_TYPE.SINGLE_TOGGLE;

                        action.set('value',Renderer);

                        var _visibilityMixin = {
/*
                            widgetClass: declare.classFactory('_Checked', [RadioMenuItem,_ActionValueWidgetMixin], null, {
                                postMixInProperties: function() {
                                    this.inherited(arguments);
                                    this.checked = this.item.get('value') == thiz.selectedRenderer;
                                },
                                startup: function () {
                                    this.iconClass = null;
                                    this.inherited(arguments);

                                    this.on('change', function (val) {
                                        if(val) {
                                            thiz.setRenderer(Renderer);
                                        }
                                    });
                                }
                            }, null),
                            */
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

/*
                        //for ribbons we collapse into 'Checkboxes'
                        action.setVisibility(VISIBILITY.RIBBON,{
                            widgetClass:declare.classFactory('_RadioGroup', [ActionValueWidget], null, {
                                startup:function(){
                                    this.inherited(arguments);
                                    this.widget.on('change',function(val){
                                        if(val) {
                                            thiz.setRenderer(this.actionValue);
                                        }
                                    }.bind(this));
                                }
                            } ,null),
                            widgetArgs: {
                                mapping:mapping,
                                action:action,
                                group: thiz.id+'_renderer_ribbon',
                                checked: selected,
                                actionValue:Renderer,
                                //iconClass: icon,
                                renderer:RadioButton
                            }
                        });
                        */
                    }
                });
                /*

                _action = DefaultActions.createActionParameters(
                    label,
                    root + '/' + label,
                    'Layout',
                    icon,
                    function (action) {
                        var _store = thiz.getActionStore();

                        var _a = _store.getSync(this.command || action.command);

                        if(_a) {
                            _a._originEvent = 'change';
                            thiz.setRenderer(Renderer);
                            _a.set('value', Renderer);
                        }

                    }, keycombo.toUpperCase(), [keycombo], null, thiz.domNode, null, {
                    tooltip:keycombo.toUpperCase(),
                    value: Renderer,
                    filterGroup:"item|view",
                    tab:'View',
                    onCreate: function (action) {

                        var _action = this;

                        action._oldIcon = icon;

                        action.actionType = types.ACTION_TYPE.SINGLE_TOGGLE;

                        action.set('value',Renderer);

                        var _visibilityMixin = {

                            widgetClass: declare.classFactory('_Checked', [RadioMenuItem,_ActionValueWidgetMixin], null, {
                                postMixInProperties: function() {
                                    this.inherited(arguments);
                                    this.checked = this.item.get('value') == thiz.selectedRenderer;
                                },
                                startup: function () {
                                    this.iconClass = null;
                                    this.inherited(arguments);

                                    this.on('change', function (val) {
                                        if(val) {
                                            thiz.setRenderer(Renderer);
                                        }
                                    });
                                }
                            }, null),
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


                        //for ribbons we collapse into 'Checkboxes'
                        action.setVisibility(VISIBILITY.RIBBON,{
                            widgetClass:declare.classFactory('_RadioGroup', [ActionValueWidget], null, {
                                startup:function(){
                                    this.inherited(arguments);
                                    this.widget.on('change',function(val){
                                        if(val) {
                                            thiz.setRenderer(this.actionValue);
                                        }
                                    }.bind(this));
                                }
                            } ,null),
                            widgetArgs: {
                                mapping:mapping,
                                action:action,
                                group: thiz.id+'_renderer_ribbon',
                                checked: selected,
                                actionValue:Renderer,
                                renderer:RadioButton
                            }
                        });

                    }
                });
                */
                renderActions.push(_action);
                return renderActions;

            }

            renderers.forEach(function (Renderer) {
                var impl = Renderer.Implementation || Renderer.prototype;
                //console.log('add renderer '+Renderer.prototype.declaredClass);
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
            //remove renderer root css class
            domClass.remove(this.domNode,selected._getLabel());
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
            domClass.add(this.domNode,renderer.prototype._getLabel());

            //call  API
            renderer.prototype.activateRenderer.apply(this, args);

            //reset store
            this.collection.reset();

            //refresh, then restore sel/focus
            var refresh = this.refresh();

            refresh && refresh.then && refresh.then(function(){

                self._emit('onChangedRenderer', args);

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
                //resize
                self.publish(types.EVENTS.RESIZE, {
                    view: self
                });
            });
            return refresh;
        },
        /**
         *
         * @returns {*}
         */
        renderRow: function () {
            var parent = this.getSelectedRenderer();
            if (parent['renderRow']) {
                return parent['renderRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        },
        /**
         *
         * @returns {*}
         */
        activateRenderer: function () {
            var parent = this.getSelectedRenderer();
            if (parent['activateRenderer']) {
                return parent['activateRenderer'].apply(this, arguments);
            }
            return this.inherited(arguments);
        },
        /**
         *
         * @returns {*}
         */
        deactivateRenderer: function () {
            var parent = this.getSelectedRenderer();
            if (parent['deactivateRenderer']) {
                return parent['deactivateRenderer'].apply(this, arguments);
            }
            return this.inherited(arguments);
        },
        /**
         *
         * @returns {*}
         */
        insertRow: function () {

            var parent = this.getSelectedRenderer();
            if (parent['insertRow']) {
                return parent['insertRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        }

    };

    //package via declare
    var _class = declare('xgrid.MultiRenderer', null, Implementation);
    _class.Implementation = Implementation;

    return _class;
});