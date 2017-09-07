/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'dojo/_base/lang',
    'dojo/dom-construct',
    'xide/types',
    'xide/utils',
    './ListRenderer',
    './ThumbRenderer',
    './TreeRenderer',
    'dstore/Trackable',
    'xide/data/TreeMemory',
    'xide/data/ObservableStore',
    'xide/data/Model',
    'xgrid/MultiRenderer',
    'xide/tests/TestUtils',
    'module'

], function (declare, lang, domConstruct, types,
             utils,ListRenderer,ThumbRenderer,TreeRenderer,
             Trackable,TreeMemory,ObservableStore,Model,
             MultiRenderer,
             TestUtils,module)
{

    
    /**
     *
     * @param name
     * @param bases
     * @param extraClasses
     * @param implementation
     * @returns {*}
     */
    function classFactory(name, bases, extraClasses,implementation) {
        return declare.classFactory(name, bases, extraClasses, implementation,types.GRID_BASES);
    }
    /**
     * Default implementation
     @class module:xgrid/Base
     */
    var Implementation = {
        renderArray:function(array){
            this._lastData = array;
            return this.inherited(arguments);
        },
        getData:function(){
            return this._lastData;
        },
        refreshItem:function(item,silent){

            var args = {
                target: item
            };
            if (silent) {
                this._muteSelectionEvents = true;
            }

            this.collection.emit('update', args);

            if (silent) {
                this._muteSelectionEvents = false;
            }
        },
        startup:function(){
            this.inherited(arguments);
            var thiz = this;
            $(thiz.domNode).addClass('widget');
            setTimeout(() => {
                thiz.resize();
            },100);
        },
        onShow:function(){
            this._emit(types.EVENTS.ON_VIEW_SHOW,this);
            this.inherited(arguments);
        },
        isActive:function(){
            return utils.isDescendant(this.domNode,document.activeElement);
        },
        _showHeader:function(show){
            $(this.domNode).find('.dgrid-header').each((i, el) => {
                $(el).css('display',show ? '' : 'none' );
            });

            $(this.domNode).find('.dgrid-scroller').each((i, el) => {
                $(el).css('margin-top',show ? 26 : 0 );
            });
        },
        destroy:function(){
            this._emit('destroy',this);
            this.inherited(arguments);
        },
        _featureMap:{},
        /**
         *
         * @param name
         * @returns {*}
         */
        hasFeature:function(name){
            for(var name  in this._featureMap){
                if(this._featureMap[name]){
                    return this._featureMap[name];
                }
            }
            return null;
        },
        /**
         *
         * @param domNodes
         * @param filterFunction
         * @returns {*}
         */
        getRows:function(domNodes,filterFunction){

            var result = [];
            if(this._lastRenderedArray) {
                this._lastRenderedArray.forEach(function (row) {
                    var _row = this.row(row);
                    if (_row) {
                        result.push(_row[domNodes ? 'element' : 'data']);
                    } else {
                        console.warn('orphan row detected', _row);
                    }
                }, this);
            }

            if (filterFunction) {
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
    var _default = declare('xgrid.Default',null , Implementation);
    /**
     * Grid class factory
     * @param name {string} A name for the class created
     * @param implementation {object} the actual implementation
     * @param features {object} the feature map override
     * @param gridClasses {object} the base grid classes map override
     * @param args {object} extra args
     * @memberOf module:xgrid/Base
     * @returns {module:xgrid/Base}
     */
    function createGridClass(name, implementation, features, gridClasses, args,bases) {

        console.clear();

        var _isNewBaseClass = false;

        implementation = implementation || _default;


        //simple case, no base class and no features
        if (!implementation && !features) {
            return _default;
        }

        if (implementation) {

            _isNewBaseClass = gridClasses && ('EVENTED' in gridClasses || 'GRID' in gridClasses || 'EDITOR' in gridClasses || 'RENDERER' in gridClasses || 'DEFAULTS' in gridClasses  || 'LAYOUT' in gridClasses || 'FOCUS' in gridClasses);

            var defaultBases = utils.cloneKeys(bases || types.GRID_BASES);
            if (_isNewBaseClass) {

                lang.mixin(defaultBases, gridClasses);

                var extras = [];

                for (var i in defaultBases) {

                    if (defaultBases[i] === null || defaultBases[i] === undefined || defaultBases[i] === false) {
                        // test[i] === undefined is probably not very useful here
                        delete defaultBases[i];
                    }
                }
                implementation = classFactory(name, defaultBases, [_default], implementation);

            } else {
                implementation = classFactory(name, defaultBases, [_default], implementation);
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
        if (implementation && features) {

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
                    //var featureClass = classFactory(featureName, newFeature['CLASSES'] || [], [newFeature['CLASS']], newFeature['IMPLEMENTATION']);

                    var featureClass = newFeature['CLASS'];
                    newFeatures.push(featureClass);

                    featureMap[featureName]=featureClass;


                }


            }





            //recompose
            if (newFeatures.length > 0) {
                //implementation = classFactory(name, [implementation], newFeatures, args);
                var _bases = [implementation].concat(newFeatures);
                //implementation = classFactory(name, [implementation], newFeatures, args);
                _.each(newFeatures,c => {
                   console.log('f:'+ c.prototype.declaredClass);
                });



                implementation = declare(name, _bases,args);
            }

            //complete
            implementation.prototype._featureMap = featureMap;
        }

        return implementation;
    }
    /***
     * playground
     */
    var _last = window._last;
    var ctx = window.sctx,
        parent;

    function createStore() {

        var storeClass = declare.classFactory('driverStore',[TreeMemory,Trackable,ObservableStore]);
        var MyModel = declare(Model, {});

        var store = new storeClass({
            idProperty: 'id',
            Model: MyModel,
            observedProperties:[
                "label"
            ],
            data: [
                {
                    id: 'id1',
                    label: 'test1',
                    parentId:'',
                    "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0306.jpg"
                },
                {
                    id: 'id2',
                    label: 'test2',
                    parentId:'id1',
                    "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"
                },
                {
                    id: 'id5',
                    label: 'test5',
                    parentId:'id1',
                    "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"
                },
                {
                    id: 'id4',
                    label: 'test4',
                    parentId:'',
                    "url": null,
                    "items":[
                        {test:2,test3:4}
                    ]
                }

            ]
        });

        return store;
    }

    if (ctx) {
        var doTest = true;
        if(doTest) {

            var renderers = [ListRenderer,ThumbRenderer,TreeRenderer];

            var multiRenderer = declare.classFactory('multiRenderer',{},renderers,MultiRenderer.Implementation);

            var _grid = null;
            _grid = createGridClass(
                /**
                 *  NAME
                 */
                'noname',
                /**
                 * IMPLEMENTATION
                 */
                {
                    style: 'width:800px'
                },

                /**
                 * FEATURES
                 */
                {
                    SELECTION: true,
                    KEYBOARD_SELECTION: true,
                    COLUMN_HIDER:false,
                    COLUMN_RESIZER:false,
                    COLUMN_REORDER:false,
                    ACTIONS:types.GRID_FEATURES.ACTIONS
                },
                /**
                 *
                 */
                {
                    //RENDERER:multiRenderer
                },
                {
                    //renderers: renderers,
                    //selectedRenderer: TreeRenderer
                });

            var mainView = ctx.mainView;
            if (mainView) {

                var docker = mainView.getDocker();

                parent = TestUtils.createTab(null,null,module.id);
                var store = createStore();
                var actions = [],
                    thiz = this,
                    ACTION_TYPE = types.ACTION,
                    ACTION_ICON = types.ACTION_ICON,
                    grid;

                var _c = declare('a',null,{});

                _grid = declare('grid',_grid,{});

                grid = new _grid({
                    collection: store.filter({
                        parentId:''
                    }),
                    showHeader:true,
                    options: utils.clone(types.DEFAULT_GRID_OPTIONS),
                    columns: [
                        {
                            renderExpando: true,
                            label: "Name",
                            field: "label",
                            sortable: true

                            //hidden:true
                        },
                        {
                            label: "Url",
                            field: "url",
                            hidden:false,
                            sortable: false,
                            icon:'fa-cube',
                            minWidth:300
                        }
                    ]
                }, parent.containerNode);

                grid.startup();

                function test() {
                    return;
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

                }
                function test2() {

                    return;

                    console.log('-------------------------------------------------------------------------');

                    var item = store.getSync('id3');
                    var item1 = store.getSync('id1');
                    var item2 = store.getSync('id2');
                    grid.select([item1, item2], null, true, {
                        append: true,
                        focus: false,
                        silent: true

                    });
                    var item99 = store.getSync('id99');
                    var item98 = store.getSync('id98');
                    grid.select([item99, item98], null, true, {
                        append: true,
                        focus: true,
                        silent: false
                    });

                }

                setTimeout(() => {
                    test();
                }, 1000);

                setTimeout(() => {
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
    defaultClass.DEFAULT_GRID_BASES = types.GRID_BASES;
    defaultClass.DEFAULT_GRID_OPTIONS = types.DEFAULT_GRID_OPTIONS;
    defaultClass.DEFAULT_GRID_OPTION_KEYS = types.DEFAULT_GRID_OPTION_KEYS;

    return defaultClass;

});