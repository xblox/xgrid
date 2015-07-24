/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/views/_ActionMixin'
], function (declare,types,utils,_ActionMixin) {

    var Implementation = {

        getClipboardActions:function(){
            var thiz = this,
                actions = [],
                ACTION_VISIBILITY = types.ACTION_VISIBILITY;

            /**
             *
             * @param col
             * @private
             */
            function _createEntry(label,command,icon,keyCombo) {

                actions.push(_ActionMixin.createActionParameters(label, command, 'Clipboard', icon, function () {
                    thiz.runAction({
                        command:command
                    })
                }, '', keyCombo, null, thiz.domNode, null, {
                    tooltip:keyCombo.toUpperCase(),
                    filterGroup:"item",
                    tab:"Home",
                    owner:thiz,
                    __onCreate:function(action){
                        var _visibilityMixin = {};
                        action.setVisibility(types.ACTION_VISIBILITY_ALL,_visibilityMixin);
                    }
                }));
            }
//accelKey, keyCombo, keyProfile, keyTarget, keyScope,mixin
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