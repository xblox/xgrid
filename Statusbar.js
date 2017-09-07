/** @module xgrid/Statusbar **/
define([
    "xdojo/declare",
    'xide/types'
], (declare, types) => {
    //package via declare
    var _class = declare('xgrid.Statusbar',null,{
        statusbar:null,
        getStatusbar:function(){
            if(this.statusbar){
                return this.statusbar;
            }else{
                return this.createStatusbar();
            }
        },
        createStatusbar:function(where){
            where = where = this.footer;
            var statusbar = this.statusbar;
            if(!statusbar){
                var root = $('<div class="statusbar widget" style="width:inherit;padding: 0;margin:0;padding-left: 4px;"></div>')[0];
                where.appendChild(root);
                statusbar = $('<div style="width: auto;display: inline-block;">0 items selected</div>')[0];
                root.appendChild(statusbar);
                var collapser = $('<div class="fa-caret-up" style="width:auto;padding: 2px;margin:0;float: right;display: inline-block;margin-right: 10px;" ></div>')[0];
                root.appendChild(collapser);
                this.statusbar = statusbar;
                this.statusbarCollapse = collapser;
            }
            return statusbar;
        },
        startup:function() {
            this.inherited(arguments);
            if (this.footer) {
                var statusbar = this.createStatusbar();
            }
        }
    });

    return _class;
});