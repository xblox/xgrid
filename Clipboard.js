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
            function _createEntry(label,command,icon) {

                actions.push(_ActionMixin.createActionParameters(label, command, 'Clipboard', icon, function () {

                }, '', null, null, thiz, thiz, {
                    filterGroup:"item|view",
                    tab:"Home",
                    __onCreate:function(action){
                        var _visibilityMixin = {};
                        action.setVisibility(ACTION_VISIBILITY.ACTION_TOOLBAR,_visibilityMixin);
                        action.setVisibility(ACTION_VISIBILITY.CONTEXT_MENU,_visibilityMixin);
                        action.setVisibility(ACTION_VISIBILITY.MAIN_MENU,_visibilityMixin);
                    }
                }));
            }

            _createEntry('Copy','Edit/Copy','fa-copy');
            _createEntry('Paste','Edit/Paste','fa-paste');
            _createEntry('Cut','Edit/Cut','fa-cut');


            return actions;
        }
    };

    //package via declare
    var _class = declare('xgrid.Clipboard',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});