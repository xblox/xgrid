/** module xgrid/actions **/
define([
    "xdojo/declare",
    'xide/types',
    'xaction/ActionProvider',
    'xaction/DefaultActions'
], function (declare, types, ActionProvider, DefaultActions) {
    var _debug = false;
    /**
     * @class xgrid.actions
     *
     * All about actions:
     * 1. implements std before and after actions:
     * 1.1 on onAfterAction its restoring focus and selection automatically
     * 2. handles and forwards click, contextmenu and onAddActions     *
     */
    var Implementation = {

        _ActionContextState: null,
        onActivateActionContext: function (context, e) {

            return;
            var state = this._ActionContextState;
            if (this._isRestoring) {
                return;
            }
            this._isRestoring = true;
            if (e != null && e.selection && state) {
                state.selection = e != null ? e.selection : state.selection;
            }
            var self = this;
            _debug && console.log('onActivateActionContext', e);
            //@TODO Fixme
            /*setTimeout(function () {*/
                var dfd = self._restoreSelection(state, 0, false, 'onActivateActionContext');
                if (dfd && dfd.then) {
                    dfd.then(function (e) {
                        self._isRestoring = false;
                    });
                } else {
                    self._isRestoring = false;
                }
            /*}, 1000);*/
        },
        onDeactivateActionContext: function (context, event) {
            return;
            _debug && console.log('onDeactivateActionContext ' + this.id, event);
            this._ActionContextState = this._preserveSelection();
        },
        /**
         * Callback when action is performed:before (xide/widgets/_MenuMixin)
         * @param action {module:xaction/Action}
         */
        onBeforeAction: function (action) {
        },
        /**
         * Callback when action is performed: after (xide/widgets/_MenuMixin)
         *
         * @TODO Run the post selection only when we are active!
         *
         *
         * @param action {module:xaction/Action}
         */
        onAfterAction: function (action, actionDfdResult) {
            _debug && console.log('on after', actionDfdResult);
            if (actionDfdResult != null) {
                if (_.isObject(actionDfdResult)) {
                    // post work: selection & focus
                    var select = actionDfdResult.select,
                        focus = actionDfdResult.focus || true;
                    if (select) {
                        var options = {
                            append: actionDfdResult.append,
                            focus: focus,
                            delay: actionDfdResult.delay || 1,
                            expand: actionDfdResult.expand
                        };
                        //focus == true ? null : this.focus();
                        return this.select(select, null, true, options);
                    }
                }
            }
        },
        hasPermission: function (permission) {
            return DefaultActions.hasAction(this.permissions, permission);
        },
        /**
         *
         * @param where
         * @param action
         * @returns {boolean}
         */
        addAction: function (where, action) {
            if (action.keyCombo && _.isArray(action.keyCombo)) {
                if (action.keyCombo.indexOf('dblclick') != -1) {
                    var thiz = this;
                    this.on('dblclick', function (e) {
                        var row = thiz.row(e);
                        row && thiz.runAction(action, row.data);
                    });
                }
            }
            return this.inherited(arguments);
        },
        /**
         * Callback when selection changed, refreshes all actions
         * @param evt
         * @private
         */
        _onSelectionChanged: function (evt) {
            this.inherited(arguments);
            this.refreshActions();
        },
        ////////////////////////////////////////////////////////////////////////////
        //
        //  Original ActionMixin
        //
        ///////////////////////////////////////////////////////////////////////////
        /**
         *
         * @param provider
         * @param target
         */
        updateActions: function (provider, target) {
            var actions,
                actionsFiltered,
                selection = this.getSelection();

            if (provider && target) {
                actions = provider.getItemActions();
                actionsFiltered = this._filterActions(selection, actions, provider);
                target.setItemActions({}, actionsFiltered);
            }
        },
        startup: function () {
            if (this._started) {
                return;
            }
            var thiz = this;
            thiz.domNode.tabIndex = -1;
            var clickHandler = function (evt) {
                //var active = thiz.isActive();
                //container
                if (evt && evt.target && $(evt.target).hasClass('dgrid-content')) {

                    thiz.select([], null, false);
                    thiz.deselectAll();
                    if (evt.type !== 'contextmenu') {
                        setTimeout(function () {
                            thiz.domNode.focus();
                            document.activeElement = thiz.domNode;
                            $(thiz.domNode).focus();
                        }, 1);
                    }
                }
            };
            this.on("contextmenu", clickHandler.bind(this));
            this._on('selectionChanged', function (evt) {
                this._onSelectionChanged(evt);
            }.bind(this));

            this._on('onAddActions', function (evt) {
                var actions = evt.actions,
                    permissions = evt.permissions,
                    container = thiz.domNode,
                    action = types.ACTION.HEADER;

                if(!thiz.getAction(action)) {
                    actions.push(thiz.createAction({
                        label: 'Header',
                        command: action,
                        icon: 'fa-hdd-o',
                        tab: 'View',
                        group: 'Show',
                        mixin: {
                            actionType: 'multiToggle'
                        },
                        onCreate: function (action) {
                            action.set('value', thiz.showHeader);
                        },
                        onChange: function (property, value) {
                            thiz._setShowHeader(value);
                            thiz.showHeader = value;
                        }
                    }));
                }
            });
            return this.inherited(arguments);
        }
    };
    //package via declare
    var _class = declare('xgrid.Actions', ActionProvider, Implementation);
    _class.Implementation = Implementation;
    return _class;
});