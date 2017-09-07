/** @module xfile/FileGrid **/
define([
    "xdojo/declare",
    "dojo/dom-class",
    'dojo/Deferred',
    'xide/types',
    'xide/utils',
    'xide/views/History',
    'xaction/DefaultActions',
    'xfile/views/Grid',
    'xfile/factory/Store',
    'xide/model/Path',
    'xfile/model/File',
    'xlang/i18'
], function (declare, domClass, Deferred, types, utils, History,DefaultActions,Grid,factory,Path,File,il8){


    var ACTION = types.ACTION;

    
    var DEFAULT_PERMISSIONS = [
        ACTION.EDIT,
        ACTION.COPY,
        ACTION.CLOSE,
        ACTION.MOVE,
        ACTION.RENAME,
        ACTION.DOWNLOAD,
        ACTION.RELOAD,
        ACTION.DELETE,
        ACTION.NEW_FILE,
        ACTION.NEW_DIRECTORY,
        ACTION.CLIPBOARD,
        ACTION.LAYOUT,
        ACTION.COLUMNS,
        ACTION.SELECTION,
        ACTION.PREVIEW,
        ACTION.OPEN_IN,
        ACTION.GO_UP,
        ACTION.SEARCH,
        ACTION.OPEN_IN_TAB,
        ACTION.TOOLBAR,
        ACTION.STATUSBAR,
        ACTION.UPLOAD,
        ACTION.SOURCE,
        ACTION.SIZE_STATS,
        ACTION.CONSOLE,
        ACTION.HEADER,
        'File/Compress'
    ];
    var GridClass = declare('xfile.views.FileGrid', Grid, {
        resizeAfterStartup:true,
        menuOrder: {
            'File': 110,
            'Edit': 100,
            'View': 50,
            'Settings': 20,
            'Navigation': 10,
            'Window': 5
        },
        groupOrder: {
            'Clipboard': 110,
            'File': 100,
            'Step': 80,
            'Open': 70,
            'Organize': 60,
            'Insert': 10,
            'Navigation':5,
            'Select': 0
        },
        tabOrder: {
            'Home': 100,
            'View': 50,
            'Settings': 20,
            'Navigation':10
        },
        /**
         *
         */
        noDataMessage: '<span/>',

        /**
         * history {module:xide/views/History}
         */
        _history:null,
        options: utils.clone(types.DEFAULT_GRID_OPTIONS),
        _columns: {},
        toolbarInitiallyHidden:true,
        permissions: DEFAULT_PERMISSIONS,
        /**
         *
         * @param state
         * @returns {*}
         */
        setState:function(state){
            this.inherited(arguments);
            var self = this,
                collection = self.collection,
                path = state.store.path,
                item = collection.getSync(path),
                dfd = self.refresh();
            try {
                dfd.then(function () {
                    item = collection.getItem(path, true).then(function (item) {
                        self.openFolder(item);
                    });
                });
            }catch(e){
                console.error('error restoring folder state');
            }
            return dfd;
        },
        /**
         *
         * @returns {*|{dir, lang, textDir}|{dir, lang}}
         */
        postMixInProperties: function () {

            var state =this.state;

            if(state){

                if(state._columns){
                    this._columns = state._columns;
                }
            }

            if (!this.columns) {
                this.columns = this.getColumns();
            }

            if(!this.collection && this.state){

                var _store = this.state.store,
                    ctx = this.ctx,
                    store = factory.createFileStore(_store.mount,_store.storeOptions,ctx.config);
                this.collection = store.getDefaultCollection();
            }
            return this.inherited(arguments);
        },
        /**
         *
         * @param state
         * @returns {object}
         */
        getState:function(state) {
            state = this.inherited(arguments) || {};
            state.store = {
                mount:this.collection.mount,
                path:this.getCurrentFolder().path,
                storeOptions:this.collection.options
            };
            state._columns = {};
            _.each(this._columns,function(c){
                state._columns[c.label]= !this.isColumnHidden(c.id);
            },this);
            return state;
        },
        onSaveLayout:function(e){
            var customData = e.data,
                gridState = this.getState(),
                data = {
                    widget:this.declaredClass,
                    state:gridState
                };
            customData.widgets.push(data);
            return customData;
        },
        formatColumn: function (field, value, obj) {

            var renderer = this.selectedRenderer ? this.selectedRenderer.prototype : this;
            if (renderer.formatColumn) {
                var result = renderer.formatColumn.apply(arguments);
                if (result) {
                    return result;
                }
            }
            if(obj.renderColumn){
               var rendered = obj.renderColumn.apply(this,arguments);
                if(rendered){
                    return rendered;
                }

            }
            switch (field) {

                case "fileType":{
                    if(value=='folder'){
                        return il8.localize('kindFolder');
                    }else{
                        var mime = obj.mime.split('/')[1];
                        var key = 'kind' + mime.toUpperCase();
                        var _translated = il8.localize(key);
                        return key!==_translated ? _translated : value;
                    }
                }
                case "name":{

                    var directory = obj && obj.directory != null && obj.directory === true;
                    var no_access = obj.read === false && obj.write === false;
                    var isBack = obj.name == '..';
                    var folderClass = 'fa-folder';
                    var isLoading = obj.isLoading;

                    var icon = '';
                    var imageClass = '';
                    var useCSS = false;
                    if (directory) {
                        if (isBack) {
                            imageClass = 'fa fa-level-up itemFolderList';
                            useCSS = true;
                        } else if (!no_access) {
                            imageClass = 'fa ' + folderClass +' itemFolderList';

                            useCSS = true;
                        } else {
                            imageClass = 'fa fa-lock itemFolderList';
                            useCSS = true;
                        }
                    } else {
                        if (!no_access) {
                            imageClass = 'itemFolderList fa ' + utils.getIconClass(obj.path);
                            useCSS = true;
                        } else {
                            imageClass = 'fa fa-lock itemFolderList';
                            useCSS = true;
                        }
                    }
                    var label = obj.showPath === true ? obj.path : value;
                    if (!useCSS) {
                        return '<img class="fileGridIconCell" src="' + icon + ' "/><span class="fileGridNameCell">' + label + '</span>';
                    } else {
                        return '<span class=\"' + imageClass + '\""></span><span class="name fileGridNameNode" style="vertical-align: middle;padding-top: 0px">' + label + '</span>';
                    }
                }
                case "sizeBytes":
                {
                    return obj.size;
                }
                case "fileType":
                {
                    return utils.capitalize(obj.fileType || 'unknown');
                }
                case "mediaInfo":{
                    return obj.mediaInfo || 'unknown';
                }
                case "owner":
                {
                    if(obj) {
                        var owner = obj.owner;
                        if (owner && owner.user) {
                            return owner.user.name;
                        }
                    }
                    return ""
                }
                case "modified":
                {
                    if(value ===''){
                        return value;
                    }
                    var directory = !obj.directory;
                    var dateStr = '';
                    if (directory) {

                    } else {
                        var dateFormat = il8.translations.dateFormat;
                        if(dateFormat){
                            var res = il8.formatDate(value);
                            return res.replace('ms','');
                        }
                    }
                    return dateStr;
                }

            }
            return value;
        },
        getColumns: function () {

            var thiz = this;
            this.columns = [];

            function createColumn(label, field, sortable, hidden) {

                if (thiz._columns[label] != null) {
                    hidden = !thiz._columns[label];
                }
                thiz.columns.push({
                    renderExpando: label === 'Name',
                    label: label,
                    field: field,
                    sortable: sortable,
                    formatter: function (value, obj) {
                        return thiz.formatColumn(field, value, obj);
                    },
                    hidden: hidden
                });
            }
            createColumn('Name', 'name', true, false);
            createColumn('Type', 'fileType', true, true);
            createColumn('Path', 'path', true, true);
            createColumn('Size', 'sizeBytes', true, false);
            createColumn('Modified', 'modified', true, false);
            createColumn('Owner', 'owner', true, true);
            createColumn('Media', 'mediaInfo', true, true);
            return this.columns;
        },
        _focus:function(){
            var thiz = this,
                rows = thiz.getRows();
            if(rows[0]){
                var _row = thiz.row(rows[0]);
                thiz.focus(_row.data);
            }
        },
        setQueryEx: function (item, settings) {
            settings = settings || {
                focus: true,
                delay:1
            };
            if (!item) {
                console.error('bad, no item!');
                return false;
            }

            if (!item.directory) {
                return false;
            }

            this._lastPath = item.getPath();
            var thiz = this,
                grid = thiz,
                dfd = new Deferred();

            if (!grid) {
                console.error('have no grid');
                return;
            }
            var col = thiz.collection,
                focusNext;

            if (item.path === '.') {
                col.resetQueryLog();
                grid.set("collection", col.getDefaultCollection(item.getPath()));
                if(dfd.resolve){
                    dfd.resolve();
                }
            } else {
                col.open(item).then(function (items) {
                    col.resetQueryLog();
                    grid.set("collection", col.getDefaultCollection(item.getPath()));

                    if(dfd.resolve) {
                        dfd.resolve(items);
                    }
                });
            }
            return dfd;
        },
        getCurrentFolder:function(){

            var renderer = this.getSelectedRenderer();
            if(renderer && renderer.getCurrentFolder){
                var _result = renderer.getCurrentFolder.apply(this);
                if(_result){
                    if(_result.isBack){
                        var __result = this.collection.getSync(_result.rPath);
                        if(__result){
                            _result = __result;
                        }
                    }
                    return _result;
                }
            }
            var item = this.getRows()[0];
            if(item && (item._S || item._store)) {
                if(item.isBack==true){
                    var _now = this.getHistory().getNow();
                    if(_now){
                        return this.collection.getSync(_now);
                    }
                }
                //current folder:
                var _parent = item._S.getParent(item);
                if(_parent){
                    return _parent;
                }
            }
            return null;
        },

        getClass:function(){
            return GridClass;
        },
        getHistory:function(){
            if(!this._history){
                this._history = new History();
            }
            return this._history;
        },
        startup: function () {
            if (this._started) {
                return;
            }
            var res  = this.inherited(arguments);
            domClass.add(this.domNode, 'xfileGrid');
            this.set('loading',true);
            if (this.permissions) {
                var _defaultActions = DefaultActions.getDefaultActions(this.permissions, this,this);
                _defaultActions = _defaultActions.concat(this.getFileActions(this.permissions));
                this.addActions(_defaultActions);
            }
            this._history = new History();
            var self = this;

            self._on('noData',function(){

                var _rows = self.getRows();
                if(self._total>0){
                    return;
                }
                var _history = self._history,
                    now = _history.getNow();

                self.renderArray([
                    {
                        name: '..',
                        path:'..',
                        rPath:now,
                        sizeBytes:0,
                        size:'',
                        icon:'fa-level-up',
                        isBack:true,
                        modified:'',
                        _S:self.collection,
                        directory:true,
                        _EX:true,
                        children:[],
                        mayHaveChildren:false
                    }
                ]);
            });
            this._on('openFolder',function(evt){

                var isBack = evt.back,
                    item = evt.item,
                    path = item.path,
                    history = self._history;

                self.set('title',item.name);
                function toHistory(item){
                    var FolderPath = item.getFolder ?  new Path(item.getFolder()) : new Path('.');
                    var segs = FolderPath.getSegments();
                    var _last = '.';
                    var out = ['.'];
                    _.each(segs,function(seg){
                        var segPath = _last + '/' + seg;
                        out.push(segPath);
                        _last = segPath;
                    });
                    return out;
                }
            });

            //initiate
            if(self.selectedRenderer) {
                res = this.refresh();
                res.then(function () {
                    self.set('loading',false);
                    self.setRenderer(self.selectedRenderer,false);
                });
            }
            this._on('onChangeRenderer',function(){
                self.refresh();
            });
            setTimeout(function(){
                self.resize();
            },500);
            return res;
        }
    });
    /**
     *
     * @param ctx
     * @param args
     * @param parent
     * @param register
     * @param startup
     * @param store
     * @returns {widgetProto}
     */
    function createDefault(ctx,args,parent,register,startup,store) {

        args = utils.mixin({
            collection: store.getDefaultCollection(),
            _parent: parent,
            Module:GridClass,
            ctx:ctx
        }, args || {});

        var grid = utils.addWidget(GridClass, args, null, parent, startup, null, null, true, null);
        if (register) {
            ctx.getWindowManager().registerView(grid,false);
        }
        return grid;
    }

    GridClass.prototype.Module = GridClass;
    GridClass.createDefault = createDefault;
    GridClass.DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS;

    return GridClass;

});