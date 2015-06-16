/** @module xgrid/types **/
define([
    "xdojo/declare",
    'xide/types',
    './ColumnHider',
    'dgrid/extensions/ColumnReorder',
    'dgrid/extensions/ColumnResizer',
    'dgrid/extensions/Pagination',

    './Selection',
    './Toolbar',
    './ItemActions',
    './GridActions',
    './ItemContextMenu',
    //'xide/grid/_GridKeyboardSelection',
    './Keyboard',
    'xide/grid/_GridKeyNavMixin',

    'xide/mixins/EventedMixin',
    'dgrid/OnDemandGrid',
    './Defaults',
    './Layout',
    './Focus',
    './ListRenderer',
    './Clipboard'

], function (declare,types,
             ColumnHider, ColumnReorder, ColumnResizer, Pagination,
             Selection,Toolbar,ItemActions,GridActions,ItemContextMenu,_GridKeyboardSelection,_GridKeyNavMixin,EventedMixin, OnDemandGrid,Defaults,Layout,Focus,
             ListRenderer,
             Clipboard) {


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
        FOCUS:Focus
    };

    /**
     * Default Grid Options
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
        KEYBOARD_SEARCH: {
            CLASS: _GridKeyNavMixin,
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
        ITEM_ACTIONS: {
            CLASS: ItemActions,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        ITEM_CONTEXT_MENU: {
            CLASS: ItemContextMenu,
            IMPLEMENTATION: {},
            CLASSES: null
        },
        GRID_ACTIONS:{
            CLASS:GridActions,
            IMPLEMENTATION:{},
            CLASSES:null
        },
        CLIPBOARD:{
            CLASS:Clipboard,
            IMPLEMENTATION:{},
            CLASSES:null
        }
    };

    return declare(null,[],{});


});