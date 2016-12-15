/** @module xgrid/DnD **/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/aspect',
    'dojo/dom-class',
    'dojo/topic',
    'dojo/has',
    'dojo/when',
    'dojo/dnd/Source',
    'dojo/dnd/Manager',
    'dojo/_base/NodeList',
    'dojo/dnd/Manager',
    'dojo/dnd/common',
    'dojo/dom-geometry',
    'xide/lodash',
    'xide/$',
    'dojo/has!touch?../util/touch'
], function (declare, lang, arrayUtil, aspect, domClass, topic, has, when, DnDSource,
             DnDManager, NodeList, Manager, dnd, domGeom,_,$,touchUtil) {
    /**
     * @TODO
     * - consider sending items rather than nodes to onDropExternal/Internal
     * - overriding _markTargetAnchor is incomplete and doesn't treat a redunant before==after and thus cause a pretty ugly flickering
     * - could potentially also implement copyState to jive with default
     * - onDrop* implementations (checking whether store.copy is available);
     * - not doing that just yet until we're sure about default impl.
     */
    /**
     * @class module:xgrid/DnD/GridDnDSource
     * @extends module:dojo/dnd/Source
     */
    var GridDnDSource = declare(DnDSource, {
        /**
         * @type {module:xgrid/Base|dgrid/List}
         */
        grid: null,
        /**
         * @type {string} the CSS class needed to recognize the 'on center' state.
         */
        centerClass: 'dgrid-cell',
        /**
         * Function to determine the the drag source is over a target's center area (and not 'before' or 'after' )
         * This is called by a dojo/dnd/Source#onMouseMove variant.
         * @param e {MouseEvent}
         * @returns {boolean}
         */
        isCenter: function (e) {
            return $(e.target).parent().hasClass(this.centerClass);
        },
        /**
         * Method which should be defined on any source intending on interfacing with dgrid DnD.
         * @param node {HTMLElement}
         * @returns {module:xide/data/Model|*}
         */
        getObject: function (node) {
            var grid = this.grid;
            // Extract item id from row node id (gridID-row-*).
            return grid._trackError(function () {
                return grid.collection.get(node.id.slice(grid.id.length + 5));
            });
        },
        _legalMouseDown: function (evt) {
            // Fix _legalMouseDown to only allow starting drag from an item
            // (not from bodyNode outside contentNode).
            var legal = this.inherited(arguments);
            return legal && evt.target !== this.grid.bodyNode;
        },
        /**
         * @param sourceSource {module:dojo/dnd/Source}
         * @param nodes {HTMLElement[]}
         * @param copy {boolean}
         */
        onDrop: function (sourceSource, nodes, copy) {
            var targetSource = this,
                targetRow = this._targetAnchor = this.targetAnchor, // save for Internal
                targetGrid = this.grid,
                targetStore = targetGrid.collection,
                sourceGrid = sourceSource.grid,
                sourceStore = sourceGrid.collection;

            if (!this.before && targetRow) {
                // target before next node if dropped within bottom half of this node
                // (unless there's no node to target at all)
                targetRow = targetRow.nextSibling;
            }
            targetRow = targetRow && targetGrid.row(targetRow);
            when(targetRow && targetStore.get(targetRow.id), function (target) {
                // Note: if dropping after the last row, or into an empty grid,
                // target will be undefined.  Thus, it is important for store to place
                // item last in order if options.before is undefined.

                // Delegate to onDropInternal or onDropExternal for rest of logic.
                // These are passed the target item as an additional argument.
                if (targetSource !== sourceSource && sourceStore.root != targetStore.root) {
                    targetSource.onDropExternal(sourceSource, nodes, copy, target);
                }
                else {
                    targetSource.onDropInternal(nodes, copy, target);
                }
            });
        },
        /**
         *
         * @param nodes {HTMLElement[]}
         * @param copy {boolean}
         * @param targetItem {module:xide/data/Model}
         */
        onDropInternal: function (nodes, copy, targetItem) {
            var grid = this.grid,
                store = grid.collection,
                targetSource = this,
                anchor = targetSource._targetAnchor,
                targetRow,
                nodeRow;

            if (anchor) { // (falsy if drop occurred in empty space after rows)
                targetRow = this.before ? anchor.previousSibling : anchor.nextSibling;
            }

            // Don't bother continuing if the drop is really not moving anything.
            // (Don't need to worry about edge first/last cases since dropping
            // directly on self doesn't fire onDrop, but we do have to worry about
            // dropping last node into empty space beyond rendered rows.)
            nodeRow = grid.row(nodes[0]);
            if (!copy && (targetRow === nodes[0] ||
                (!targetItem && nodeRow && grid.down(nodeRow).element === nodes[0]))) {
                return;
            }

            nodes.forEach(function (node) {
                when(targetSource.getObject(node), function (object) {
                    var id = store.getIdentity(object);

                    // For copy DnD operations, copy object, if supported by store;
                    // otherwise settle for put anyway.
                    // (put will relocate an existing item with the same id, i.e. move).
                    grid._trackError(function () {
                        return store[copy && store.copy ? 'copy' : 'put'](object, {
                            beforeId: targetItem ? store.getIdentity(targetItem) : null
                        }).then(function () {
                            // Self-drops won't cause the dgrid-select handler to re-fire,
                            // so update the cached node manually
                            if (targetSource._selectedNodes[id]) {
                                targetSource._selectedNodes[id] = grid.row(id).element;
                            }
                        });
                    });
                });
            });
        },
        /**
         * @param sourceSource {module:dojo/dnd/Source}
         * @param nodes {HTMLElement[]}
         * @param copy {boolean}
         * @param targetItem {module:dojo/dnd/Target}
         */
        onDropExternal: function (sourceSource, nodes, copy, targetItem) {
            // Note: this default implementation expects that two grids do not
            // share the same store.  There may be more ideal implementations in the
            // case of two grids using the same store (perhaps differentiated by
            // query), dragging to each other.
            var grid = this.grid,
                store = this.grid.collection,
                sourceGrid = sourceSource.grid;

            // TODO: bail out if sourceSource.getObject isn't defined?
            nodes.forEach(function (node, i) {
                when(sourceSource.getObject(node), function (object) {
                    // Copy object, if supported by store; otherwise settle for put
                    // (put will relocate an existing item with the same id).
                    // Note that we use store.copy if available even for non-copy dnd:
                    // since this coming from another dnd source, always behave as if
                    // it is a new store item if possible, rather than replacing existing.
                    grid._trackError(function () {
                        return store[store.copy ? 'copy' : 'put'](object, {
                            beforeId: targetItem ? store.getIdentity(targetItem) : null
                        }).then(function () {
                            if (!copy) {
                                if (sourceGrid) {
                                    // Remove original in the case of inter-grid move.
                                    // (Also ensure dnd source is cleaned up properly)
                                    var id = sourceGrid.collection.getIdentity(object);
                                    !i && sourceSource.selectNone(); // Deselect all, one time
                                    sourceSource.delItem(node.id);
                                    return sourceGrid.collection.remove(id);
                                }
                                else {
                                    sourceSource.deleteSelectedNodes();
                                }
                            }
                        });
                    });
                });
            });
        },
        /**
         * @param source {module:dojo/dnd/Source}
         */
        onDndStart: function (source) {
            // Listen for start events to apply style change to avatar.
            this.inherited(arguments); // DnDSource.prototype.onDndStart.apply(this, arguments);
            if (source === this) {
                // Set avatar width to half the grid's width.
                // Kind of a naive default, but prevents ridiculously wide avatars.
                DnDManager.manager().avatar.node.style.width =
                    this.grid.domNode.offsetWidth / 2 + 'px';
            }
        },
        /**
         * @param evt {MouseEvent}
         */
        onMouseDown: function (evt) {
            // Cancel the drag operation on presence of more than one contact point.
            // (This check will evaluate to false under non-touch circumstances.)
            if (has('touch') && this.isDragging &&
                touchUtil.countCurrentTouches(evt, this.grid.touchNode) > 1) {
                topic.publish('/dnd/cancel');
                DnDManager.manager().stopDrag();
            }
            else {
                this.inherited(arguments);
            }
        },
        /**
         * Event processor for onmousemove.
         * @param e {MouseEvent}
         */
        onMouseMove: function (e) {
            if (this.isDragging && this.targetState == 'Disabled') {
                return;
            }
            var m = Manager.manager();
            if (!this.isDragging) {
                if (this.mouseDown && this.isSource &&
                    (Math.abs(e.pageX - this._lastX) > this.delay || Math.abs(e.pageY - this._lastY) > this.delay)) {
                    var nodes = this.getSelectedNodes();
                    if (nodes.length) {
                        m.startDrag(this, nodes, this.copyState(dnd.getCopyKeyState(e), true));
                    }
                }
            }

            if (this.isDragging) {
                // calculate before/center/after
                var before = false;
                var center = false;
                if (this.current) {
                    if (!this.targetBox || this.targetAnchor != this.current) {
                        this.targetBox = domGeom.position(this.current, true);
                    }
                    if (this.horizontal) {
                        // In LTR mode, the left part of the object means "before", but in RTL mode it means "after".
                        before = (e.pageX - this.targetBox.x < this.targetBox.w / 2) == domGeom.isBodyLtr(this.current.ownerDocument);
                    } else {
                        before = (e.pageY - this.targetBox.y) < (this.targetBox.h / 2);
                    }

                }
                center = this.isCenter(e);
                if (this.current != this.targetAnchor || before != this.before || center != this.center) {
                    var grid = this.grid;
                    var canDrop = !this.current || m.source != this || !(this.current.id in this.selection);
                    var source = grid._sourceToModel(m.source), target = grid._sourceToModel(this.current);
                    if (source && target && target.canAdd && center) {
                        var targetCan = target.canAdd(source);
                        if (targetCan === false) {
                            canDrop = targetCan;
                        }
                    }
                    this._markTargetAnchor(before, center, canDrop);
                    m.canDrop(canDrop);
                }
            }
        },
        checkAcceptance: function (source) {
            // Augment checkAcceptance to block drops from sources without getObject.
            return source.getObject && DnDSource.prototype.checkAcceptance.apply(this, arguments);
        },
        getSelectedNodes: function () {
            // If dgrid's Selection mixin is in use, synchronize with it, using a
            // map of node references (updated on dgrid-[de]select events).

            if (!this.grid.selection) {
                return this.inherited(arguments);
            }
            var t = new NodeList(),
                id;
            for (id in this.grid.selection) {
                t.push(this._selectedNodes[id]);
            }
            return t;	// NodeList
        }
    });

    // Mixin Selection for more resilient dnd handling, particularly when part
    // of the selection is scrolled out of view and unrendered (which we
    // handle below).
    /**
     *
     * Requirements
     * - requires a store (sounds obvious, but not all Lists/Grids have stores...)
     * - must support options.before in put calls (if undefined, put at end)
     * - should support copy (copy should also support options.before as above)
     * @class module:xgrid/DnD
     */
    var DnD = declare('xgrid/views/DnD', null, {
        // dndSourceType: String
        //		Specifies the type which will be set for DnD items in the grid,
        //		as well as what will be accepted by it by default.
        dndSourceType: 'dgrid-row',

        // dndParams: Object
        //		Object containing params to be passed to the DnD Source constructor.
        dndParams: null,

        // dndConstructor: Function
        //		Constructor from which to instantiate the DnD Source.
        //		Defaults to the GridSource constructor defined/exposed by this module.
        dndConstructor: GridDnDSource,
        postMixInProperties: function () {
            this.inherited(arguments);
            // ensure dndParams is initialized
            this.dndParams = lang.mixin({accept: [this.dndSourceType]}, this.dndParams);
        },
        __dndNodesToModel: function (nodes) {
            return _.map(nodes, function (n) {
                return (this.row(n) || {}).data;
            }, this);
        },
        /**
         *
         * @param source {module:xgrid/DnD/GridDnDSource}
         * @returns {module:xide/data/Model}
         * @returns {module:xgrid/Base}
         * @private
         */
        _sourceToModel: function (source, grid) {
            var result = null;
            if (source) {
                var anchor = source._targetAnchor || source.anchor || source;
                grid = grid || source.grid || this;
                if (!anchor || !anchor.ownerDocument) {
                    return null;
                }
                var row = grid.row(anchor);
                if (row) {
                    return row.data;
                }
                if (anchor) {
                    result = grid.collection.getSync(anchor.id.slice(grid.id.length + 5));
                    if (!result) {
                        result = grid.row(anchor);
                    }
                }
            }
            return result;
        },
        postCreate: function () {
            this.inherited(arguments);
            // Make the grid's content a DnD source/target.
            var Source = this.dndConstructor || GridDnDSource;
            var dndParams = lang.mixin(this.dndParams, {
                // add cross-reference to grid for potential use in inter-grid drop logic
                grid: this,
                dropParent: this.contentNode
            });
            if (typeof this.expand === 'function') {
                // If the Tree mixin is being used, allowNested needs to be set to true for DnD to work properly
                // with the child rows.  Without it, child rows will always move to the last child position.
                dndParams.allowNested = true;
            }
            this.dndSource = new Source(this.bodyNode, dndParams);

            // Set up select/deselect handlers to maintain references, in case selected
            // rows are scrolled out of view and unrendered, but then dragged.
            var selectedNodes = this.dndSource._selectedNodes = {};
            function selectRow(row) {
                selectedNodes[row.id] = row.element;
            }
            function deselectRow(row) {
                delete selectedNodes[row.id];
                // Re-sync dojo/dnd UI classes based on deselection
                // (unfortunately there is no good programmatic hook for this)
                domClass.remove(row.element, 'dojoDndItemSelected dojoDndItemAnchor');
            }
            this.on('dgrid-select', function (event) {
                arrayUtil.forEach(event.rows, selectRow);
            });
            this.on('dgrid-deselect', function (event) {
                arrayUtil.forEach(event.rows, deselectRow);
            });
            aspect.after(this, 'destroy', function () {
                delete this.dndSource._selectedNodes;
                selectedNodes = null;
                this.dndSource.destroy();
            }, true);
        },
        insertRow: function (object) {
            // override to add dojoDndItem class to make the rows draggable
            var row = this.inherited(arguments),
                type = typeof this.getObjectDndType === 'function' ?
                    this.getObjectDndType(object) : [this.dndSourceType];

            domClass.add(row, 'dojoDndItem');
            this.dndSource.setItem(row.id, {
                data: object,
                type: type instanceof Array ? type : [type]
            });
            return row;
        },
        removeRow: function (rowElement) {
            this.dndSource.delItem(this.row(rowElement));
            this.inherited(arguments);
        }
    });
    DnD.GridSource = GridDnDSource;
    return DnD;
});