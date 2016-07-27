/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'xide/types',
    'xgrid/ListRenderer',
    'xfile/ThumbRenderer',
    'xgrid/TreeRenderer',
    'xgrid/Grid',
    'xgrid/MultiRenderer',
    'xfile/FileActions',
    'xfile/Statusbar',
    'xfile/views/UploadMixin',
    'xide/views/_LayoutMixin',
    'xgrid/KeyboardNavigation',
    'xgrid/Search',
    'xgrid/Selection',
    'xide/mixins/_State',
    "xide/widgets/_Widget",
    'xfile/views/FileConsole',
    'xfile/FolderSize'
], function (declare, types,
             ListRenderer, ThumbRenderer, TreeRenderer,
             Grid, MultiRenderer,FileActions,Statusbar,UploadMixin,
             _LayoutMixin,KeyboardNavigation,Search,Selection,_State,_Widget,FileConsole,FolderSize) {

    
    var Implementation = {},
        renderers = [ListRenderer,ThumbRenderer,TreeRenderer],
        multiRenderer = declare.classFactory('multiRenderer',{},renderers,MultiRenderer.Implementation);


    var GridClass = Grid.createGridClass('xfile.views.Grid', Implementation, {
            SELECTION: {
                CLASS:Selection
            },
            KEYBOARD_SELECTION: true,
            CONTEXT_MENU: types.GRID_FEATURES.CONTEXT_MENU,
            TOOLBAR: types.GRID_FEATURES.TOOLBAR,
            CLIPBOARD:types.GRID_FEATURES.CLIPBOARD,
            ACTIONS:types.GRID_FEATURES.ACTIONS,
            ITEM_ACTIONS: {
                CLASS:FileActions
            },
            STATUS_BAR: {
                CLASS:Statusbar
            },
            SPLIT:{
                CLASS:_LayoutMixin
            },
            KEYBOARD_NAVIGATION:{
                CLASS:KeyboardNavigation
            },
            SEARCH:{
                CLASS:Search
            },
            STATE:{
                CLASS:_State
            },
            UPLOAD: {
                CLASS:UploadMixin
            },
            WIDGET:{
                CLASS:_Widget
            },
            CONSOLE:{
                CLASS:FileConsole
            },
            SIZES:{
                CLASS:FolderSize
            }
        },
        {
            RENDERER: multiRenderer
        },
        {
            renderers: renderers,
            selectedRenderer: TreeRenderer
        }
    );

    GridClass.DEFAULT_RENDERERS = renderers;
    GridClass.DEFAULT_MULTI_RENDERER = multiRenderer;

    return GridClass;

});