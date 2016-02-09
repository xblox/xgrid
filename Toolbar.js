/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/utils',
    'xide/types',
    'xide/widgets/ActionToolbar'
], function (declare,utils,types,ActionToolbar) {

    /**
     * A grid feature
     * @class module:xgrid/Toolbar
     */
    var Implementation = {
        _toolbar:null,
        toolbarInitiallyHidden:false,
        /**
         *
         * @param action {module:xide/bean/Action}
         * @returns {*|{dir, lang, textDir}|{dir, lang}}
         */
        runAction:function(action){

            if(action.command==types.ACTION.TOOLBAR){
                this.showToolbar(this._toolbar==null);
            }
            return this.inherited(arguments);
        },
        getToolbar:function(){
            return this._toolbar;
        },
        showToolbar:function(show,toolbarClass,where){

            if(show==null){
                show = this._toolbar==null;
            }


            if(show && !this._toolbar){

                var toolbar = utils.addWidget(toolbarClass || ActionToolbar ,{
                        "class":"dijit dijitToolbar",
                        style:'min-height:30px;height:auto;width:100%'
                    },this,where||this.header,true);

                toolbar.addActionEmitter(this);
                toolbar.setActionEmitter(this);


                this._toolbar = toolbar;


            }
            if(!show && this._toolbar){
                utils.destroy(this._toolbar,true,this);
            }

            this.resize();

        },
        resize:function(){
            this.inherited(arguments);
            if(this._toolbar){
                this._toolbar.resize();
            }
        },
        buildRendering:function(){

            this.inherited(arguments);

            if(this.toolbarInitiallyHidden===true) {

            }else{
                this.showToolbar(true);
            }

            var grid = this,
                thiz = this,
                node = grid.domNode.parentNode;


            this._on('onAddActions', function (evt) {

                var actions = evt.actions,
                    permissions = evt.permissions,
                    action = types.ACTION.TOOLBAR;

                if(!evt.store.getSync(action)) {

                    actions.push(thiz.createAction({
                        label: 'Toolbar',
                        command: action,
                        icon: types.ACTION_ICON.TOOLBAR,
                        tab: 'View',
                        group: 'Show',
                        keycombo:['ctrl b'],
                        mixin:{
                            actionType:'multiToggle'
                        },
                        onCreate:function(action){
                            action.set('value',thiz._toolbar!=null);
                        },
                        onChange:function(property,value){
                            thiz.showToolbar(value);
                            //thiz.showHeader = value;
                        }
                    }));
                    /*

                    var _action = grid.createAction('Toolbar', action,
                    types.ACTION_ICON.TOOLBAR, ['ctrl b'], 'View', 'Show', 'item|view', null, null, null, null, null, permissions, node, grid);
                    if (!_action) {
                        return;
                    }
                    actions.push(_action);
                    */
                }
            });

        }

    };

    //package via declare
    var _class = declare('xgrid.Toolbar',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});