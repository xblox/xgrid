define(['xdojo/declare'], function (declare) {
    var Module = declare('xgrid/ExtraSpace',null,{
        deselectAll:function(){

            if(!this._lastSelection){
                return;
            }
            this.clearSelection();
            this._lastSelection=null;
            this._lastFocused=null;

            $(this.domNode).find('.dgrid-focus').each(function(i,el){
                $(el).removeClass('dgrid-focus');
            });
            this._emit('selectionChanged',{
                selection:[],
                why:"clear",
                source:'code'
            });
        },
        startup:function(){
            var res = this._started ? null : this.inherited(arguments);
            var self = this;
            this.on('dgrid-refresh-complete',function(){
                var _extra = $(self.contentNode).find('.dgrid-extra');
                if(!_extra.length){
                    _extra = $('<div class="dgrid-extra" style="width:100%;height:80px"></div>');
                    $(self.contentNode).append(_extra);
                    _extra.on('click',function(){
                        self.deselectAll();
                    });
                    _extra.on('contextmenu',function(){
                        self.deselectAll();
                    })
                }
            });
            return res;
        }
    });
    return Module;
});