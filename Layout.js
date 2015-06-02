/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/widgets/TemplatedWidgetBase',
    "dojo/text!./templateDIV.html"
], function (declare,types,utils,TemplatedWidgetBase,template) {

    var Implementation = {

        template:null,
        getTemplateNode:function(){
            return this.template.domNode;
        },
        getHeaderNode:function(){
          return this.template.header;
        },
        getBodyNode:function(){
            return this.template.grid;
        },
        getFooterNode:function(){
            return this.template.footer;
        },
        resize:function() {

            // call dgrid/List::resize()
            this.inherited(arguments);

            var thiz = this;
            var totalHeight = $(thiz.template.domNode).height();
            var topHeight = $(thiz.template.header).height();
            var footerHeight = $(thiz.template.footer).height();
            var finalHeight = totalHeight - topHeight - footerHeight;
            $(thiz.template.grid).height(finalHeight + 'px');
        },
        buildRendering:function(){

            var templated = utils.addWidget(TemplatedWidgetBase,{
                templateString:template
            },null,this.domNode,true);

            this.template = templated;

            this.header = templated.header;
            this.footer = templated.footer;
            this.gridBody = templated.grid;
            this.domNode = templated.grid;
            this.inherited(arguments);
        }
    };

    //package via declare
    var _class = declare('xgrid.Layout',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});