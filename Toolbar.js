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
         * @param action {module:xide/action/Action}
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
        /**
         *
         * @param show
         * @param toolbarClass
         * @param where
         * @param setEmitter
         */
        showToolbar:function(show,toolbarClass,where,setEmitter){

            if(show==null){
                show = this._toolbar==null;
            }

            var self = this;

            if(show && !this._toolbar){

                var toolbar = utils.addWidget(toolbarClass || ActionToolbar ,{
                        style:'min-height:30px;height:auto;width:100%'
                    },this,where||this.header,true);

                setEmitter !==false && toolbar.addActionEmitter(this);
                setEmitter !==false && toolbar.setActionEmitter(this);

                this._toolbar = toolbar;
                this.add && this.add(toolbar,null,false);
                toolbar.resize();
                setTimeout(function(){
                    self.resize();
                },1000);


            }
            if(!show && this._toolbar){

                utils.destroy(this._toolbar,true,this);
                $(where||this.header).css('height','auto');
            }

            this.resize();

            return this._toolbar;

        },
        resize:function(){
            this.inherited(arguments);

            if(this._toolbar){
                this._toolbar.resize();
                //this._parent.resize();
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
                }
            });

        }

    };

    //package via declare
    var _class = declare('xgrid.Toolbar',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});