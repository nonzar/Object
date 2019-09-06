20140825
邓锦添

这是一个可以循环的列表效果

HOW TO USE

first of all，load require.js：
<script src="../../html-common/base/js/require.js"></script>

then type：

require(['../modules/nz_cyclistCtrl/cyclist.js'], function (cyclistCtrlM) {
    var myCyc = cyclistCtrlM.init.createNew();
    myCyc.init({
        count: 10,//列表元素总数
    });
    g_cyclistCtrl = myCyc;
    g_cyclistCtrl.getPrev(1);//获取后退后列表元素对应在数组里的序号（参数是移动多少次，可选，默认1）
    g_cyclistCtrl.getNext(1);//获取后退后列表元素对应在数组里的序号（参数是移动多少次，可选，默认1）
});
