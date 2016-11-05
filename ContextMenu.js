/** module:xgrid/ContextMenu **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/widgets/ContextMenu',
    'xide/types'
], function (declare, utils, ContextMenu, types) {
    return declare("xgrid.ContextMenu", null, {
        contextMenu: null,
        getContextMenu: function () {
            return this.contextMenu;
        },
        _createContextMenu: function () {
            var _ctorArgs = this.contextMenuArgs || {};
            var mixin = {
                owner: this,
                delegate: this,
                _actionFilter: {
                    quick: true
                }
            };

            utils.mixin(_ctorArgs, mixin);
            var node = this.contentNode;
            var contextMenu = new ContextMenu(_ctorArgs, node);
            contextMenu.openTarget = node;
            contextMenu.init({preventDoubleContext: false});
            contextMenu._registerActionEmitter(this);
            this.contextMenu = contextMenu;
            if (this.add) {
                this.add(contextMenu);
            } else {
                console.error('have no add!');
            }
        },
        startup: function () {
            if (this._started) {
                return;
            }
            this.inherited(arguments);
            if (this.hasPermission(types.ACTION.CONTEXT_MENU)) {
                this._createContextMenu();
            }
        }
    });
});