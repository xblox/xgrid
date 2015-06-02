/** module:xgrid/Actions **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/types',
    'xide/Keyboard',
    'xide/bean/Action'
], function (declare, utils, types, Keyboard, Action) {

    /**
     * Safe getter within our action map
     * @param who
     * @param command
     * @param field
     * @param defaultValue
     * @returns {*}
     * @private
     */
    function _getSafe(who, command, field, defaultValue) {

        if (who.actions[command] && field in who.actions[command]) {
            return who.actions[command][field];
        }

        return defaultValue;
    }

    /**
     * Safe setter within our action map
     * @param who
     * @param command
     * @param field
     * @param defaultValue
     * @returns {*}
     * @private
     */
    function _setSafe(who, command, field, value) {

        if (who.actions[command]) {
            who.actions[command][field] = value;
        }
    }


    /**
     *  Mixin to add actions to a grid.
     *  @mixin xgrid/Actions
     */
    return declare("xgrid/Actions", [Keyboard], {

        actions: {},
        keyboardMappings: [],
        /**
         *
         */
        destroy: function () {
            if (this.contextMenuHandler) {
                this.contextMenuHandler.destroy();
            }
            this.inherited(arguments);
        },
        /**
         *
         * @returns {boolean}
         */
        shouldShowAction: function () {
            return true;
        },
        /**
         * Set action config
         * @param actionConfig
         */
        setActionConfig: function (actionConfig) {

            actionConfig = actionConfig || [];


            for (var i = 0; i < actionConfig.length; i++) {
                var config = actionConfig[i];

                var action = this.createAction(
                    config.title,
                    config.command,
                    config.group,
                    config.icon,
                    config.handler,
                    config.accelKey,
                    config.keyCombo,
                    config.keyProfile,
                    config.keyTarget,
                    config.keyScope,
                    config.mixin);

                this.setAction(action);

            }
            _.each(this.keyboardMappings, function (mapping) {
                this.registerKeyboardMapping(mapping);
            }, this);
        },
        /**
         *
         */
        postCreate: function () {

            this.inherited(arguments);

            this.actions = {};
            this.features = this.features || {};

            var featureProperties = this.options[types.GRID_OPTION.ITEM_ACTIONS] || {
                        actionConfig: []
                    },
                actionConfig = featureProperties.actionConfig;

            if (featureProperties) {
                utils.mixin(this, featureProperties);
                this.setActionConfig(actionConfig);
            }
        },
        /**
         * set an action in map
         * @param action
         */
        setAction: function (action) {
            this.actions[action.command] = action;
        },
        /**
         * Return action exists
         * @param command
         * @returns {*}
         */
        hasAction: function (command) {
            return this.actions[command];
        },
        /**
         * Return that action is enabled
         * @param command
         * @returns {boolean}
         */
        actionIsEnabled: function (command) {
            return _getSafe(this, command, 'enabled', false);
        },
        /**
         * Set action enabled
         * @param command
         * @param enabled
         * @returns void
         */
        enableAction: function (command, enabled) {
            _setSafe(this, command, 'enabled', enabled);
        },
        /**
         *
         * @param title
         * @param command
         * @param group
         * @param icon
         * @param handler
         * @param accelKey
         * @param keyCombo
         * @param keyProfile
         * @param keyTarget
         * @param keyScope
         * @param mixin
         * @returns {module:xide/Bean/Action}
         */
        createAction: function (title, command, group, icon, handler, accelKey, keyCombo, keyProfile, keyTarget, keyScope, mixin) {

            icon = icon || types.ACTION_ICON[command];

            var args = {accelKey: accelKey};
            if (mixin) {
                utils.mixin(args, mixin);
            }

            var action = Action.createDefault(title, icon, command, group, handler, args).setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR, {label: ''});
            if (keyCombo) {
                this.keyboardMappings.push(Keyboard.defaultMapping(keyCombo, handler, keyProfile || types.KEYBOARD_PROFILE.DEFAULT, keyTarget, keyScope));
            }
            return action;
        }
    });
});