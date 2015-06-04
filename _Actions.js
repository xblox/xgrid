define([
    "xdojo/declare",
    'dojo/dom-class'
], function (declare,domClass) {

    var Implementation = {

        onItemClick:function(){

        },
        onContainerClick:function(){

        },
        updateActions:function(provider,target){

            var actions,
                actionsFiltered,
                provider,
                selection = this.getSelection();

            if(provider){
                actions = provider.getItemActions();
                actionsFiltered = this._filterActions(selection,actions,provider);
                target.setItemActions({},actionsFiltered);
            }

        },
        _filterActions:function(selection,actions,actionProvider){
            var result = [];
            for (var i = 0; i < actions.length; i++) {
                var _action = actions[i];
                if(_action.shouldShow && _action.shouldShow()==false){
                    continue;
                }
                if(this.shouldShowAction && this.shouldShowAction(_action,selection,actionProvider)==false){
                    continue;
                }
                result.push(_action);
            }
            return result;
        },
        startup:function(){

            if(this._started){
                return;
            }

            this.inherited(arguments);

            var thiz = this;

            var clickHandler = function(evt) {
                if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                    thiz.onContainerClick();
                }else{
                    thiz.onItemClick();
                }
            }

            this.on("click", function (evt) {
                clickHandler(evt);
            }.bind(this));

            this.on("contextmenu", function (evt) {
                clickHandler(evt);
            }.bind(this));
        }
    };
    //package via declare
    var _class = declare('xgrid._Actions',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});