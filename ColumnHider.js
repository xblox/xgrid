define([
	'xdojo/declare',
	'dojo/dom-construct',
	'dojo/has',
	'dojo/on',
	'dgrid/util/misc',
    'xide/views/_ActionMixin',
    'dijit/CheckedMenuItem',
    'xide/types'
	/*'dojo/i18n!dgrid/nls/columnHider'*/
], function (declare, domConstruct, has, listen, miscUtil,_ActionMixin,CheckedMenuItem,types) {
    /*
     *	Column Hider plugin for dgrid
     *	Originally contributed by TRT 2011-09-28
     *
     *	A dGrid plugin that attaches a menu to a dgrid, along with a way of opening it,
     *	that will allow you to show and hide columns.  A few caveats:
     *
     *	1. Menu placement is entirely based on CSS definitions.
     *	2. If you want columns initially hidden, you must add "hidden: true" to your
     *		column definition.
     *	3. This implementation does NOT support ColumnSet, and has not been tested
     *		with multi-subrow records.
     *	4. Column show/hide is controlled via straight up HTML checkboxes.  If you
     *		are looking for something more fancy, you'll probably need to use this
     *		definition as a template to write your own plugin.
     *
     */

	var activeGrid, // references grid for which the menu is currently open
		bodyListener; // references pausable event handler for body mousedown

	function getColumnIdFromCheckbox(cb, grid) {
		// Given one of the checkboxes from the hider menu,
		// return the id of the corresponding column.
		// (e.g. gridIDhere-hider-menu-check-colIDhere -> colIDhere)
		return cb.id.substr(grid.id.length + 18);
	}

	return declare('xgrid.ColumnHider',null, {

        columnHiderActionRootCommand:'View/Columns',

		// i18nColumnHider: Object
		//		This object contains all of the internationalized strings for
		//		the ColumnHider extension as key/value pairs.
		i18nColumnHider: {},

		// _columnHiderRules: Object
		//		Hash containing handles returned from addCssRule.
		_columnHiderRules: null,
        /**
         *
         * @param actions
         */
		getColumnHiderActions:function(actions){

            var root = this.columnHiderActionRootCommand,
                thiz = this,
                columnActions = [],
                _actions = actions || [],
                rootAction = _.find(_actions,{
                    command:root
                });

            if(!rootAction) {

                columnActions.push(_ActionMixin.createActionParameters('Columns', root, 'Columns', 'fa-columns', function () {

                }, '', null, null, thiz, thiz, {
                    dummy: true,
                    filterGroup:"item|view",
                    tab:'View',
                    onCreate:function(action){
                        action.setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR, {
                            widgetArgs:{
                                style:"float:right"
                            }
                        });
                    }
                }));
            }
            /**
             *
             * @param col
             * @private
             */
            function _createEntry(col) {

                var id = col.id,
                    label = 'Show ' + ( col.label || col.field || ''),
                    icon = col.icon || 'fa-cogs';

                if (col.hidden) {
                    // Hide the column (reset first to avoid short-circuiting logic)
                    col.hidden = false;
                    thiz._hideColumn(id);
                    col.hidden = true;
                }

                // Allow cols to opt out of the hider (e.g. for selector column).
                if (col.unhidable) {
                    return;
                }

                columnActions.push(_ActionMixin.createActionParameters(label, root + '/' + label, 'Columns', icon, function () {

                }, '', null, null, thiz, thiz, {
                    column:col,
                    filterGroup:"item|view",
                    tab:'View',
                    onCreate:function(action){

                        var _visibilityMixin = {
                            widgetClass:declare.classFactory('_Checked', [CheckedMenuItem], null, {
                                startup:function(){
                                    this.inherited(arguments);
                                    this.on('change',function(val){
                                        thiz.showColumn(id,val);
                                    })
                                }
                            },null),
                            widgetArgs:{
                                checked:!col.hidden,
                                iconClass:icon
                            }
                        };
                        action.setVisibility(types.ACTION_VISIBILITY.ACTION_TOOLBAR,_visibilityMixin);
                        action.setVisibility(types.ACTION_VISIBILITY.CONTEXT_MENU,_visibilityMixin);
                        action.setVisibility(types.ACTION_VISIBILITY.MAIN_MENU,_visibilityMixin);

                    }
                }));

            }


            var subRows = this.subRows,
                first = true,
                srLength, cLength, sr, c;

            for (sr = 0, srLength = subRows.length; sr < srLength; sr++) {
                for (c = 0, cLength = subRows[sr].length; c < cLength; c++) {
                    _createEntry(subRows[sr][c]);
                    if (first) {
                        first = false;
                    }
                }
            }

            /*
            columnActions.forEach(function(action){
                actions.push(action);
            });*/
            return columnActions;

        },
        resize:function(){

            this.inherited(arguments);
            this._checkHiddenColumns();



        },
        _checkHiddenColumns:function(){

            var subRows = this.subRows,
                first = true,
                srLength, cLength, sr, c,
                totalWidth = $(this.domNode).width();

            for (sr = 0, srLength = subRows.length; sr < srLength; sr++) {
                for (c = 0, cLength = subRows[sr].length; c < cLength; c++) {

                    var col = subRows[sr][c];

                    if(col.minWidth){
                        if(totalWidth < col.minWidth){
                            if(col.unhidable) {
                            }else{
                                this.showColumn(col.id,false);
                            }
                        }else{
                            this.showColumn(col.id,true);
                        }
                    }

                }
            }
        },
        startup:function(){


            if(this._started){
                return;
            }

            this._columnHiderCheckboxes = {};
            this._columnHiderRules = {};

            /*
            this._on('onAddGridActions',function(evt){
                this.getColumnHiderActions(evt.actions)
                    .forEach(function(action){
                    evt.actions.push(action);
                });
            }.bind(this));
            */

            this.inherited(arguments);

            this._checkHiddenColumns();
        },
		left: function (cell, steps) {
			return this.right(cell, -steps);
		},
		right: function (cell, steps) {
			if (!cell.element) {
				cell = this.cell(cell);
			}
			var nextCell = this.inherited(arguments),
				prevCell = cell;

			// Skip over hidden cells
			while (nextCell.column.hidden) {
				nextCell = this.inherited(arguments, [nextCell, steps > 0 ? 1 : -1]);
				if (prevCell.element === nextCell.element) {
					// No further visible cell found - return original
					return cell;
				}
				prevCell = nextCell;
			}
			return nextCell;
		},
		isColumnHidden: function (id) {
			// summary:
			//		Convenience method to determine current hidden state of a column
			return !!this._columnHiderRules[id];
		},
		_hideColumn: function (id) {
			// summary:
			//		Hides the column indicated by the given id.

			// Use miscUtil function directly, since we clean these up ourselves anyway
			var grid = this,
                domId = this.template ? this.template.id : this.domNode.id,
                selectorPrefix = '#' + miscUtil.escapeCssIdentifier(domId) + ' .dgrid-column-',
				tableRule; // used in IE8 code path

			if (this._columnHiderRules[id]) {
				return;
			}

			this._columnHiderRules[id] =
				miscUtil.addCssRule(selectorPrefix + miscUtil.escapeCssIdentifier(id, '-'),
					'display: none;');

			if (has('ie') === 8 || has('ie') === 10) {
				// Work around IE8 display issue and IE10 issue where
				// header/body cells get out of sync when ColumnResizer is also used
				tableRule = miscUtil.addCssRule('.dgrid-row-table', 'display: inline-table;');

				window.setTimeout(function () {
					tableRule.remove();
					grid.resize();
				}, 0);
			}
		},
		_showColumn: function (id) {
			// summary:
			//		Shows the column indicated by the given id
			//		(by removing the rule responsible for hiding it).

			if (this._columnHiderRules[id]) {
				this._columnHiderRules[id].remove();
				delete this._columnHiderRules[id];
			}
		},
        showColumn:function(id,show){
            if(this.isColumnHidden(id)){
                if(show) {
                    this._showColumn(id);
                }
            }else if(!show){
                this._hideColumn(id);
            }
        }
	});
});
