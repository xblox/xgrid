/** @module xgrid/Grid **/
define([
    'dojo/_base/declare',
    'xide/types',
    'xide/utils',
    'xide/factory',
    './Grid',
    './Base',
    'dstore/Memory',
    'dojo/dom-construct',
    'dstore/Trackable',
    'xide/data/TreeMemory',
    'xide/data/ObservableStore',
    'xide/data/Model',
    'xide/data/Reference',
    'xide/data/Source',
    'xgrid/data/Link'

],function (declare,types,utils,factory,Grid,Base,Memory,domConstruct,
            Trackable,TreeMemory,ObservableStore,Model,Reference,Source,Link) {





    var _defaultClass = Base.createGridClass('xgrid/Base',{

        },
        {
            SELECTION: true,
            KEYBOARD_SELECTION: true,
            PAGINATION: false,
            COLUMN_HIDER: true,
            TOOLBAR:true
        },
        null,
        {

        });


    var options = utils.clone(Base.DEFAULT_GRID_OPTIONS);

    options[types.GRID_OPTION.GRID_ACTIONS] = {

    }

    var implementation = declare('xgrid/testGrid',_defaultClass,{
        options:options
    });






    var _last = window._last;

    var ctx = window.sctx,
        parent,
        sourceStore,
        referenceStore;

    function createStore() {

        var storeClass = declare.classFactory('driverStore',[TreeMemory,Trackable,ObservableStore]);
        var MyModel = declare(Model, {});


        var createItem = function(id,label){
            return new Source({
                id:id,
                label:label,
                url:'id ' + id + ' | label ' + label
            })
        };


        var store = new storeClass({
            idProperty: 'id',
            observedProperties:[
                "label"
            ],
            Model:MyModel,
            data: [
                createItem('id1','label1'),
                createItem('id2','label2')
            ]
        });


        sourceStore = store;

        return store;
    }

    function createReferenceStore() {

        var storeClass = declare.classFactory('driverStore',[TreeMemory,Trackable,ObservableStore]);
        var MyModel = declare(Model, {});

        var createItem = function(id,label){
            return new Reference({
                id:id,
                label:label,
                url:'id ' + id + ' | label ' + label
            })
        }

        var store = new storeClass({
            idProperty: 'id',
            observedProperties:[
                "label"
            ],
            Model:MyModel,
            data: [
                createItem('id1','label1'),
                createItem('id2','label2')
            ]
        });

        referenceStore = store;

        return store;
    }

    if (ctx) {
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
            var store = createStore();
            var grid = new implementation({
                collection: store,
                columns: [
                    {
                        renderExpando: true,
                        label: "Name",
                        field: "label",
                        sortable: true
                    },
                    {
                        renderExpando: true,
                        label: "Url",
                        field: "url",
                        sortable: false
                    }

                ]
            }, _last.containerNode);
            grid.startup();
            createReferenceStore();

            var test = function(){

            }



            setTimeout(function(){

                var item1Source = sourceStore.getSync('id1');


                var item1Reference = referenceStore.getSync('id1');

                /*item1Reference.addSource(item1Source);*/


                item1Source.addReference(item1Reference,{
                    properties: {
                        "label":true
                    },
                    onDelete:true
                },true);



                /*
                item1Reference.addSource(item1Source,{
                    properties: {
                        "label":true
                    },
                    onDelete:true
                },true);*/


/*
                item1Source.addRefere(item1Reference,{
                    properties: {
                        "label":true
                    },
                    onDelete:true
                },true);
*/




                /**
                 * source to reference complete
                 */
                /*
                item1Source.set('label','new label');


                console.log('ref 1' + item1Reference.label);
                console.dir(item1Reference);*/

                /*sourceStore.removeSync(item1Source.id);*/



                /**
                 * Reference to source
                 */


                //item1Reference.set('label','new labelR');

                //sourceStore.removeSync(item1Source.id);



                //referenceStore.removeSync(item1Reference.id);




            },1000);



        }
    }


    return implementation;

});