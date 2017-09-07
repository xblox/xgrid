/** @module xgrid/Grid **/
define([
    'dojo/_base/declare',
    'xide/types',
    './Base'
],function (declare,types,Base) {
    /**
     *
     * Please read {@link module:xgrid/types}
     *
     * @class module:xgrid/Grid
     * @augments module:xgrid/Base
     */
    var grid = declare('xgrid/Grid',Base,{});

    grid.createGridClass = Base.createGridClass;

    //track defaults on module
    grid.classFactory = Base.classFactory;
    grid.DEFAULT_GRID_FEATURES = types.DEFAULT_GRID_FEATURES;
    grid.DEFAULT_GRID_BASES = Base.DEFAULT_GRID_BASES;
    grid.DEFAULT_GRID_OPTIONS = types.DEFAULT_GRID_OPTIONS;
    grid.DEFAULT_GRID_OPTION_KEYS = types.DEFAULT_GRID_OPTION_KEYS;

    return grid;
});