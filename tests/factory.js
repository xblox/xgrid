/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'xide/types',
    'xgrid/Grid',
    'xfile/views/FileGrid',
    'xfile/model/File',
    './file_data',
    'xide/data/TreeMemory'
], function (declare,types,
             Grid, FileGrid, File,file_data,TreeMemory)
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
            idProperty: 'path',
            Model:File
        });
        store._state = {
            initiated: false,
            filter: null,
            filterDef: null
        };
        var data = file_data.createFileListingData();


        _.each(data,item => {
           item._S = store ;
        });
        store.setData(data);
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

            setTimeout(() => {
                mainView.resize();
                grid.resize();

            }, 1000);

            function test() {

                testMain(grid);
            }
            setTimeout(() => {
                test();
            }, 2000);


        }
    }

    return Grid;

});