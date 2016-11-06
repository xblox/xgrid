/** @module xgrid/Clipboard **/
define([
    "xdojo/declare",
    'xide/types'
], function (declare,types) {

    var Implementation = {
        runAction:function(action){
            switch (action.command){
                case types.ACTION.CLIPBOARD_COPY:{
                    this.clipboardCopy();
                    this.refreshActions();
                    return true;
                }
                case types.ACTION.CLIPBOARD_PASTE:{
                    return this.clipboardPaste();
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
            this.currentCutSelection=null;
            this.currentCopySelection=this.getSelection();
            this.publish(types.EVENTS.ON_CLIPBOARD_COPY,{
                selection:this.currentCopySelection,
                owner:this,
                type:this.itemType
            });
        },
        clipboardCut:function(){
            this.currentCopySelection = null;
            this.currentCutSelection = this.getSelection();
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
            function _createEntry(label,command,icon,keyCombo) {
                actions.push(thiz.createAction({
                    label: label,
                    command: command,
                    icon: icon,
                    tab: 'Home',
                    group: 'Clipboard',
                    keycombo: keyCombo,
                    mixin: {
                        addPermission:true,
                        quick:true
                    },
                    shouldDisable:disable
                }));
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