/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/utils',
    'xide/widgets/TemplatedWidgetBase',
    'xide/registry'
], function (declare, utils, TemplatedWidgetBase, registry) {

    var template = '<div tabindex="-1" attachTo="template" class="grid-template widget" style="width: 100%;height: 100%;overflow: hidden;position: relative;padding: 0px;margin: 0px">'+
        '<div tabindex="-1" attachTo="header" class="grid-header row"></div>'+
        '<div tabindex="0" attachTo="grid" class="grid-body row"></div>'+
        '<div attachTo="footer" class="grid-footer" style="position: absolute;bottom: 0px;width: 100%"></div>'+
    '</div>';

    var Implementation = {
        template: null,
        attachDirect: true,
        destroy: function () {
            //important,remove us from our temp. template.
            this.template && this.template.remove(this) && utils.destroy(this.template,true,this);
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
            this.inherited(arguments);
            var thiz = this,
                mainNode = thiz.template  ? thiz.template.domNode : this.domNode,
                isRerooted = false;

            if(this.__masterPanel){
                mainNode = this.__masterPanel.containerNode;
                isRerooted= true;
            }
            var totalHeight = $(mainNode).height();
            var template = thiz.template;
            if(!template){
                return;
            }
            var topHeight = template.header ? $(template.header).height() : 0;
            var _toolbarHeight = this._toolbar ? this._toolbar._height : 0;
            if(_toolbarHeight>0 && topHeight==0){
                topHeight +=_toolbarHeight;
            }
            var footerHeight = template.footer ? $(template.footer).height() : 0;
            var finalHeight = totalHeight - topHeight - footerHeight;
            if (finalHeight > 50) {
                $(template.grid).height(totalHeight - topHeight - footerHeight + 'px');
                isRerooted && $(template.domNode).width($(mainNode).width());
            } else {
                $(template.grid).height('inherited');
            }
        },
        buildRendering: function () {
            if (this.template) {
                return;
            }
            this._domNode = this.domNode;
            var templated = utils.addWidget(TemplatedWidgetBase, {
                templateString: template,
                declaredClass: 'xgrid/_BaseParent_' + this.declaredClass
                /*attachDirect:true*/
            }, null, this.domNode, true);

            $(templated.domNode).attr('tabIndex', -1);

            this.template = templated;
            this.header = templated.header;
            this.footer = templated.footer;
            this.gridBody = templated.grid;
            this.domNode = templated.grid;
            this.id = this.template.id;
            this.domNode.id = this.id;

            templated.domNode.id = this.id;
            registry._hash[this.id] = this;

            templated.add(this,null,false);
            return this.inherited(arguments);
        }
    };

    //package via declare
    var _class = declare('xgrid.Layout', null, Implementation);
    _class.Implementation = Implementation;
    return _class;
});
