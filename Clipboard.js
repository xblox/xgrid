/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/types'
], function (declare,types) {


    var Implementation = {

        runAction:function(action){

            switch (action.command){
                case types.ACTION.CLIPBOARD_COPY:{
                    console.log('clip board copy');
                    this.clipboardCopy();
                    this.refreshActions();
                    return true;
                }
                case types.ACTION.CLIPBOARD_PASTE:{
                    console.log('clip board paste');
                    this.clipboardPaste();
                    return true;
                }
                case types.ACTION.CLIPBOARD_CUT:{
                    this.clipboardCut();
                    return true;
                }
            }

            return this.inherited(arguments);

        },
        clipboardPaste:function(){
            return this.inherited(arguments);
        },
        /**
         * Clipboard/Copy action
         */

        clipboardCopy:function(){
            this.currentCopySelection=this.getSelection();
        },
        clipboardCut:function(){
            this.currentCopySelection = null;
            this.currentCutSelection=this.getSelection();
        },
        getClipboardActions:function(addAction){


            var thiz = this,
                actions = [],
                ACTION = types.ACTION;

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


                var _action = addAction(label,command,icon,keyCombo,'Home','Clipboard',isPaste ?  'item|view' : 'item',null,
                    function(){
                        thiz.runAction({command:command})
                    },
                {
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

            _createEntry('Copy',ACTION.CLIPBOARD_COPY,'fa-copy','ctrl c');
            _createEntry('Paste',ACTION.CLIPBOARD_PASTE,'fa-paste','ctrl v');
            _createEntry('Cut',ACTION.CLIPBOARD_CUT,'fa-cut','ctrl x');



            return actions;
        }
    };

    //package via declare
    var _class = declare('xgrid.Clipboard',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});