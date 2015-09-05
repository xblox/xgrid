/** @module xgrid/Search **/
define([
    'xdojo/declare',
    'xide/widgets/_Search',
    'dojo/on',
    'xide/Keyboard',
    'xide/types',
    'xide/action/DefaultActions'
], function (declare,Search,on,Keyboard,types,DefaultActions) {
    /**
     * @class module:xGrid/Search
     * */
    return declare('xgrid/Search', null,{
        _searchText:null,
        _search:null,
        runAction:function(action){

            if(action.command==types.ACTION.SEARCH){
                if(this._search) {
                    this._search.show('', false);
                }
            }
            return this.inherited(arguments);
        },
        buildRendering: function () {

            this.inherited(arguments);

            var grid = this,
                node = grid.domNode.parentNode;

            var search = new Search({});
            search.find = function(){
                grid._searchText = this.searchInput.value;
                grid.set("collection", grid.collection);
            };

            search.showSearchBox(node);
            search.show('',false);
            search.hide();

            this._search = search;

            on(search.searchInput,'keydown',function(e){
                if(e.code ==='Escape'){
                    search.hide();
                    grid.focus();
                }
            });

            var mapping = Keyboard.defaultMapping(['ctrl f'], function(){
                search.show('',false);
            }, types.KEYBOARD_PROFILE.DEFAULT, grid.domNode, grid,null);

            this.registerKeyboardMapping(mapping);

            this._on('onAddActions',function(evt){

                var actions = evt.actions,
                    permissions = evt.permissions;

                var _action = grid.createAction('Search',types.ACTION.SEARCH,types.ACTION_ICON.SEARCH,['ctrl f'],'Home','File','item|view',null,null,null,null,null,permissions,node,grid);
                if(!_action){
                    return;
                }
                actions.push(_action);

            });
        },
        _setCollection: function (collection) {

            this.inherited(arguments);
            var value = this._searchText;
            var renderedCollection = this._renderedCollection;
            if (renderedCollection && value) {
                var rootFilter = new renderedCollection.Filter();
                var re = new RegExp(value, "i");
                var columns = this.columns;
                var matchFilters = [];
                for (var p in columns) {
                    if (columns.hasOwnProperty(p)) {
                        matchFilters.push(rootFilter.match(columns[p].field, re));
                    }
                }
                var combined = rootFilter.or.apply(rootFilter, matchFilters);
                this._renderedCollection = renderedCollection.filter(combined);
                this.refresh();
            }
        }
    });
});
