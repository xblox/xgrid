/** @module xgrid/types **/
define([
    "xdojo/declare",
    'xide/types',
    'xgrid/ColumnHider',
    'dgrid/extensions/ColumnReorder', //@todo : fork!
    'dgrid/extensions/ColumnResizer', //@todo : fork!
    'dgrid/extensions/Pagination',    //@todo : fork!
    'xgrid/Selection',
    'xgrid/Toolbar',
    'xgrid/ContextMenu',
    'xgrid/Keyboard',
    'xide/mixins/EventedMixin',
    'dgrid/OnDemandGrid',
    'xgrid/Defaults',
    'xgrid/Layout',
    'xgrid/Focus',
    'xgrid/ListRenderer',
    'xgrid/Clipboard',
    'xgrid/Actions',
    'xlang/i18'
], (
    declare,
    types,
    ColumnHider,
    ColumnReorder,
    ColumnResizer,
    Pagination,
    Selection,
    Toolbar,
    ContextMenu,
    _GridKeyboardSelection,
    EventedMixin,
    OnDemandGrid,
    Defaults,
    Layout,
    Focus,
    ListRenderer,
    Clipboard,
    Actions,
    i18
) => {
    /**
     * Grid Bases
     * @enum module:xgrid/types/GRID_BASES
     * @memberOf module:xgrid/types
     */
    types.GRID_BASES = {
        GRID: OnDemandGrid,
        LAYOUT:Layout,
        DEFAULTS: Defaults,
        RENDERER: ListRenderer,
        EVENTED: EventedMixin,
        FOCUS:Focus,
        i18:i18
    };
    /**
     * Default Grid Options
     * @deprecated
     * @enum module:xgrid/types/DEFAULT_GRID_OPTIONS
     * @memberOf module:xgrid/types
     */
    types.DEFAULT_GRID_OPTIONS = {
        /**
         * Instruct the grid to add jQuery theme classes
         * @default true
         * @type {bool}
         * @constant
         */
        USE_JQUERY_CSS: true,
        /**
         * Behaviour flag to deselect an item when its already selected
         * @default true
         * @type {bool}
         * @constant
         */
        DESELECT_SELECTED: true,
        /**
         * Behaviour flag to clear selection when clicked on the container node
         * @default true
         * @type {bool}
         * @constant
         */
        CLEAR_SELECTION_ON_CLICK: true,
        /**
         * Item actions
         * @default true
         * @type {object}
         * @constant
         */
        ITEM_ACTIONS: {},
        /**
         * Grid actions (sort, hide column, layout)
         * @default true
         * @type {object}
         * @constant
         */
        GRID_ACTIONS: {},
        /**
         * Publish selection change globally
         * @default true
         * @type {boolean}
         * @constant
         */
        PUBLISH_SELECTION: false
    };
    /**
     * Grid option keys
     * @enum module:xgrid/types/GRID_OPTION
     * @memberOf module:xgrid/types
     */
    types.GRID_OPTION = {
        /**
         * Instruct the grid to add jQuery theme classes
         * @default true
         * @type {string}
         * @constant
         */
        USE_JQUERY_CSS: 'USE_JQUERY_CSS',
        /**
         * Behaviour flag to deselect an item when its already selected
         * @default true
         * @type {string}
         * @constant
         */
        DESELECT_SELECTED: 'DESELECT_SELECTED',
        /**
         * Behaviour flag to deselect an item when its already selected
         * @default true
         * @type {string}
         * @constant
         */
        CLEAR_SELECTION_ON_CLICK:'CLEAR_SELECTION_ON_CLICK',
        /**
         * Actions
         * @default true
         * @type {string}
         * @constant
         */
        ITEM_ACTIONS:'ITEM_ACTIONS',
        /**
         * Actions
         * @default true
         * @type {string}
         * @constant
         */
        GRID_ACTIONS:'GRID_ACTIONS'
    };
    /**
     * All grid default features
     * @enum module:xgrid/types/GRID_DEFAULT_FEATURES
     * @memberOf module:xgrid/types
     */
    types.DEFAULT_GRID_FEATURES = {
        SELECTION: {
            CLASS: Selection,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        KEYBOARD_SELECTION: {
            CLASS: _GridKeyboardSelection,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        COLUMN_HIDER: {
            CLASS: ColumnHider,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        COLUMN_REORDER: {
            CLASS: ColumnReorder,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        COLUMN_RESIZER: {
            CLASS: ColumnResizer,
            IMPLEMENTATION: {},
            CLASSES: null
        }
    };
    /**
     * All Grid Features for easy access
     * @enum module:xgrid/types/GRID_FEATURES
     * @memberOf module:xgrid/types
     */
    types.GRID_FEATURES = {
        SELECTION: {
            CLASS: Selection,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        KEYBOARD_SELECTION: {
            CLASS: _GridKeyboardSelection,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        COLUMN_HIDER: {
            CLASS: ColumnHider,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        COLUMN_REORDER: {
            CLASS: ColumnReorder,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        COLUMN_RESIZER: {
            CLASS: ColumnResizer,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        PAGINATION: {
            CLASS: Pagination,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        TOOLBAR: {
            CLASS: Toolbar,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        CONTEXT_MENU: {
            CLASS: ContextMenu,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        ACTIONS: {
            CLASS: Actions,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        CLIPBOARD:{
            CLASS:Clipboard,
            IMPLEMENTATION:{},
            CLASSES:null
        }
    };
    return declare(null,[],{});
});