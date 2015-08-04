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
    'dstore/Memory',

    'dstore/Trackable',
    'xide/data/TreeMemory',
    './data/ObservableStore',
    'xide/data/Model',
    'dgrid/util/misc',
    'dijit/CheckedMenuItem',
    'xgrid/MultiRenderer'

], function (declare, lang, domConstruct, types,
             xTypes,ObjectUtils,utils,factory,
             EventedMixin, OnDemandGrid,Defaults,Layout,Focus,
             ListRenderer,ThumbRenderer,TreeRenderer,
             //GridActions,
             Memory, Trackable,TreeMemory,ObservableStore,Model,
             miscUtil,
             CheckedMenuItem,MultiRenderer)
{

    /**
     *
     * @param name
     * @param bases
     * @param extraClasses
     * @param implementation
     * @returns {*}
     */
    function classFactory(name, bases, extraClasses,implmentation) {
        return declare.classFactory(name, bases, extraClasses, implmentation,types.GRID_BASES);
    }
    /**
     * Default implementation
     @class module:xgrid/Base
     */
    var Implementation = {
        startup:function(){
            this.inherited(arguments);
        },
        onShow:function(){
            this._emit(types.EVENTS.ON_VIEW_SHOW,this);
            this.inherited(arguments);
        },
        isActive:function(){
            return utils.isDescendant(this.domNode,document.activeElement);
        },
        _showHeader:function(show){
            $(this.domNode).find('.dgrid-header').each(function(i,el){
                $(el).css('display',show ? '' : 'none' );
            });

            $(this.domNode).find('.dgrid-scroller').each(function(i,el){
                $(el).css('margin-top',show ? 26 : 0 );
            });
        },
        destroy:function(){
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
            this._lastRenderedArray.forEach(function (row) {
                var _row = this.row(row);
                if(_row) {
                    result.push(_row[domNodes ? 'element' : 'data']);
                }else{
                    console.warn('orphan row detected',_row);
                }
            }, this);

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
    function createGridClass(name, baseClass, features, gridClasses, args,bases) {


        var _isNewBaseClass = false;

        baseClass = baseClass || _default;

        //simple case, no base class and no features
        if (!baseClass && !features) {
            return _default;
        }

        if (baseClass) {
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

        //var storeClass = classFactory('myStore', [TreeMemory, Trackable,ObservableStore]);
        var storeClass = declare.classFactory('driverStore',[TreeMemory,Trackable,ObservableStore]);
        var MyModel = declare(Model, {});

        //var storeClass = declare.classFactory('driverStore',[TreeMemory,Trackable,ObservableStore],[],{});
/*
        var block = new xblox.model.events.OnKey({
            id:'block',
            parentId:'id1',
            items:[{
                asdfasdf:2
            }]
        });

        var block2 = new xblox.model.events.OnKey({
            id:'block2',
            parentId:'id1',
            items:[
                block
            ]
        });

        */



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

        //var p = store.getSync('block2');


        return store;
    }
    if (ctx) {

        var doTest = true;
        if(doTest) {


            /*
            var driverManager = ctx.getDriverManager();

            var _s = driverManager.getStore();

            var _i = _s.getSync('Marantz');

            _i.set('name','m122');
            */

            var renderers = [ListRenderer,ThumbRenderer,TreeRenderer],
                multiRenderer = declare.classFactory('multiRenderer',{},renderers,MultiRenderer.Implementation);

            var _grid = null;
            try {
                _grid = createGridClass('noname', {
                        style: 'width:800px'
                        /*adjustRowIndices: function () {}*/
                    },
                    {
                        SELECTION: true,
                        KEYBOARD_SELECTION: true,
                        PAGINATION: true,
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
                        renderers: renderers,
                        selectedRenderer: TreeRenderer
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
                /*
                store.on('add', function () {
                    console.warn('added', arguments);
                });
                store.on('update', function () {
                    console.warn('updated', arguments);
                });
                store.on('delete', function () {
                    console.warn('removed', arguments);
                });
*/
                var actions = [],
                    thiz = this,
                    /*container = this.domNode,*/
                    ACTION_TYPE = types.ACTION,
                    ACTION_ICON = types.ACTION_ICON,
                    grid;


                actions.push(_ActionMixin.createActionParameters('Edit', ACTION_TYPE.EDIT, 'edit', types.ACTION_ICON.EDIT, function () {

                }, 'Enter | F4', ['f4', 'enter'], null, thiz, thiz,{
                    filterGroup:"item"
                }));


                grid = new _grid({
                    shouldShowAction: function (action) {
                        return true;
                    },
                    actions:actions,
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
                }, _last.containerNode);
                grid.startup();
                grid.onContainerClick();

                var rendererActions = grid.getColumnHiderActions();
                var columnActions = grid.getColumnHiderActions();

                var _actions = grid.addActions(columnActions);
                //console.dir(_actions);
                var toolbar = grid.getToolbar();

                //action store test;
                _actions = grid.getActions({filterGroup:"item|view"});
                _actions[1].set('value',false);

                toolbar.setItemActions({},_actions,grid);
                console.dir(grid.getActions({
                    filterGroup:"item|view"
                }));


                function test() {

/*
                    for (var i = 6; i < 10; i++) {
                        store.putSync({
                            id: 'id' + i,
                            label: 'test ' + i,
                            "url": "http%3A%2F%2Fmc007ibi.dyndns.org%2Fwordpress%2Fwp-content%2Fuploads%2F2014%2F10%2FIMG_0445.jpg"

                        });
                    }*/

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
/*
                    var item = store.getSync('id1');
                    item.set('label', 'new label');*/
                    //grid.select(item3);

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
    defaultClass.DEFAULT_GRID_BASES = types.GRID_BASES;
    defaultClass.DEFAULT_GRID_OPTIONS = types.DEFAULT_GRID_OPTIONS;
    defaultClass.DEFAULT_GRID_OPTION_KEYS = types.DEFAULT_GRID_OPTION_KEYS;

    return defaultClass;

});