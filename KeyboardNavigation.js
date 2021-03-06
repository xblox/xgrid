define([
	"xdojo/declare", // declare
	"dojo/keys", // keys.END keys.HOME, keys.LEFT_ARROW etc.
	"dojo/_base/lang", // hitch
	"dojo/on",
	"xide/utils"
], function(declare, keys, lang, on, utils){

	//@TODO: port hitch
	var hitch = lang.hitch;
	//@TODO: port utils.find
	var find = utils.find;
	
	return declare('xgrid/KeyboardNavigation',null, {
		// summary:
		//		A mixin to allow arrow key and letter key navigation of child or descendant widgets.
		//		It can be used by dijit/_Container based widgets with a flat list of children,
		//		or more complex widgets like dijit/Tree.
		//
		//		To use this mixin, the subclass must:
		//
		//			- Implement  _getNext(), _getFirst(), _getLast(), _onLeftArrow(), _onRightArrow()
		//			  _onDownArrow(), _onUpArrow() methods to handle home/end/left/right/up/down keystrokes.
		//			  Next and previous in this context refer to a linear ordering of the descendants used
		//			  by letter key search.
		//			- Set all descendants' initial tabIndex to "-1"; both initial descendants and any
		//			  descendants added later, by for example addChild()
		//			- Define childSelector to a function or string that identifies focusable descendant widgets
		//
		//		Also, child widgets must implement a focus() method.

		/*=====
		 // focusedChild: [protected readonly] Widget
		 //		The currently focused child widget, or null if there isn't one
		 focusedChild: null,

		 // _keyNavCodes: Object
		 //		Hash mapping key code (arrow keys and home/end key) to functions to handle those keys.
		 //		Usually not used directly, as subclasses can instead override _onLeftArrow() etc.
		 _keyNavCodes: {},
		 =====*/

		// childSelector: [protected abstract] Function||String
		//		Selector (passed to on.selector()) used to identify what to treat as a child widget.   Used to monitor
		//		focus events and set this.focusedChild.   Must be set by implementing class.   If this is a string
		//		(ex: "> *") then the implementing class must require dojo/query.
		childSelector: ".dgrid-row",
		defer: function(fcn, delay){
			// summary:
			//		Wrapper to setTimeout to avoid deferred functions executing
			//		after the originating widget has been destroyed.
			//		Returns an object handle with a remove method (that returns null) (replaces clearTimeout).
			// fcn: function reference
			// delay: Optional number (defaults to 0)
			// tags:
			//		protected.
			var timer = setTimeout(hitch(this,
					function(){
						timer = null;
						if(!this._destroyed){
							hitch(this, fcn)();
						}
					}),
				delay || 0
			);
			return {
				remove:	function(){
					if(timer){
						clearTimeout(timer);
						timer = null;
					}
					return null; // so this works well: handle = handle.remove();
				}
			};
		},
		buildRendering:function(){
			this.inherited(arguments);
			// Set tabIndex on this.domNode.  Will be automatic after #7381 is fixed.
			//domAttr.set(this.domNode, "tabIndex", this.tabIndex);
			if(!this._keyNavCodes){
				var keyCodes = this._keyNavCodes = {};
				keyCodes[keys.UP_ARROW] = hitch(this, "_onUpArrow");
				keyCodes[keys.DOWN_ARROW] = hitch(this, "_onDownArrow");
			}

			var self = this,
				childSelector = typeof this.childSelector == "string" ? this.childSelector : hitch(this, "childSelector"),
				node = this.domNode;

			this.__on(node, "keypress",null,hitch(this, "_onContainerKeypress"));
			this.__on(node, "keydown",null,hitch(this, "_onContainerKeydown"));
		},
		_onLeftArrow: function(){
			// summary:
			//		Called on left arrow key, or right arrow key if widget is in RTL mode.
			//		Should go back to the previous child in horizontal container widgets like Toolbar.
			// tags:
			//		extension
		},

		_onRightArrow: function(){
			// summary:
			//		Called on right arrow key, or left arrow key if widget is in RTL mode.
			//		Should go to the next child in horizontal container widgets like Toolbar.
			// tags:
			//		extension
		},

		_onUpArrow: function(){
			// summary:
			//		Called on up arrow key. Should go to the previous child in vertical container widgets like Menu.
			// tags:
			//		extension
		},

		_onDownArrow: function(){
			// summary:
			//		Called on down arrow key. Should go to the next child in vertical container widgets like Menu.
			// tags:
			//		extension
		},

		___focus: function(){
			// summary:
			//		Default focus() implementation: focus the first child.
			this.focusFirstChild();
		},

		_getFirstFocusableChild: function(){
			// summary:
			//		Returns first child that can be focused.

			// Leverage _getNextFocusableChild() to skip disabled children
			return this._getNextFocusableChild(null, 1);	// dijit/_WidgetBase
		},

		_getLastFocusableChild: function(){
			// summary:
			//		Returns last child that can be focused.

			// Leverage _getNextFocusableChild() to skip disabled children
			return this._getNextFocusableChild(null, -1);	// dijit/_WidgetBase
		},
		_searchString: "",
		// multiCharSearchDuration: Number
		//		If multiple characters are typed where each keystroke happens within
		//		multiCharSearchDuration of the previous keystroke,
		//		search for nodes matching all the keystrokes.
		//
		//		For example, typing "ab" will search for entries starting with
		//		"ab" unless the delay between "a" and "b" is greater than multiCharSearchDuration.
		multiCharSearchDuration: 1000,

		onKeyboardSearch: function(/*dijit/_WidgetBase*/ item, /*Event*/ evt, /*String*/ searchString, /*Number*/ numMatches){
			// summary:
			//		When a key is pressed that matches a child item,
			//		this method is called so that a widget can take appropriate action is necessary.
			// tags:
			//		protected
			if(item){
				this.deselectAll();
				this.select([this.row(item).data],null,true,{
					focus:true,
					delay:10,
					append:true
				})
			}
		},
		getSearchableText:function(data){
			return data.message || data.name  || '';
		},
		_keyboardSearchCompare: function(/*dijit/_WidgetBase*/ item, /*String*/ searchString){
			// summary:
			//		Compares the searchString to the widget's text label, returning:
			//
			//			* -1: a high priority match  and stop searching
			//		 	* 0: not a match
			//		 	* 1: a match but keep looking for a higher priority match
			// tags:
			//		private
			var element = item;
			if(item && !item.data){
				var row= this.row(item);
				if(row){
					item['data']=row.data;
				}
			}

			//var text = item.label || (element.focusNode ? element.focusNode.label : '') || element.innerText || element.textContent || "";
			var text = item ? item.data ? this.getSearchableText(item.data) : '' : '';
			if(text) {
				text = text.toLowerCase();
				//try starts with first:
				var currentString = text.replace(/^\s+/, '').substr(0, searchString.length).toLowerCase();
				var res = (!!searchString.length && currentString == searchString) ? -1 : 0; // stop searching after first match by default

				var contains = text.replace(/^\s+/, '').indexOf(searchString.toLowerCase())!=-1;
				if(res==0 && searchString.length>1 && contains){
					return 1;
				}
				return res;
			}
		},

		_onContainerKeydown: function(evt){
			// summary:
			//		When a key is pressed, if it's an arrow key etc. then it's handled here.
			// tags:
			//		private

			if((evt.target && evt.target.className.indexOf('input') != -1)){
				return;
			}

			var func = this._keyNavCodes[evt.keyCode];
			if(func){
				func(evt, this.focusedChild);
				evt.stopPropagation();
				evt.preventDefault();
				this._searchString = ''; // so a DOWN_ARROW b doesn't search for ab
			}else if(evt.keyCode == keys.SPACE && this._searchTimer && !(evt.ctrlKey || evt.altKey || evt.metaKey)){
				evt.stopImmediatePropagation(); // stop _HasDropDown from processing the SPACE as well
				evt.preventDefault(); // stop default actions like page scrolling on SPACE, but also keypress unfortunately
				on.emit(this.domNode, "keypress", {
					charCode: keys.SPACE,
					cancelable: true,
					bubbles: true
				});
			}
		},

		_onContainerKeypress: function(evt){
			if(this.editing){
				return;
			}
			if((evt.target && evt.target.className.indexOf('input') != -1)){
				return;
			}
			// summary:
			//		When a printable key is pressed, it's handled here, searching by letter.
			// tags:
			//		private

			if(evt.charCode < 32){
				// Avoid duplicate events on firefox (this is an arrow key that will be handled by keydown handler)
				return;
			}

			if(evt.ctrlKey || evt.altKey){
				return;
			}

			var
				matchedItem = null,
				searchString,
				numMatches = 0,
				search = hitch(this, function(){
					if(this._searchTimer){
						this._searchTimer.remove();
					}
					this._searchString += keyChar;
					var allSameLetter = /^(.)\1*$/.test(this._searchString);
					var searchLen = allSameLetter ? 1 : this._searchString.length;
					searchString = this._searchString.substr(0, searchLen);
					// commented out code block to search again if the multichar search fails after a smaller timeout
					//this._searchTimer = this.defer(function(){ // this is the "failure" timeout
					//	this._typingSlowly = true; // if the search fails, then treat as a full timeout
					//	this._searchTimer = this.defer(function(){ // this is the "success" timeout
					//		this._searchTimer = null;
					//		this._searchString = '';
					//	}, this.multiCharSearchDuration >> 1);
					//}, this.multiCharSearchDuration >> 1);
					this._searchTimer = this.defer(function(){ // this is the "success" timeout
						this._searchTimer = null;
						this._searchString = '';

					}, this.multiCharSearchDuration);
					var currentItem = this.focusedChildNode ||this.focusedChild || null;
					if(searchLen == 1 || !currentItem){
						currentItem = this._getNextFocusableChild(currentItem, 1); // skip current
						if(!currentItem){
							return;
						} // no items
					}
					var stop = currentItem;
					var idx=0;
					do{
						var rc = this._keyboardSearchCompare(currentItem, searchString);
						if(!!rc && numMatches++ == 0){
							matchedItem = currentItem;
						}
						if(rc == -1){ // priority match
							numMatches = -1;
							break;
						}
						currentItem = this._getNextFocusableChild(currentItem, 1);
					}while(currentItem != stop);
					// commented out code block to search again if the multichar search fails after a smaller timeout
					//if(!numMatches && (this._typingSlowly || searchLen == 1)){
					//	this._searchString = '';
					//	if(searchLen > 1){
					//		// if no matches and they're typing slowly, then go back to first letter searching
					//		search();
					//	}
					//}
				}),
				keyChar = String.fromCharCode(evt.charCode).toLowerCase();


			evt.preventDefault();
			evt.stopPropagation();
			search();

			// commented out code block to search again if the multichar search fails after a smaller timeout
			//this._typingSlowly = false;
			this.onKeyboardSearch(matchedItem, evt, searchString, numMatches);
		},

		_onChildBlur: function(/*dijit/_WidgetBase*/ /*===== widget =====*/){
			// summary:
			//		Called when focus leaves a child widget to go
			//		to a sibling widget.
			//		Used to be used by MenuBase.js (remove for 2.0)
			// tags:
			//		protected
		},

		_getNextFocusableChild: function(child, dir){
			// summary:
			//		Returns the next or previous focusable descendant, compared to "child".
			//		Implements and extends _KeyNavMixin._getNextFocusableChild() for a _Container.
			// child: Widget
			//		The current widget
			// dir: Integer
			//		- 1 = after
			//		- -1 = before
			// tags:
			//		abstract extension
			var wrappedValue = child;
			do{
				if(!child){
					child = this[dir > 0 ? "_getFirst" : "_getLast"]();
					if(!child){
						break;
					}
				}else{
					if(child && child.node){
						var innerNode = utils.find('.dgrid-cell',child.node,true);
						if(innerNode){
							child=innerNode;
						}
					}
					child = this._getNext(child, dir);
				}
				if(child != null && child != wrappedValue){
					return child;
				}
			}while(child != wrappedValue);
		},

		_getFirst: function(){
			var innerNode = utils.find('.dgrid-row', this.domNode,true);
			if(innerNode){
				var innerNode0 = utils.find('.dgrid-cell', innerNode,true);
				if(innerNode0){
					return innerNode0;
				}
			}
			return innerNode;
		},

		_getLast: function(){
			var innerNode = utils.find('.dgrid-row', this.domNode,false);
			if(innerNode){
				var innerNode0 = utils.find('.dgrid-cell', innerNode,true);
				if(innerNode0){
					return innerNode0;
				}
			}
			return null;
		},
		_getPrev: function(child, dir){
			// summary:
			//		Returns the next descendant, compared to "child".
			// child: Widget
			//		The current widget
			// dir: Integer
			//		- 1 = after
			//		- -1 = before
			// tags:
			//		abstract extension
			if(child){
				var w= this.up(child,1,true);
				if(w){
					var data = null;
					if(w.data){
						data= w.data;
					}

					if(w.element){
						w= w.element;
					}
					var innerNode = utils.find('.dgrid-cell', w,true);
					if(innerNode){
						if(!innerNode.data){
							innerNode['data']=data;
						}
						return innerNode;
					}
					return w;
				}
			}
		},
		_getNext: function(child, dir){
			// summary:
			//		Returns the next descendant, compared to "child".
			// child: Widget
			//		The current widget
			// dir: Integer
			//		- 1 = after
			//		- -1 = before
			// tags:
			//		abstract extension
			if(child){
				var w= this.down(child,1,true);
				if(w){
					if(w.element){
						w= w.element;
					}
					var innerNode = utils.find('.dgrid-cell', w,true);
					if(innerNode){
						return innerNode;
					}
					return w;
				}
			}
		}
	});
});
