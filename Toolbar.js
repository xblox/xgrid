/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/widgets/ActionToolbar',
    './Layout',
    'dojo/dom-class'
], function (declare,types,utils,ActionToolbar,Layout,domClass) {

    /**
     * A grid feature
     * @class module:xgrid/Toolbar
     * @extends xgrid/Layout
     */
    var Implementation = {
        _toolbar:null,
        getToolbar:function(){
          return this._toolbar;
        },
        buildRendering:function(){

            this.inherited(arguments);
            this._toolbar = utils.addWidget(ActionToolbar,{
                style:'height:30px;width:100%',
                //disable global integration
                subscribes:{
                    'onSetItemsActions':false
                }
            },this,this.header,true);
        },
        startup:function(){

            if(this._started){
                return;
            }

            this.inherited(arguments);

            var clickHandler = function(evt) {

                if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                    //container click:
                    var gridActionProvider = this.getGridActionProvider ? this.getGridActionProvider() : null;
                    if(gridActionProvider){
                        var actions = gridActionProvider.getItemActions();
                        this.getToolbar().setItemActions({},actions);
                    }

                }else{
                    //item click
                    var gridActionProvider = this.getItemActionProvider ? this.getItemActionProvider() : null;
                    if(gridActionProvider){
                        var actions = gridActionProvider.getItemActions();
                        this.getToolbar().setItemActions({},actions);
                    }
                }



            }.bind(this);

            this.on("click", function (evt) {
                clickHandler(evt);
            }.bind(this));

            this.on("contextmenu", function (evt) {
                clickHandler(evt);
            }.bind(this));





        }
    };

    //package via declare
    var _class = declare('xgrid.Toolbar',[Layout],Implementation);
    _class.Implementation = Implementation;

    return _class;
});