/** @module xgrid/MultiRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    'dojo/dom-construct',
    './Renderer',
    'xide/views/_ActionMixin',
    'dijit/RadioMenuItem'
], function (declare,types,domConstruct,Renderer,_ActionMixin,RadioMenuItem) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
     * @extends module:xgrid/Renderer
     */
    var Implementation = {
        renderers:null,
        selectedRender:null,
        lastRenderer:null,
        rendererActionRootCommand:'View/Layout',
        getRendererActions:function(renderers,actions){

            var root = this.rendererActionRootCommand,
                thiz = this,
                renderActions = [];


            var rootAction = _.find(actions,{
                command:root
            });

            if(!rootAction) {

                renderActions.push(_ActionMixin.createActionParameters('Layouts', root, 'view', 'fa-laptop', function () {

                }, '', null, null, thiz, thiz, {
                    dummy: true,
                    onCreate:function(action){
                        action.setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR, {
                            widgetArgs:{
                                style:"float:right"
                            }
                        });
                    }
                }));
            }
            /**
             *
             * @param col
             * @private
             */
            function createEntry(label,icon,Renderer) {

                icon = null;

                renderActions.push(_ActionMixin.createActionParameters(label, root + '/' + label, 'view', icon, function () {

                }, '', null, null, thiz, thiz, {
                    Renderer:Renderer,
                    onCreate:function(action){
                        var _visibilityMixin = {
                            widgetClass:declare.classFactory('_Checked', [RadioMenuItem], null, {

                                startup:function(){
                                    this.iconClass = null;
                                    this.inherited(arguments);
                                    this.on('change',function(val){
                                        if(val){
                                            thiz.setRenderer(Renderer);
                                        }
                                    });

                                    //this.set('checked',true);


                                }
                            },null),
                            widgetArgs:{
                                group:'_renderer',
                                checked:Renderer == thiz.selectedRender,
                                iconClass:icon
                            }
                        };
                        action.setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR,_visibilityMixin);
                        action.setVisibility(types.ACTION_VISIBILITY.CONTEXT_MENU,_visibilityMixin);
                        action.setVisibility(types.ACTION_VISIBILITY.MAIN_MENU,_visibilityMixin);

                    }
                }));

                return renderActions;

            }

            renderers.forEach(function(Renderer){
                var impl = Renderer.Implementation;
                if(impl._getLabel){
                    createEntry(impl._getLabel(),impl._getIcon(),Renderer);
                }
            });

            return renderActions;

        },
        startup:function(){

            if(this._started){
                return;
            }

            this._on('onAddGridActions',function(evt){

                var renderActions = this.getRendererActions(this.getRenderers(),evt.actions);
                renderActions.forEach(function(action){
                    evt.actions.push(action);
                });

            }.bind(this));

            this.inherited(arguments);

        },
        getRenderers:function(){
            return this.renderers;
        },
        setRenderer:function(renderer){

            var args = {
                'new':renderer,
                'old':this.selectedRender
            };
            this.selectedRender.prototype.deactivateRenderer.apply(this, args);


            this._emit('onChangeRenderer',args);

            this.lastRenderer = this.selectedRender;
            this.selectedRender = renderer;


            renderer.prototype.activateRenderer.apply(this, args);

            this.collection.reset();
            this.refresh();

            this._emit('onChangedRenderer',args);

        },
        renderRow:function(){
            var parent = this.selectedRender.prototype;
            if(parent['renderRow']) {
                return parent['renderRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        },
        insertRow:function(){

            var parent = this.selectedRender.prototype;
            if(parent['insertRow']) {
                return parent['insertRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        }

    };

    //package via declare
    var _class = declare('xgrid.MultiRenderer',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});