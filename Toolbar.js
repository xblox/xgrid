/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/utils',
    'xide/types',
    'xide/widgets/ActionToolbar'
], function (declare,utils,types,ActionToolbar) {
    /**
     *
     * @class module:xgrid/Toolbar
     */
    var Implementation = {
        _toolbar:null,
        toolbarInitiallyHidden:false,
        runAction:function(action){
            if(action.command==types.ACTION.TOOLBAR){
                this.showToolbar(this._toolbar==null);
            }
            return this.inherited(arguments);
        },
        getToolbar:function(){
            return this._toolbar;
        },
        showToolbar:function(show,toolbarClass,where,setEmitter){
            if(show==null){
                show = this._toolbar==null;
            }
            var self = this;
            if(show && !this._toolbar){
                var toolbar = utils.addWidget(toolbarClass || ActionToolbar ,{
                        style:'min-height:30px;height:auto;width:100%'
                    },this,where||this.header,true);

                if(setEmitter !==false) {
                    toolbar.addActionEmitter(this);
                    toolbar.setActionEmitter(this);
                }

                this._toolbar = toolbar;
                this.add && this.add(toolbar,null,false);
                toolbar.resize();
            }
            if(!show && this._toolbar){
                utils.destroy(this._toolbar,true,this);
                $(where||this.header).css('height','auto');
            }
            this.resize();
            return this._toolbar;
        },
        startup:function(){
            var thiz = this;
            if(this._started){
                return;
            }
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
                            actionType:'multiToggle',
                            value:false,
                            id:utils.createUUID()
                        },
                        onCreate:function(action){
                            action.set('value',thiz._toolbar!==null);
                        },
                        onChange:function(property,value){
                            thiz.showToolbar(value);
                        }
                    }));
                }
            });

            this.inherited(arguments);
            this.showToolbar(!this.toolbarInitiallyHidden);
        }
    };
    //package via declare
    var _class = declare('xgrid.Toolbar',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});