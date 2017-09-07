define([
    "dojo/_base/declare",
    "xide/model/Component"
], (declare, Component) => /**
 * @class xfile.component
 * @inheritDoc
 */
declare("xfile.component", Component, {
    /**
     * @inheritDoc
     */
    beanType:'',
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Implement base interface
    //
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    getDependencies:function(){
        return [

        ];
    },
    /**
     * @inheritDoc
     */
    getLabel: function () {
        return 'xgrid';
    },
    /**
     * @inheritDoc
     */
    getBeanType:function(){
        return this.beanType;
    }
}));

