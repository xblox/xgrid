/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'dojo/_base/lang',
    'dojo/dom-construct',
    'xide/types',
    './types',
    'xide/utils/ObjectUtils',           //possibly not loaded yet
    'xide/utils',
    'xide/factory',

    'xide/mixins/EventedMixin',
    'dgrid/OnDemandGrid',
    './Defaults',
    './Layout',
    './Focus',
    './ListRenderer',
    './ThumbRenderer',
    './TreeRenderer',
    './GridActions',
    'dstore/Memory',

    'dstore/Trackable',
    'xide/data/TreeMemory',
    './data/ObservableStore',
    'dmodel/Model',
    'xide/views/_ActionMixin',
    'dgrid/util/misc',
    'dijit/CheckedMenuItem',
    'xgrid/Grid',
    'xfile/data/Store',
    './MultiRenderer',
    './Renderer',
    'dijit/form/RadioButton'

], function (declare, lang, domConstruct, types,
             xTypes,ObjectUtils,utils,factory,
             EventedMixin, OnDemandGrid,Defaults,Layout,Focus,
             ListRenderer,ThumbRenderer,TreeRenderer,
             GridActions,
             Memory, Trackable,TreeMemory,ObservableStore,Model,_ActionMixin,
             miscUtil,
             CheckedMenuItem,Grid,Store,MultiRenderer,Renderer,RadioButton)
{


    /***
     * playground
     */
    var _last = window._last;
    var ctx = window.sctx,
        parent;




    if (ctx) {

        var doTest = true;
        if(doTest) {

            var xfileCtx = ctx.getXFileContext();

            function createStore(mount) {

                var storeClass = declare.classFactory('fileStore',[Store,Trackable,ObservableStore]);
                var MyModel = declare(Model, {});
                var config = types.config;

                var options = {
                    fields: types.FIELDS.SHOW_ISDIR |
                    types.FIELDS.SHOW_OWNER |
                    types.FIELDS.SHOW_SIZE |
                    types.FIELDS.SHOW_FOLDER_SIZE |
                    types.FIELDS.SHOW_MIME |
                    types.FIELDS.SHOW_PERMISSIONS |
                    types.FIELDS.SHOW_TIME
                };


                var store = new storeClass({
                    idProperty: 'path',
                    Model: MyModel,
                    data:[],
                    config:config,
                    url:types.config.FILE_SERVICE,
                    serviceUrl:types.config.FILE_SERVICE,
                    serviceClass:types.config.FILES_STORE_SERVICE_CLASS,
                    mount:mount,
                    options:options
                });

                store._state = {
                    initiated:false,
                    filter:null,
                    filterDef:null
                };

                store.reset();
                store.config = config;
                store.setData([]);
                store.init();

                return store;
            }

            var fileStore = createStore('docs');

            var renderers = [ListRenderer,ThumbRenderer,TreeRenderer];

            var _p = {
                renderers:renderers,
                    selectedRender:null,
                renderRow:function(){
                var parent = this.selectedRender.prototype;

                if(parent['renderRow']) {
                    return parent['renderRow'].apply(this, arguments);
                }
                return this.inherited(arguments);
            },
                insertRow:function(){

                    var parent = this.selectedRender.prototype;

                    if(parent['insertRow']) {
                        return parent['insertRow'].apply(this, arguments);
                    }
                    return this.inherited(arguments);
                },
                startup:function(){
                    this.inherited(arguments);
                    /*console.dir(this.selectedRender);*/
                }
            };


            var multiRenderer = declare.classFactory('multiRenderer',{

            },renderers,MultiRenderer.Implementation);






            var _grid = null;
            try {
                _grid = Grid.createGridClass('noname', {
                        style: 'width:800px'
                        /*adjustRowIndices: function () {}*/
                    },
                    {
                        SELECTION: true,
                        KEYBOARD_SELECTION: true,
                        /*PAGINATION: true,*/
                        COLUMN_HIDER:types.GRID_FEATURES.COLUMN_HIDER,
                        GRID_ACTIONS:types.GRID_FEATURES.GRID_ACTIONS,
                        ITEM_ACTIONS:types.GRID_FEATURES.ITEM_ACTIONS,
                        ITEM_CONTEXT_MENU:types.GRID_FEATURES.ITEM_CONTEXT_MENU,
                        TOOLBAR:types.GRID_FEATURES.TOOLBAR
                        /*KEYBOARD_SEARCH:types.GRID_FEATURES.KEYBOARD_SEARCH*/
                    },
                    {
                        RENDERER:multiRenderer
                    },
                    {

                    });
            } catch (e) {
                debugger;
            }















            var mainView = ctx.mainView;
            if (mainView) {
                parent = mainView.getNewAlternateTarget();
                if (_last) {
                    parent.removeChild(_last);
                }
                _last = factory.createPane('new', 'fa-copy', parent, {
                    closable: true,
                    parentContainer: parent
                });
                window._last = _last;
                //var store = createStore();
                var store = fileStore;

                /*
                store.on('add', function () {
                    console.warn('added', arguments);
                });
                */
                store.on('update', function () {
                    console.warn('updated', arguments);
                });
/*
                store.on('delete', function () {
                    console.warn('removed', arguments);
                });
*/




                var actions = [],
                    thiz = this,
                    ACTION_TYPE = types.ACTION,
                    ACTION_ICON = types.ACTION_ICON,
                    grid;

/*
                actions.push(_ActionMixin.createActionParameters('Edit', ACTION_TYPE.EDIT, 'edit', types.ACTION_ICON.EDIT, function () {

                }, 'Enter | F4', ['f4', 'enter'], null, thiz, thiz));*/




                var itemActions = [];


                //itemActions = itemActions.concat(MultiRenderer.Implementation.getRendererActions(renderers));





                grid = new _grid({
                    renderers:renderers,
                    selectedRender:TreeRenderer,
                    /*renderers:[ThumbRenderer,ListRenderer,TreeRenderer],*/
                    shouldShowAction: function (action) {
                        return true;
                    },
                    gridActions:actions,
                    itemActions:itemActions,
                    collection: store.getDefaultCollection(),
                    showHeader:true,
                    options: utils.clone(types.DEFAULT_GRID_OPTIONS),
                    columns: [
                        {
                            renderExpando: true,
                            label: "Name",
                            field: "name",
                            sortable: true
                            //hidden:true
                        },
                        {
                            label: "Path",
                            field: "path",
                            hidden:false,
                            icon:'fa-cube'
                        },
                        {
                            label: "Size",
                            field: "size",
                            icon:'fa-cube'

                        },
                        {
                            label: "Modified",
                            field: "modified",
                            icon:'fa-cube'
                        }

                    ]
                }, _last.containerNode);

                grid.startup();



                grid.onContainerClick();

                var itemActions = grid.getItemActions();
                itemActions = itemActions.concat(grid.getRendererActions(grid.getRenderers()));

                grid.setItemActions(itemActions);










                grid._on('selectionChanged',function(data){
                    //console.dir(data.selection);
                });





/*
                grid.on("dgrid-select", function (data) {
                    console.log('on-dgrid-select',grid.getSelection());
                });

                grid.on("dgrid-deselect", function (data) {
                    console.log('on-dgrid-deselect',grid.getSelection());
                });
                */











                function test() {
                    return;
                    grid.setRenderer(ListRenderer);
                    grid.refresh();

                    var toolbar = grid.getToolbar();

                    var radio = utils.addWidget(RadioButton,{
                        checked:true
                    },null,toolbar,true);





                    /*
                    for (var i = 6; i < 10; i++) {
                        store.putSync({
                            id: 'id' + i,
                            label: 'test ' + i,
                            parentId:'id1',
                            "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"

                        });
                    }

                    store.putSync({
                        id: 'id3',
                        label: 'test3',
                        "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg",
                        render: function (obj) {

                            return domConstruct.create('span', {
                                className: "fileGridCell",
                                innerHTML: '<span class=\"' + '' + '\""></span> <div class="name">' + obj.label + '</div>',
                                style: 'max-width:200px;float:left;margin:18px;padding:18px;'
                            });
                        }

                    });
                    */
/*
                    var item = store.getSync('id1');
                    item.set('label', 'new label');*/
                    //grid.select(item3);
                    //dijitReset View-Layout-Thumb dijitMenuItem dijitRadioMenuItem dijitMenuItemChecked dijitRadioMenuItemChecked dijitChecked
                    //dijit dijitReset dijitInline dijitRadio dijitRadioChecked dijitChecked
                    //dijitReset View-Layout-Thumb dijitMenuItem dijitRadioMenuItem dijitMenuItemChecked dijitRadioMenuItemChecked dijitChecked

                }
                function test2() {

                    return;

                    console.log('-------------------------------------------------------------------------');

                    var item = store.getSync('id3');
                    var item1 = store.getSync('id1');
                    var item2 = store.getSync('id2');


                    //console.dir(grid._rows);


                    /*
                     grid.select(item);
                     grid.focus(item);*/


                    //grid.select([item,item1,item2]);
                    //grid.select(item);
                    grid.select([item1, item2], null, true, {
                        append: true,
                        focus: false,
                        silent: true

                    });





                    /*var isToolbared = grid.hasFeature('TOOLBAR');
                    console.warn('has Toolbar ');*/



                    /*
                     var nameProperty = item.property('label');

                     var urlProperty = item.property('url');


                     nameProperty.observe(function () {
                     console.log('horray!', arguments);
                     });

                     urlProperty.observe(function () {
                     console.log('horray url', arguments);
                     });

                     item.set('label', 'new label');
                     item.set('url', null);

                     //store.notify(item,'id3');
                     store.emit('update', {target: item});
                     */


                    /*grid.refresh();*/
                    //console.log('item ', item);

                    /*
                     grid.select(store.getSync('id99'), null, true, {
                     append: true,
                     focus: true,
                     silent:true
                     });*/

                    var item99 = store.getSync('id99');
                    var item98 = store.getSync('id98');

                    grid.select([item99, item98], null, true, {
                        append: true,
                        focus: true,
                        silent: false
                    });

                    //console.log('is selected ' + grid.isSelected(item98));

                    //console.dir(grid.getRows(true));

                    /*console.dir(grid.getPrevious(item99, false, true));*/
                    /*
                     console.dir(grid.getSelection(function(item){
                     return item.id!='id99';
                     }));*/


                    //console.log(grid.getFocused());

                    /*store.removeSync('id3');*/
                }


                setTimeout(function () {
                    test();
                }, 2000);

                setTimeout(function () {
                    test2();
                }, 2000);

            }



        }
    }

    return Grid;

});