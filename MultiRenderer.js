/** @module xgrid/MultiRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/factory',
    './Renderer',
    'xide/views/_ActionMixin',
    'dijit/RadioMenuItem',
    'xide/widgets/TemplatedWidgetBase',
    'xide/widgets/ActionToolbarButton',
    'xide/widgets/ActionValueWidget',
    'xide/widgets/_ActionValueWidgetMixin',
    'dijit/form/RadioButton',
    'dijit/form/CheckBox',
    'xgrid/data/Reference'
], function (declare, types, utils, factory,Renderer, _ActionMixin, RadioMenuItem,TemplatedWidgetBase,ActionToolbarButton,ActionValueWidget,_ActionValueWidgetMixin,RadioButton,CheckBox,Reference) {

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
        getRendererActions: function (_renderers, actions) {

            var root = this.rendererActionRootCommand,
                thiz = this,
                renderActions = [],
                renderers = _renderers || this.getRenderers(),
                VISIBILITY = types.ACTION_VISIBILITY,
                index = 1;

            actions = actions || [];


            var rootAction = _.find(actions, {
                command: root
            });

            if (!rootAction) {

                renderActions.push(_ActionMixin.createActionParameters('Layouts', root, 'Layout', 'fa-laptop', function () {

                }, '', null, null, thiz, thiz, {
                    dummy: true,
                    tab:'View',
                    filterGroup:"item|view",
                    onCreate: function (action) {

                        action.setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR, {
                            widgetArgs: {
                                style: "float:right"
                            }
                        });

                        action.setVisibility(VISIBILITY.RIBBON,{
                            expand:true
                        });
                    }
                }));
            }
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
                    console.log('set renderer',this);
                    thiz.setRenderer(Renderer);
                    ACTION.set('value',Renderer);
                };

                // title,
                // command,
                // group,
                // icon,
                // handler,
                // accelKey,
                // keyCombo,
                // keyProfile,
                // keyTarget,
                // keyScope,
                // mixin
                //
                _action = _ActionMixin.createActionParameters(
                    label,
                    root + '/' + label,
                    'Layout',
                    icon, function (action) {
                        var _store = thiz.getActionStore();

                        var _a = _store.getSync(this.command || action.command);

                        if(_a) {
                            _a._originEvent = 'change';
                            thiz.setRenderer(Renderer);
                            _a.set('value', Renderer);
                        }

                    }, keycombo.toUpperCase(), keycombo, null, thiz.domNode, null, {
                    tooltip:keycombo.toUpperCase(),
                    value: Renderer,
                    filterGroup:"item|view",
                    tab:'View',
                    onCreate: function (action) {

                        var _action = this;

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
                                iconClass: null
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
                                /*iconClass: icon,*/
                                renderer:RadioButton
                            }
                        });

                    }
                });

                renderActions.push(_action);

                return renderActions;

            }

            renderers.forEach(function (Renderer) {
                var impl = Renderer.Implementation;
                if (impl._getLabel) {
                    createEntry(impl._getLabel(), impl._getIcon(), Renderer);
                }
            });

            return renderActions;

        },
        startup: function () {

            if (this._started) {
                return;
            }

            this._on('onAddGridActions', function (evt) {

                var renderActions = this.getRendererActions(this.getRenderers(), evt.actions);
                renderActions.forEach(function (action) {
                    evt.actions.push(action);
                });

            }.bind(this));

            this.inherited(arguments);

        },
        getRenderers: function () {
            return this.renderers;
        },
        setRenderer: function (renderer) {

            //track focus and selection
            var selection = this.getSelection(),
                focused = this.getFocused();

            var args = {
                'new': renderer,
                'old': this.selectedRenderer
            };

            this.selectedRenderer.prototype.deactivateRenderer.apply(this, args);

            this._emit('onChangeRenderer', args);

            this.lastRenderer = this.selectedRenderer;
            this.selectedRenderer = renderer;


            renderer.prototype.activateRenderer.apply(this, args);

            this.collection.reset();
            this.refresh();

            this._emit('onChangedRenderer', args);



            //restore focus & selection
            if(focused){
                this.focus(this.row(focused));
            }
            //restore:
            this.select(selection,null,true,{
                silent:true,
                append:false
            });



        },
        renderRow: function () {
            var parent = this.selectedRenderer.prototype;
            if (parent['renderRow']) {
                return parent['renderRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        },
        insertRow: function () {

            var parent = this.selectedRenderer.prototype;
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