/** @module xgrid/MultiRenderer **/
define([
    "xdojo/declare",
    'xide/types',
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
], function (declare, types,factory,Renderer, _ActionMixin, RadioMenuItem,TemplatedWidgetBase,ActionToolbarButton,ActionValueWidget,_ActionValueWidgetMixin,RadioButton,CheckBox,Reference) {

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
                VISIBILITY = types.ACTION_VISIBILITY;

            actions = actions || [];


            var rootAction = _.find(actions, {
                command: root
            });

            if (!rootAction) {

                renderActions.push(_ActionMixin.createActionParameters('Layouts', root, 'View', 'fa-laptop', function () {

                }, '', null, null, thiz, thiz, {
                    dummy: true,
                    tab:'View',
                    onCreate: function (action) {

                        action.setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR, {
                            widgetArgs: {
                                style: "float:right"
                            }
                        });

                        action.setVisibility(VISIBILITY.RIBBON,{
                            collapse:true
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

                renderActions.push(_ActionMixin.createActionParameters(label, root + '/' + label, 'View', icon, function () {

                }, '', null, null, thiz, thiz, {
                    value: Renderer,
                    filterGroup:"item|view",
                    tab:'View',
                    onCreate: function (action) {

                        var _action = this;


                        var _visibilityMixin = {
                            widgetClass: declare.classFactory('_Checked', [RadioMenuItem,_ActionValueWidgetMixin], null, {

                                startup: function () {

                                    this.iconClass = null;

                                    this.inherited(arguments);

                                    console.log('this',this);

                                    this.on('change', function (val) {
                                        console.log('changed', val);
                                        if (val) {
                                            thiz.setRenderer(Renderer);
                                        }
                                    });

                                    //this.set('checked',true);


                                }
                            }, null),
                            widgetArgs: {
                                group: '_renderer',
                                checked: selected,
                                label:label,
                                iconClass: null,
                                propertyToMap:{
                                    value:{
                                        name:"checked",
                                        value:true
                                    }
                                }
                            }
                        };


                        action.setVisibility(types.ACTION_VISIBILITY_ALL,_visibilityMixin);

                        //for ribbons we collapse into 'Checkboxes'
                        action.setVisibility(VISIBILITY.RIBBON,{



                            widgetClass:declare.classFactory('_RadioGroup', [ActionValueWidget], null, {

                                startup:function(){
                                    //this.cb = factory.createRadioButton(this.domNode, 'margin-left:3px;margin-top:2px;', _action.label, 'val', null, null, selected, '', '');
                                    this.inherited(arguments)   ;
                                    this.on('click',function(){
                                        thiz.setRenderer(Renderer);
                                    });
                                }
                            } ,null),
                            widgetArgs: {
                                action:action,
                                group: '_renderer',
                                checked: selected,
                                actionValue:Renderer,
                                /*iconClass: icon,*/
                                renderer:RadioButton
                            }
                        });

                    }
                }));

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