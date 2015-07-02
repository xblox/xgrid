/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/widgets/TemplatedWidgetBase',
    'dijit/registry',
    "dojo/text!./templateDIV.html"
], function (declare,types,utils,TemplatedWidgetBase,registry,template) {

    var Implementation = {

        template:null,

        attachDirect:true,

        destroy:function(){
            utils.destroy(this.template);
            this.inherited(arguments);
        },
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
            setTimeout(function(){
                if(finalHeight > 50) {
                    $(thiz.template.grid).height(finalHeight + 'px');
                }else{
                    $(thiz.template.grid).height('inherited');
                }
            },10);

        },
        buildRendering:function(){

            if(this.template){
                return;
            }

            var templated = utils.addWidget(TemplatedWidgetBase,{
                templateString:template
            },null,this.domNode,true);

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


            registry._hash[this.id]= this;


            this.inherited(arguments);
        },
        startup:function(){
            if(this._started) {
               return;
            }

            this.inherited(arguments);

        }
    };

    //package via declare
    var _class = declare('xgrid.Layout',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});
