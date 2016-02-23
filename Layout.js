/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/utils',
    'xide/widgets/TemplatedWidgetBase',
    'dijit/registry',
    "dojo/text!./templateDIV.html"
], function (declare, utils, TemplatedWidgetBase, registry, template) {

    var Implementation = {

        template: null,

        attachDirect: true,

        destroy: function () {
            utils.destroy(this.template);
            this.inherited(arguments);
        },
        getTemplateNode: function () {
            return this.template.domNode;
        },
        getHeaderNode: function () {
            return this.template.header;
        },
        getBodyNode: function () {
            return this.template.grid;
        },
        getFooterNode: function () {
            return this.template.footer;
        },
        resize: function () {

            // call dgrid/List::resize()
            //console.log('resize xgrid layout');
            this.inherited(arguments);

            var thiz = this;

            var mainNode = thiz.template.domNode,
                isRerooted = false;

            if(this.__masterPanel){
                mainNode = this.__masterPanel.containerNode;
                isRerooted= true;
            }


            var totalHeight = $(mainNode).height();
            var topHeight = $(thiz.template.header).height();
            var _toolbarHeight = this._toolbar ? this._toolbar._height : 0;
            //console.log('--- top height ' + topHeight + ' toolbar height ' + _toolbarHeight);
            if(_toolbarHeight>0 && topHeight==0){
                topHeight +=_toolbarHeight;
            }
            var footerHeight = $(thiz.template.footer).height();
            //isRerooted && (footerHeight = 0);
            var finalHeight = totalHeight - topHeight - footerHeight;


            if (finalHeight > 50) {

                $(thiz.template.grid).height(totalHeight - topHeight - footerHeight + 'px');

                isRerooted && $(thiz.template.domNode).width($(mainNode).width());
                //isRerooted && $(thiz.template.domNode).height(totalHeight - topHeight + 'px');


            } else {
                $(thiz.template.grid).height('inherited');
            }


        },
        buildRendering: function () {

            if (this.template) {
                return;
            }

            this._domNode = this.domNode;


            var templated = utils.addWidget(TemplatedWidgetBase, {
                templateString: template
                /*attachDirect:true*/
            }, null, this.domNode, true);


            $(templated.domNode).attr('tabIndex',-1);


            this.template = templated;

            this.header = templated.header;
            this.footer = templated.footer;
            this.gridBody = templated.grid;
            this.domNode = templated.grid;
            /*if(!this.id) {*/
            this.id = this.template.id;
            /*}*/
            /*if(!this.domNode.id) {*/
            this.domNode.id = this.id;
            /*}*/

            templated.domNode.id = this.id;


            registry._hash[this.id] = this;

            this.inherited(arguments);


        }
    };

    //package via declare
    var _class = declare('xgrid.Layout', null, Implementation);
    _class.Implementation = Implementation;
    return _class;
});
