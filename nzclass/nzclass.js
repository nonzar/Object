/* ******************************************************************************** NZObject ******************************************************************************** */
/*
     基类
*/
var NZObject = {
    requestAnimationFrame: function () {
        return window.requestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function (callback) { return setTimeout(callback, 1); };
    },
    isEmptyObject: function (o) {
        for (var property in o) {
            return false;
        }
        return true;
    },
    inArray: function (value, array) {
        if (!value || array.length == 0) { return -1; }
        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }
        return -1;
    },
    setTimeout: function (callback, time) {
        var endTime = +new Date() + time,
            ctrl = {};
        ctrl._clear = false;
        ctrl.clear = function () {
            ctrl._clear = true;
        }
        ctrl.run = function () {
            if (ctrl._clear) { return; }
            if (+new Date() >= endTime) {
                callback();
            } else {
                requestAnimationFrame(ctrl.run);
            }
        };
        ctrl.run();
        return ctrl;
    },
    setInterval: function (callback, time, count) {
        var ctrl = {};
        ctrl.count = 0;
        ctrl._clear = false;
        ctrl._childCtrl = {};
        if (arguments.length < 3) {
            ctrl.isOver = function () {
                return ctrl._clear;
            }
        } else {
            ctrl.isOver = function () {
                return (ctrl._clear || ctrl.count >= count) ? true : false;
            }
        }
        ctrl.clear = function () {
            ctrl._childCtrl.clear();
            ctrl._clear = true;
        }
        ctrl.run = function () {
            ctrl._childCtrl = Common.setTimeout(function () {
                if (ctrl.isOver()) { return; }
                ctrl.count++;
                callback(ctrl);
                ctrl.run();
            }, time);
        };
        ctrl.run();
        return ctrl;
    },
    shuffleArr: function (array) {
        var m = array.length,
            t, i;
        // 如果还剩有元素…
        while (m) {
            // 随机选取一个元素…
            i = Math.floor(Math.random() * m--);
            // 与当前元素进行交换
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    },
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]); return null;
    },
    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    },
    setCookie: function (c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/")
    },
    delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = Common.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    _addRule_styleSheet: null,
    addRule: function (selector, style, index) {
        if (NZObject._addRule_styleSheet == null) {
            NZObject._addRule_styleSheet = document.createElement("style");
            NZObject._addRule_styleSheet.id = "NZOStyle";
            document.head.appendChild(NZObject._addRule_styleSheet);
            for (var i = 0; i < document.styleSheets.length; i++) {
                if (document.styleSheets[i].ownerNode.localName == "style" &&
                    document.styleSheets[i].ownerNode.getAttribute("id") == "NZOStyle") {
                    NZObject._addRule_styleSheet = document.styleSheets[i];
                }
            }
        }
        return NZObject._addRule_styleSheet.addRule(selector, style, index)
    }
}

/* ******************************************************************************** NZChainfn ******************************************************************************** */
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

