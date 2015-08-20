/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/views/_ActionMixin'
], function (declare,types,utils,_ActionMixin) {

    var Implementation = {

        /**
         * Clipboard/Copy action
         */
        clipboardCopy:function(){
            this.currentCopySelection=this.getSelection();
        },
        getClipboardActions:function(addAction){
            var thiz = this,
                actions = [],
                ACTION_VISIBILITY = types.ACTION_VISIBILITY;

            function _selection(){
                var selection = thiz.getSelection();
                if (!selection || !selection.length) {
                    return null;
                }
                var item = selection[0];
                if(!item){
                    console.error('have no item');
                    return null;
                }
                return selection;
            }

            function isItem() {
                var selection = _selection();
                if (!selection) {
                    return true;
                }
                return false;
            }
            /**
             *
             * @param label
             * @param command
             * @param icon
             * @param keyCombo
             * @private
             */
            function _createEntry(label,command,icon,keyCombo) {


                var isPaste = label ==='Paste';
                function disable(){
                    switch (this.title){
                        case 'Cut':
                        case 'Copy':{
                            return isItem()!==false;
                        }
                        case 'Paste':{
                            return thiz.currentCopySelection==null;
                        }
                    }
                    return false;
                }

                var _action = addAction(label,command,icon,keyCombo,'Home','Clipboard',isPaste ?  'item|view' : 'item',null,function(){
                    thiz.runAction({
                        command:command
                    })
                },{
                    owner:thiz,
                    addPermission:true,
                    tooltip:keyCombo.toUpperCase()
                },null,disable);

                if(_action) {
                    actions.push(_action);
                }


                //function addAction(label,command,icon,keycombo,tab,group,filterGroup,onCreate,handler,mixin,shouldShow,shouldDisable)
                /*
                actions.push(_ActionMixin.createActionParameters(label, command, 'Clipboard', icon, function () {
                    thiz.runAction({
                        command:command
                    })
                }, '', keyCombo, null, thiz.domNode, null, {
                    tooltip:keyCombo.toUpperCase(),
                    filterGroup: label ==='Paste' ?  'item|view' : 'item' ,
                    tab:"Home",
                    owner:thiz,
                    __onCreate:function(action){
                        var _visibilityMixin = {};
                        action.setVisibility(types.ACTION_VISIBILITY_ALL,_visibilityMixin);
                    }
                }));
                */
            }

            _createEntry('Copy','Clipboard/Copy','fa-copy','ctrl c');
            _createEntry('Paste','Clipboard/Paste','fa-paste','ctrl v');
            _createEntry('Cut','Clipboard/Cut','fa-cut','ctrl x');



            return actions;
        }
    };

    //package via declare
    var _class = declare('xgrid.Clipboard',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});