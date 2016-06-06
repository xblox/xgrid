/** @module xgrid/Base **/
define([
    "xdojo/declare",
    'xdojo/has',
    'xide/types',
    'xgrid/types',
    'xide/utils/ObjectUtils',   //possibly not loaded yet
    'xide/utils',
    'xide/factory',
    'dgrid/OnDemandGrid',
    'xgrid/Defaults',
    'xgrid/Layout',
    'xgrid/Focus',
    'xgrid/ListRenderer',
    'xgrid/ThumbRenderer',
    'xgrid/TreeRenderer',
    'dgrid/util/misc'

], function (declare,has,types,
             xTypes,ObjectUtils,utils,factory,
             OnDemandGrid,Defaults,Layout,Focus,
             ListRenderer,ThumbRenderer,TreeRenderer,
             miscUtil){

    var BASE_CLASSES = ['EVENTED','GRID','EDITOR','RENDERER','DEFAULTS','LAYOUT','FOCUS','i18'];
    var DEFAULT_GRID_FEATURES = types.DEFAULT_GRID_FEATURES;
    var GRID_BASES = types.GRID_BASES;
    var DEFAULT_GRID_OPTIONS = types.DEFAULT_GRID_OPTIONS;

    /**
     * Short hand version of declare.classFactory for our base grid
     * @param name
     * @param bases
     * @param extraClasses
     * @param implementation
     * @private
     * @returns {*}
     */
    function classFactory(name, bases, extraClasses,implmentation) {
        return declare.classFactory(name, bases, extraClasses, implmentation,GRID_BASES);
    }
    /**
     * Default implementation
     * @class module:xgrid/Base
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
        runAction:function(action){
            if(action.command==types.ACTION.HEADER){
                this._setShowHeader(!this.showHeader);
            }
            return this.inherited(arguments);
        },
        highlight:function(highlight){
            var node = $(this.domNode.parentNode);
            if(highlight){
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
            if (silent) {
                this._muteSelectionEvents = true;
            }
            this.collection.emit('update', {
                target: item
            });
            if (silent) {
                this._muteSelectionEvents = false;
            }
        },
        onShow:function(){
            this._emit(types.EVENTS.ON_VIEW_SHOW,this);
            return this.inherited(arguments);
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
            return this.inherited(arguments);
        },
        hasFeature:function(name){
            return _contains(['name'],_.keys(this._featureMap));
        },
        /**
         * Return current row's elements or data
         * @param domNodes {boolean} return dom instead of data. Default false.
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
            if (filterFunction) {
                return result.filter(filterFunction);
            }
            return result;
        }
    };
    /**
     * Create root class with declare and default implementation
     */
    var _default = declare('xgrid.Default', null, Implementation);

    /**
     * 2-dim array search
     * @param left {string[]}
     * @param keys {string[]}
     * @returns {boolean}
     * @private
     */
    function _contains(left, keys) {
        return keys.some(function (v) {
            return left.indexOf(v) >= 0;
        });
    }

    /**
     * Find default keys in a feature struct and recompse user feature
     * @param feature {object} feature struct
     * @param defaultFeature {object}
     * @returns {object} recomposed feature
     */
    function getFeature(feature, defaultFeature) {
        //is new feature, return the mix of default props and customized version
        if (_contains(['CLASS','CLASSES','IMPLEMENTATION'],_.keys(feature))) {
            return utils.mixin(utils.cloneKeys(defaultFeature),feature);
        }
        return defaultFeature;
    }

    /**
     * Grid class factory
     * @param name {string} A name for the class created
     * @param baseClass {object} the actual implementation (default root class, declared above)
     * @param features {object} the feature map override
     * @param bases {object} the base grid classes map override
     * @param args {object} root class override
     * @param _defaultBases {object}
     * @memberOf module:xgrid/Base
     * @returns {module:xgrid/Base}
     */
    function createGridClass(name, baseClass, features, gridClasses, args,_defaultBases) {
        var _isNewBaseClass = false;
        baseClass = baseClass || _default;
        //simple case, no base class and no features
        if (!baseClass && !features) {
            return _default;
        }
        if (baseClass) {
            _isNewBaseClass = _contains(BASE_CLASSES,_.keys(gridClasses));
            var defaultBases = utils.cloneKeys(_defaultBases || GRID_BASES);
            if (_isNewBaseClass) {
                utils.mixin(defaultBases, gridClasses);
                //remove empty
                defaultBases = _.pick(defaultBases, _.identity);
            }
            //recompose base class
            baseClass = classFactory(name, defaultBases, [_default], baseClass);
        }

        var newFeatures = [],
            featureMap = {};

        //case: base class and features
        if (baseClass && features) {
            var _defaultFeatures = utils.cloneKeys(DEFAULT_GRID_FEATURES);
            utils.mixin(_defaultFeatures, features);

            for (var featureName in _defaultFeatures) {
                var feature = _defaultFeatures[featureName];
                if (!_defaultFeatures[featureName]) {
                    continue;
                }
                var newFeature = null;
                if (feature === true) {
                    //is a base feature
                    newFeature = DEFAULT_GRID_FEATURES[featureName];
                } else if (DEFAULT_GRID_FEATURES[featureName]) {
                    //is new/extra feature
                    newFeature = getFeature(feature, DEFAULT_GRID_FEATURES[featureName]);
                } else {
                    //go on
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


    var Module = createGridClass('xgrid/Base',{
            options: utils.clone(DEFAULT_GRID_OPTIONS)
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

    Module.createGridClass = createGridClass;

    //track defaults on module
    Module.classFactory = classFactory;
    Module.DEFAULT_GRID_FEATURES = DEFAULT_GRID_FEATURES;
    Module.DEFAULT_GRID_BASES = GRID_BASES;
    Module.DEFAULT_GRID_OPTIONS = DEFAULT_GRID_OPTIONS;
    Module.DEFAULT_GRID_OPTION_KEYS = types.DEFAULT_GRID_OPTION_KEYS;

    return Module;

});