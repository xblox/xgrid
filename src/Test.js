/** @module xgrid/Grid **/
define([
    'dojo/_base/declare',
    'xide/types',
    'xide/utils',
    'xide/factory',
    './Grid',
    './Base',
    'dstore/Memory',
    'dojo/dom-construct'
],function (declare,types,utils,factory,Grid,Base,Memory,domConstruct) {


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
        parent;

    function createStore() {

        var store = new Memory({
            idProperty: 'id',
            data: [
                {
                    id: 'id1',
                    label: 'test1',
                    "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0306.jpg"
                },
                {
                    id: 'id2',
                    label: 'test2',
                    "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"
                },
                {
                    id: 'id5',
                    label: 'test5',
                    "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"
                },
                {
                    id: 'id4',
                    label: 'test4',
                    "url": null
                }

            ]
        });

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


            setTimeout(function(){

                console.dir(grid.currentRows);

            },1000)

        }
    }


    return implementation;

});