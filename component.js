define([
    "dojo/_base/declare",
    "xide/model/Component"
], function (declare,Component) {

    /**
     * @class xfile.component
     * @inheritDoc
     */
    return declare("xfile.component",Component, {
        /**
         * @inheritDoc
         */
        beanType:'BTFILE',
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Implement base interface
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        getDependencies:function(){
            return [
                "xfile/types",
                "xfile/manager/FileManager",
                "xfile/manager/MountManager",
                "xfile/factory/Store",
                "xfile/views/FileGrid"
            ];
        },
        /**
         * @inheritDoc
         */
        getLabel: function () {
            return 'xfile';
        },
        /**
         * @inheritDoc
         */
        getBeanType:function(){
            return this.beanType;
        }
    });
});

