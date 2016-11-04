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
                return true;
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
            if(show && !this._toolbar){
                var toolbar = utils.addWidget(toolbarClass || ActionToolbar ,{
                        style:'min-height:30px;height:auto;width:100%'
                    },this,where||this.header,true);

                if(setEmitter !==false) {
                    toolbar.addActionEmitter(this);
                    //at this point the actions are rendered!
                    toolbar.setActionEmitter(this);
                    this.refreshActions && this.refreshActions();
                }
                this._toolbar = toolbar;
                this.add && this.add(toolbar);
                this._emit('showToolbar',toolbar);
            }
            if(!show && this._toolbar){
                utils.destroy(this._toolbar,true,this);
                $(where||this.header).css('height','auto');
            }
            this.resize();
            return this._toolbar;
        },
        getState:function(state) {
            state = this.inherited(arguments) || {};
            state.toolbar = this._toolbar!==null;
            return state;
        },
        setState:function(state) {
            if(state && state.toolbar){
                this.showToolbar(state.toolbar);
            }
            return this.inherited(arguments);
        },
        startup:function(){
            var thiz = this;
            if(this._started){
                return;
            }
            this._on('onAddActions', function (evt) {
                var actions = evt.actions,
                    action = types.ACTION.TOOLBAR;
                if(!evt.store.getSync(action) && this.hasPermission(action)) {
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
                            thiz.onAfterAction(types.ACTION.TOOLBAR);
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