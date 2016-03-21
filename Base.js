/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'dojo/_base/lang',
    'dojo/on',
    'xdojo/has',
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
    'xgrid/MultiRenderer'

], function (declare, lang,on,has,domConstruct, types,
             xTypes,ObjectUtils,utils,factory,
             EventedMixin, OnDemandGrid,Defaults,Layout,Focus,
             ListRenderer,ThumbRenderer,TreeRenderer,
             //GridActions,
             Memory, Trackable,TreeMemory,ObservableStore,Model,
             miscUtil,
             MultiRenderer)
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

        _isHighlighting:false,
        _featureMap:{},
        getParent:function(){
            return this._parent;
        },
        get:function(what){
            var parent = this.getParent();

            if(what==='iconClass') {
                //docker:
                if (parent && parent.icon) {
                    return parent.icon();
                }
            }

            return this.inherited(arguments);
        },
        set:function(what,value){

            var parent = this.getParent();

            if(what==='iconClass'){
                //docker:
                if(parent && parent.icon){
                    parent.icon(value);
                    return true;
                }
            }
            if(what==='title' && value){
                if(parent && parent.title){
                    parent.title(value);
                }
            }
            if(what==='loading'){
                //docker:
                if(parent && parent.startLoading){
                    var icon = parent._options.icon;
                    if(value==true) {
                        parent.startLoading('', 0.5);
                        parent.icon('fa-spinner fa-spin');
                    }else{
                        parent.finishLoading();
                        parent.icon(icon);
                    }
                    return true;
                }
            }

            return this.inherited(arguments);
        },
        /**
         * Place holder
         * @param action
         * @returns {*}
         */
        runAction:function(action){

            if(action.command==types.ACTION.HEADER){
                this._setShowHeader(!this.showHeader);
            }
            return this.inherited(arguments);
        },
        highlight:function(highlight){

            var node = $(this.domNode.parentNode);

            if(highlight){

                //already highlighting
                if(this._isHighlighting){
                    return;
                }

                this._isHighlighting = true;
                node.addClass('highlight');
            }else{

                this._isHighlighting=false;
                node.removeClass('highlight');
            }

        },
        getState:function(state) {

            state = this.inherited(arguments) || {};
            state.showHeader = this.showHeader;
            return state;
        },
        postMixInProperties: function () {


            var state = this.state;
            if (state) {
                this.showHeader = state.showHeader;
            }

            return this.inherited(arguments);
        },
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
        onShow:function(){
            this._emit(types.EVENTS.ON_VIEW_SHOW,this);
            this.inherited(arguments);
        },
        isActive:function(testNode){
            return utils.isDescendant(this.domNode,testNode || document.activeElement);
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
            this._emit('destroy',this);
            this.inherited(arguments);
        },

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

            var result = [],
                self = this;
            var nodes = $(self.domNode).find('.dgrid-row');
            _.each(nodes,function(node){
                var _row = self.row(node);
                if(_row && _row.element){
                    result.push(_row[domNodes ? 'element' : 'data']);
                }
            });
  /*
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
*/
            if (filterFunction) {
                return result.filter(filterFunction);
            }
            return result;
        },
        _fixMobile: function (grid) {

            /*
            var doubleTap = function (speed, distance) {

                'use strict';

                // default dblclick speed to half sec (default for Windows & Mac OS X)
                speed = Math.abs(+speed) || 500;//ms
                // default dblclick distance to within 40x40 pixel area
                distance = Math.abs(+distance) || 40;//px

                // Date.now() polyfill
                var now = Date.now || function () {
                        return +new Date();
                    };

                var cancelEvent = function (e) {
                    e = (e || window.event);

                    if (e) {
                        if (e.preventDefault) {
                            e.stopPropagation();
                            e.preventDefault();
                        } else {
                            try {
                                e.cancelBubble = true;
                                e.returnValue = false;
                            } catch (ex) {
                                // IE6
                            }
                        }
                    }
                    return false;
                };

                var taps = 0,
                    last = 0,
                // NaN will always test false
                    x = NaN,
                    y = NaN;

                return function (e) {
                    e = (e || window.event);

                    var time = now(),
                        touch = e.changedTouches ? e.changedTouches[0] : e,
                        nextX = +touch.clientX,
                        nextY = +touch.clientY,
                        target = e.target || e.srcElement,
                        e2,
                        parent;

                    if ((last + speed) > time &&
                        Math.abs(nextX - x) < distance &&
                        Math.abs(nextY - y) < distance) {
                        // continue series
                        taps++;

                    } else {
                        // reset series if too slow or moved
                        taps = 1;
                    }

                    // update starting stats
                    last = time;
                    x = nextX;
                    y = nextY;

                    // fire tap event
                    if (document.createEvent) {
                        e2 = document.createEvent('MouseEvents');
                        e2.initMouseEvent(
                            'tap',
                            true,				// click bubbles
                            true,				// click cancelable
                            e.view,				// copy view
                            taps,				// click count
                            touch.screenX,		// copy coordinates
                            touch.screenY,
                            touch.clientX,
                            touch.clientY,
                            e.ctrlKey,			// copy key modifiers
                            e.altKey,
                            e.shiftKey,
                            e.metaKey,
                            e.button,			// copy button 0: left, 1: middle, 2: right
                            e.relatedTarget);	// copy relatedTarget

                        if (!target.dispatchEvent(e2)) {
                            // pass on cancel
                            cancelEvent(e);
                        }

                    } else {
                        e.detail = taps;

                        // manually bubble up
                        parent = target;
                        while (parent && !parent.tap && !parent.ontap) {
                            parent = parent.parentNode || parent.parent;
                        }
                        if (parent && parent.tap) {
                            // DOM Level 0
                            parent.tap(e);

                        } else if (parent && parent.ontap) {
                            // DOM Level 0, IE
                            parent.ontap(e);

                        } else if (typeof jQuery !== 'undefined') {
                            // cop out and patch IE6-8 with jQuery
                            jQuery(this).trigger('tap', e);
                        }
                    }

                    if (taps === 2) {
                        // fire dbltap event only for 2nd click
                        if (document.createEvent) {
                            e2 = document.createEvent('MouseEvents');
                            e2.initMouseEvent(
                                'dbltap',
                                true,				// dblclick bubbles
                                true,				// dblclick cancelable
                                e.view,				// copy view
                                taps,				// click count
                                touch.screenX,		// copy coordinates
                                touch.screenY,
                                touch.clientX,
                                touch.clientY,
                                e.ctrlKey,			// copy key modifiers
                                e.altKey,
                                e.shiftKey,
                                e.metaKey,
                                e.button,			// copy button 0: left, 1: middle, 2: right
                                e.relatedTarget);	// copy relatedTarget

                            if (!target.dispatchEvent(e2)) {
                                // pass on cancel
                                cancelEvent(e);
                            }

                        } else {
                            e.detail = taps;

                            // manually bubble up
                            parent = target;
                            while (parent && !parent.dbltap && !parent.ondbltap) {
                                parent = parent.parentNode || parent.parent;
                            }
                            if (parent && parent.dbltap) {
                                // DOM Level 0
                                parent.dbltap(e);

                            } else if (parent && parent.ondbltap) {
                                // DOM Level 0, IE
                                parent.ondbltap(e);

                            } else if (typeof jQuery !== 'undefined') {
                                // cop out and patch IE6-8 with jQuery
                                jQuery(this).trigger('dbltap', e);
                            }
                        }
                    }
                };
            };

            grid.domNode.addEventListener('touchend', doubleTap(), false);

            var thiz = this;
            grid.domNode.addEventListener('dbltap', function (evt) {
                //thiz.onMouseDoubleClickEvent(evt);
                console.log('double click!!!');
                on.emit(grid.domNode,'dblclick',evt);
                grid._emit('dblclick',evt);
            }, false);
            */


        },
        startup:function(){
            if(this._started){
                return;
            }
            this.inherited(arguments);

            if(has('phone')){
                //this._fixMobile(this);
            }


        }
    };
    /**
     * Create default class
     * @type {*}
     * @private
     */
    var _default = declare('xgrid.Default', null, Implementation);
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

            _isNewBaseClass = gridClasses && ('EVENTED' in gridClasses || 'GRID' in gridClasses || 'EDITOR' in gridClasses || 'RENDERER' in gridClasses || 'DEFAULTS' in gridClasses  || 'LAYOUT' in gridClasses || 'FOCUS' in gridClasses || 'i18' in gridClasses);

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

        var doTest = false;
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