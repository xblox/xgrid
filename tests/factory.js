
/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'dojo/on',
    'xide/types',
    'xide/utils',
    'xide/factory',
    'xgrid/ListRenderer',
    'xgrid/ThumbRenderer',
    'xgrid/TreeRenderer',
    'dstore/Trackable',
    'xide/data/ObservableStore',
    'xide/data/Model',
    'xide/views/_ActionMixin',
    'xgrid/Grid',
    'xfile/data/Store',
    'xgrid/MultiRenderer',
    'dijit/form/RadioButton',
    'xfile/views/FileGrid',
    'xide/widgets/Ribbon',
    'xide/editor/Registry',
    'xaction/DefaultActions',
    'xaction/Action',
    'xgrid/Keyboard',
    'xfile/tests/ThumbRenderer',
    'dojo/dom-construct',
    'xgrid/Renderer',
    'xfile/model/File',
    'xide/widgets/TemplatedWidgetBase',
    './file_data',
    'xgrid/Base',

    'xide/data/TreeMemory'

], function (declare,on,types,
             utils,factory,ListRenderer, ThumbRenderer, TreeRenderer,
             Trackable, ObservableStore, Model, _ActionMixin,
             Grid, Store, MultiRenderer, RadioButton, FileGrid, Ribbon, Registry, DefaultActions, Action,Keyboard,ThumbRenderer2,domConstruct,Renderer,File,TemplatedWidgetBase,file_data,Base,
             TreeMemory)
{
    /***
     * playground
     */
    var _lastFileGrid = window._lastFileGrid;
    var _lastGrid = window._lastGrid;
    var ctx = window.sctx,
        parent,
        _lastRibbon = window._lastRibbon,
        ACTION = types.ACTION;


    function testMain(grid){
        //console.clear();
        //download('test.js','asdfasdfsdf');

    }
    function createGridClass(){
        return FileGrid;

    }


    function createStore(mount) {

        var storeClass = declare('fileStore', TreeMemory,{

        });
        var store = new storeClass({
            idProperty: 'path'
        });

        store._state = {
            initiated: false,
            filter: null,
            filterDef: null
        };

        store.setData(file_data.createFileListingData());
        return store;
    }



    if (ctx) {


        var doTest = true;
        if (doTest) {

            var fileStore = createStore('root');
            var mainView = ctx.mainView;

            var docker = mainView.getDocker();
            if(window._lastGrid){
                docker.removePanel(window._lastGrid);
            }
            parent = docker.addTab(null, {
                title: 'Documentation',
                icon: 'fa-folder'
            });

            var actions = [],
                thiz = this,
                ACTION_TYPE = types.ACTION,
                ACTION_ICON = types.ACTION_ICON,
                grid,
                ribbon,
                store = fileStore;

            var _gridClass = createGridClass();

            grid = new _gridClass({
                //selectedRenderer: thumb,
                collection: store,
                _parent: parent
            }, parent.containerNode);
            grid.startup();

            window._lastGrid = parent;

            setTimeout(function () {
                mainView.resize();
                grid.resize();

            }, 1000);

            function test() {

                testMain(grid);
            }
            setTimeout(function () {
                test();
            }, 2000);


        }
    }

    return Grid;

});