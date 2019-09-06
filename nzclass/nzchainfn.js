/* 
    链式函数类
    依賴:
        nzobject
*/
var NZChainfn = {
    controls: [],
    inArray: function (obj) {
        NZObject.inArray(obj, NZChainfn.controls);
    },
    createNew: function () {
        var ctrl, data = {}, obj = {};
        NZChainfn.controls.push(ctrl = {});
        data.idx = 0;//当前指针
        data.fns = [];//函数队列
        /* 添加到队列 */
        ctrl.add = function (fn, asyn) {
            if (!fn) { return ctrl; }
            data.fns.push({
                fn: function (e) {
                    if (data.fns[data.idx].state) { return ctrl; }
                    data.fns[data.idx].state = 1;//修改状态
                    fn(e);//执行函数
                    if (!data.fns[data.idx].isAsyn) {
                        //非异步函数,执行队列
                        ctrl.fn();//执行队列
                    }
                },
                isAsyn: asyn != undefined ? asyn : true,
                state: 0
            });
            return ctrl;
        }
        /* 添加\执行队列 */
        ctrl.fn = function (fn, asyn) {
            if (arguments.length) {
                ctrl.add(fn, asyn);//添加队列
                //执行队列
                if (data.fns[data.idx].state == 1) { return ctrl; }
                if (data.fns[data.idx].state == 2) {
                    if (data.idx + 1 >= data.fns.length) { return ctrl; }
                    data.idx++;//向后
                }
            } else {
                //结束当前,执行队列
                data.fns[data.idx].state = 2;//修改状态
                if (data.idx + 1 >= data.fns.length) { return ctrl; }
                data.idx++;//向后
            }
            data.fns[data.idx].fn(this);//执行函数
            return ctrl;
        }
        return ctrl;
    }
}