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

    './GridActions',
    'dstore/Memory',
    'dstore/Trackable',
    'dmodel/Model'
], function (declare, lang, domConstruct, types,
             xTypes,ObjectUtils,utils,factory,
             EventedMixin, OnDemandGrid,Defaults,Layout,Focus,ListRenderer,
             GridActions,
             Memory, Trackable, Model) {






    /**
     * Grid Bases
     * @enum module:xgrid/types/GRID_BASES
     * @memberOf module:xgrid/types
     */
    var DEFAULT_GRID_BASES = {

        GRID: OnDemandGrid,
        DEFAULTS: Defaults,
        RENDERER: ListRenderer,
        EVENTED: EventedMixin,
        FOCUS:Focus

    };

    types.GRID_BASES = DEFAULT_GRID_BASES;

    /**
     *
     * @param name
     * @param bases
     * @param extraClasses
     * @param implementation
     * @returns {*}
     */
    function classFactory(name, bases, extraClasses, implmentation) {


        var baseClasses = bases!=null ? bases : utils.cloneKeys(types.GRID_BASES),
            extras = extraClasses || [],
            _name = name || 'xgrid.Base',
            _implmentation = implmentation || {};

        if (bases) {
            utils.mixin(baseClasses, bases);
        }

        var classes = [];
        for (var _class in baseClasses) {
            var _classProto = baseClasses[_class];
            if ( _classProto) {
                classes.push(baseClasses[_class]);
            }
        }

        classes = classes.concat(extras);

        return declare(_name, classes, _implmentation);
    }

    /**
     * Default implementation
     @class module:xgrid/Base
     */
    var Implementation = {

        _featureMap:{},
        hasFeature:function(name){
            for(var name  in this._featureMap){
                if(this._featureMap[name]){
                    return this._featureMap[name];
                }
            }
            return null;
        },
        getRows:function(domNodes,filterFunction){

            var result = [];
            this.currentRows.forEach(function(row){
                result.push(this.row(row)[domNodes? 'element' : 'data' ]);
            },this);
            if(filterFunction){
                return result.filter(filterFunction);
            }
            return result;
        }
    };
    /**
     * Create default class
     * @type {*}
     * @private
     */
    var _default = classFactory('xgrid.Default', {}, [], Implementation);

    /**
     * Grid class factory
     * @param name {string} A name for the class created
     * @param baseClass {object} the actual implementation
     * @param features {object} the feature map override
     * @param gridClasses {object} the base grid classes map override
     * @param args {object} extra args
     * @memberOf module:xgrid/Base
     * @returns {module:xgrid/Base}
     */
    function createGridClass(name, baseClass, features, gridClasses, args) {

        var _isNewBaseClass = false;

        baseClass = baseClass || _default;

        //simple case, no base class and no features
        if (!baseClass && !features) {
            return _default;
        }


        if (baseClass) {
            _isNewBaseClass = gridClasses && ('EVENTED' in gridClasses || 'GRID' in gridClasses || 'RENDERER' in gridClasses || 'DEFAULTS' in gridClasses  || 'LAYOUT' in gridClasses || 'FOCUS' in gridClasses);
            var defaultBases = utils.cloneKeys(types.GRID_BASES);
            if (_isNewBaseClass) {
                lang.mixin(defaultBases, gridClasses);
                for (var i in defaultBases) {
                    if (defaultBases[i] === null || defaultBases[i] === undefined || defaultBases[i] === false) {
                        // test[i] === undefined is probably not very useful here
                        delete defaultBases[i];
                    }
                }
                baseClass = classFactory(name, defaultBases, [_default], baseClass);
            } else {
                baseClass = classFactory(name, defaultBases, [_default], baseClass);

            }
        }


        function getFeature(feature, defaultFeature) {

            var _isNewFeatureStruct = 'CLASS' in feature || 'CLASSES' in feature || 'IMPLEMENTATION' in feature;
            if (_isNewFeatureStruct) {
                var _default = utils.cloneKeys(defaultFeature);
                lang.mixin(_default, feature);
                return _default;
            }
            return defaultFeature;
        }

        var newFeatures = [];
        var featureMap = {};

        //case: base class and features
        if (baseClass && features) {

            var _defaultFeatures = utils.cloneKeys(types.DEFAULT_GRID_FEATURES);

            lang.mixin(_defaultFeatures, features);


            for (var featureName in _defaultFeatures) {

                var feature = _defaultFeatures[featureName];

                if (!_defaultFeatures[featureName]) {
                    continue;
                }

                var newFeature = null;

                //is a default feature
                if (feature === true) {
                    newFeature = types.DEFAULT_GRID_FEATURES[featureName];
                } else if (types.DEFAULT_GRID_FEATURES[featureName]) {
                    newFeature = getFeature(feature, types.DEFAULT_GRID_FEATURES[featureName]);
                } else {
                    newFeature = feature;
                }

                if (newFeature) {
                    var featureClass = classFactory(featureName, newFeature['CLASSES'] || [], [newFeature['CLASS']], newFeature['IMPLEMENTATION']);
                    newFeatures.push(featureClass);
                    featureMap[featureName]=featureClass;
                }


            }

            //recompose
            if (newFeatures.length > 0) {
                baseClass = classFactory(name, [baseClass], newFeatures, args);
            }

            //complete
            baseClass.prototype._featureMap = featureMap;
        }
        return baseClass;
    }


    /***
     * playground
     */

    var _last = window._last;
    var ctx = window.sctx,
        parent;

    function createStore() {

        var storeClass = classFactory('myStore', [Memory, Trackable]);

        var MyModel = declare(Model, {
            schema: {
                label: 'string', // simple definition
                url: {
                    type: 'string',
                    required: true
                }
            }
        });

        var store = new storeClass({
            idProperty: 'id',
            Model: MyModel,
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

        return store;
    }
    if (ctx) {


        var doTest = true;
        if(doTest) {

            var _grid = null;


            try {
                _grid = createGridClass('noname', {
                        style: 'width:800px',
                        options: utils.clone(types.DEFAULT_GRID_OPTIONS),
                        startup: function () {
                            this.inherited(arguments);
                        },
                        addUiClasses: true,
                        adjustRowIndices: function () {
                        },
                        _renderRow: function (obj) {
                            //return this.inherited(arguments);
                            console.log('render row');
                            return domConstruct.create('span', {
                                className: "fileGridCell",
                                innerHTML: '<span class=\"' + '' + '\""></span> <div class="name">' + obj.label + '</div>',
                                style: 'max-width:200px;float:left;margin:18px;padding:18px;'
                            });
                        }
                    },
                    {
                        SELECTION: true,
                        KEYBOARD_SELECTION: true,
                        PAGINATION: true,
                        COLUMN_HIDER: true,
                        GRID_ACTIONS:{
                            CLASS:GridActions,
                            IMPLEMENTATION:{},
                            CLASSES:null
                        }
                    },
                    null,
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

                var store = createStore();
                store.on('add', function () {
                    //console.warn('added', arguments);
                });


                store.on('update', function () {
                    console.warn('updated', arguments);
                });

                store.on('delete', function () {
                    console.warn('removed', arguments);
                });




                var grid = new _grid({
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

                grid.on("dgrid-select", function (data) {
                    console.log('on-dgrid-select');
                });

                grid.on("dgrid-deselect", function (data) {
                    console.log('on-dgrid-deselect');
                });



                function test() {

                    for (var i = 6; i < 10; i++) {
                        store.putSync({
                            id: 'id' + i,
                            label: 'test ' + i,
                            "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"

                        });
                    }

                    store.putSync({
                        id: 'id3',
                        label: 'test3',
                        "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg",
                        _render: function (obj) {

                            return domConstruct.create('span', {
                                className: "fileGridCell",
                                innerHTML: '<span class=\"' + '' + '\""></span> <div class="name">' + obj.label + '</div>',
                                style: 'max-width:200px;float:left;margin:18px;padding:18px;'
                            });
                        }

                    });


                    var item3 = store.getSync('id3');
                    //grid.select(item3);

                }


                function test2() {

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
                    var isToolbared = grid.hasFeature('TOOLBAR');
                    console.warn('has Toolbar ');



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
                }, 1000);

                setTimeout(function () {
                    test2();
                }, 2000);


            }

        }
    }

    /**
     *
     *
     * @type xgrid/Base
     */
    var defaultClass = createGridClass('xgrid/Base',
        {
            options: utils.clone(types.DEFAULT_GRID_OPTIONS)
        },
        //features
        {
            SELECTION: true,
            KEYBOARD_SELECTION: true,
            PAGINATION: false,
            COLUMN_HIDER: false
        },
        //bases, no modification
        null,
        {

        });


    defaultClass.createGridClass = createGridClass;

    //track defaults on module
    defaultClass.classFactory = classFactory;
    defaultClass.DEFAULT_GRID_FEATURES = types.DEFAULT_GRID_FEATURES;
    defaultClass.DEFAULT_GRID_BASES = DEFAULT_GRID_BASES;
    defaultClass.DEFAULT_GRID_OPTIONS = types.DEFAULT_GRID_OPTIONS;
    defaultClass.DEFAULT_GRID_OPTION_KEYS = types.DEFAULT_GRID_OPTION_KEYS;

    return defaultClass;

});