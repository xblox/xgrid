/** module:xgrid/ContextMenu **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/widgets/ContextMenu',
    'xide/types'
], (declare, utils, ContextMenu, types) => declare("xgrid.ContextMenu", null, {
    contextMenu: null,
    getContextMenu: function () {
        return this.contextMenu;
    },
    _createContextMenu: function () {
        var _ctorArgs = this.contextMenuArgs || {};
        var node = this.contentNode;
        var mixin = {
            owner: this,
            delegate: this,
            _actionFilter: {
                quick: true
            }
        };
        utils.mixin(_ctorArgs, mixin);
        var contextMenu = new ContextMenu(_ctorArgs, node);
        contextMenu.openTarget = node;
        //@TODO: remove back dijit compat
        //contextMenu.limitTo=null;
        contextMenu.init({preventDoubleContext: false});
        contextMenu._registerActionEmitter(this);
        $(node).one('contextmenu',e => {
            e.preventDefault();
            if(!this.store) {
                contextMenu.setActionStore(this.getActionStore(), this);
            }
        });
        this.contextMenu = contextMenu;
        this.add(contextMenu);
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
}));