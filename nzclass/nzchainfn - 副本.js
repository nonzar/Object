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
        data.fns = [];//函数队列
        /* 添加到队列 */
        ctrl._add = function (fn, asyn) {
            if (fn != undefined) {
                data.fns.push({
                    fn: function (e) {
                        data.fns[0].state = 1;
                        fn(e);//执行函数
                        if (!data.fns[0].isAsyn) {
                            //非异步函数
                            ctrl._next();//执行下一个
                        }
                    },
                    isAsyn: asyn != undefined ? asyn : true,
                    state: 0
                });
            }
            return ctrl;
        }
        /* 执行队列 */
        ctrl._run = function () {
            if (!data.fns.length) { return ctrl; }
            if (!data.fns[0].state) {
                data.fns[0].fn(this);
            }
            return ctrl;
        }
        /* 强制下一个 */
        ctrl._next = function () {
            if (!data.fns.length) { return ctrl; }
            if (data.fns[0].state) {
                data.fns.shift();//删除当前
            }
            ctrl._run();//执行队列
            return ctrl;
        }
        /*
            1.无参:
                1.队列无执行
                    执行队列
                2.执行队列中
                    执行下一个
            2.有参:
                1.添加
                    执行队列
        */
        ctrl.fn = function (fn, asyn) {
            switch (arguments.length) {
                case 0:
                    /* 无参 */
                    switch (data.fns[0].state) {
                        case 0:
                            ctrl._run();
                            break;
                        default:
                            ctrl._next();
                    }
                    break;
                default:
                    /* 有参 */
                    ctrl._add(fn, asyn);
                    ctrl._run();
            }
            return ctrl;
        }
        return ctrl;
    }
}