/* ******************************************************************************** NZMask ******************************************************************************** */
/*
    遮罩層
    依賴:
        nzobject
        nzchainfn
*/
var NZMask = {
    controls: [],
    inArray: function (obj) {
        NZObject.inArray(obj, NZMask.controls);
    },
    createNew: function () {
        var data = {}, obj = {}, ctrl;
        NZMask.controls.push(ctrl = {});
        data.nowIdx;
        data.time;
        data.temps;
        obj.nzchainfn,
        obj.masks;
        ctrl.init = function (set) {
            set = set || {};
            NZObject.addRule(set.className || ".NZMask", set.css || "background-color: rgba(0,0,0,0.8);width: 100%;height: 100%;overflow: hidden;visibility: hidden;z-index: -1;position: fixed;left: 0;top: 0;opacity: 0;transition: opacity 500ms;");
            data.time = set.time == undefined ? 500 : (set.time == 0 ? 0 : set.time);
            obj.masks = set.masks || document.querySelectorAll(set.className || ".NZMask");
            data.nowIdx = -1;
            data.temps = [];
            obj.nzchainfn = NZChainfn.createNew();
            return ctrl;
        }
        ctrl.getIdx = function (id) {
            switch (typeof (id)) {
                case "number":
                    return id >= 0 ? (id < obj.masks.length ? id : -1) : -1;
                case "string":
                    for (var i = 0; i < obj.masks.length; i++) {
                        if (obj.masks[i].getAttribute("id") == id) {
                            return i;
                        }
                    }
            }
            return -1;
        }
        ctrl.show = function (id, callback, isAsyn) {
            obj.nzchainfn.fn(function (e) {
                data.temps[0] = ctrl.getIdx(id, obj.masks);
                if (data.temps[0] == -1 || data.temps[0] == data.nowIdx) {
                    if (callback != undefined) {
                        callback(e);
                    }
                    if (!isAsyn) { obj.nzchainfn.fn(); }
                }
                if (data.nowIdx != -1) {
                    obj.masks[data.nowIdx].style.opacity = "0";
                }
                obj.masks[data.temps[0]].style.visibility = "visible";
                obj.masks[data.temps[0]].style.opacity = "1";
                obj.masks[data.temps[0]].style.zIndex = "9999";
                NZObject.setTimeout(function () {
                    if (data.nowIdx != -1) {
                        obj.masks[data.nowIdx].style.visibility = "hidden";
                        obj.masks[data.nowIdx].style.zIndex = "-1";
                    }
                    data.nowIdx = data.temps[0];
                    if (callback != undefined) {
                        callback(e);
                    }
                    if (!isAsyn) { obj.nzchainfn.fn(); }
                }, data.time);
            });
            return ctrl;
        }
        ctrl.hide = function (callback, isAsyn) {
            obj.nzchainfn.fn(function (e) {
                if (data.nowIdx == -1) {
                    if (callback != undefined) {
                        callback(e);
                    }
                    if (!isAsyn) { obj.nzchainfn.fn(); }
                }
                obj.masks[data.nowIdx].style.opacity = "0";
                NZObject.setTimeout(function () {
                    obj.masks[data.nowIdx].style.visibility = "hidden";
                    obj.masks[data.nowIdx].style.zIndex = "-1";
                    data.nowIdx = -1;
                    if (callback != undefined) {
                        callback(e);
                    }
                    if (!isAsyn) { obj.nzchainfn.fn(); }
                }, data.time);
            });
            return ctrl;
        }
        return ctrl;
    }
}

/* ******************************************************************************** NZPreload ******************************************************************************** */
/*
    加载类
    依赖:
        preloadjs-0.6.0
 */
var NZPreload = {
    createNew: function () {
        var ctrl = {}, para = {};
        /* 储存器 */
        para.obj = {}
        para.data = {}
        para.event = {}
        /* 数据定义 */
        para.obj.loadQueue = null;
        para.event.progress = null;
        para.event.complete = null;
        /*
         * 初始化
         * file:要加载的文件(字符串or包含字符串的数组)
         * onProgress:加载中触发的事件
         * onComplete:加载完毕触发的事件
         */
        ctrl.init = function (_para) {
            para.event.progress = _para.onProgress;
            para.event.complete = _para.onComplete;
            para.obj.loadQueue = new createjs.LoadQueue(false);
            para.obj.loadQueue.on("progress", function () {
                if (para.event.progress) {
                    para.event.progress(para.obj.loadQueue.progress);
                }
            });
            para.obj.loadQueue.on("complete", function () {
                if (para.event.complete) {
                    para.event.complete();
                }
            });
            if (_para.file) {
                ctrl.load(_para.file);
            }
            return ctrl;
        }
        /*
         * 加载文件
         * file:路径\[路径]
         */
        ctrl.load = function (file) {
            switch (typeof (file)) {
                case "string":
                    para.obj.loadQueue.loadFile(file);
                    break;
                case "object":
                    if (!(file instanceof Array)) { return ctrl; }
                    var manifest = [];
                    for (var i = 0; i < file.length; i++) {
                        manifest[manifest.push({}) - 1].src = file[i];
                    }
                    para.obj.loadQueue.loadManifest(manifest);
                    break;
                default:

            }
            return ctrl;
        }
        /*
         * 事件>加载中
         * 事件回调带有progress参数
         */
        ctrl.onProgress = function (fun) {
            if (fun) {
                para.event.progress = fun;
            }
            return ctrl;
        }
        /*
         * 事件>加载完毕
         */
        ctrl.onComplete = function (fun) {
            if (fun) {
                para.event.complete = fun;
            }
            return ctrl;
        }
        return ctrl;
    }
}