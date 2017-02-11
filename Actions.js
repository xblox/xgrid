/** module xgrid/actions **/
define([
    "xdojo/declare",
    'xide/types',
    'xaction/ActionProvider',
    'xaction/DefaultActions',
    'xide/lodash',
    'xide/$',
    'xide/console'
], function (declare, types, ActionProvider, DefaultActions, _, $, console) {
    var _debug = false;
    /**
     * @class module:xgrid/Actions
     * @lends module:xide/mixins/EventedMixin
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
            /*
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

                var dfd = self._restoreSelection(state, 0, false, 'onActivateActionContext');
                if (dfd && dfd.then) {
                    dfd.then(function (e) {
                        self._isRestoring = false;
                    });
                } else {
                    self._isRestoring = false;
                }

                */
        },
        onDeactivateActionContext: function (context, event) {
            //_debug && console.log('onDeactivateActionContext ' + this.id, event);
            //this._ActionContextState = this._preserveSelection();
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
            action = this.getAction(action);
            _debug && console.log('on after ' + action.command, actionDfdResult);
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
            this._emit(types.EVENTS.ON_AFTER_ACTION, action);
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
                if (action.keyCombo.indexOf('dblclick') !== -1) {
                    var thiz = this;
                    function handler(e) {
                        var row = thiz.row(e);
                        row && thiz.runAction(action, row.data);
                    }
                    this.addHandle('dbclick', this.on('dblclick', handler));
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
            function clickHandler(evt) {
                //container
                if (evt && evt.target) {
                    var $target = $(evt.target);
                    if ($target.hasClass('dgrid-content') || $target.hasClass('dgrid-extra')) {
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
                }
            }
            this.on("contextmenu", clickHandler.bind(this));
            this._on('selectionChanged', function (evt) {
                this._onSelectionChanged(evt);
            }.bind(this));

            this._on('onAddActions', function (evt) {
                var actions = evt.actions,
                    action = types.ACTION.HEADER;

                if (!thiz.getAction(action)) {
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
                            thiz.onAfterAction(types.ACTION.HEADER);
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