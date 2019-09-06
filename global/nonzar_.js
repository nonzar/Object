requestAnimationFrame = (function () {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) { return setTimeout(callback, 1); };
})();
var Common = {
    isEmptyObject: function (o) {
        for (var property in o) {
            return false;
        }
        return true;
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
        /* base code */
        //var endTime = +new Date() + time,
        //_run = function () {
        //    if (+new Date() >= endTime) {
        //        callback();
        //    } else {
        //        requestAnimationFrame(_run);
        //    }
        //};
        //_run();
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
            }, 1000);
        };
        ctrl.run();
        return ctrl;
    }
}
//Common.setInterval(function (ctrl) {
//    console.log(ctrl.count)
//    ctrl.clear();
//}, 1000, 2);
//Common.setInterval(function (ctrl) {
//    console.log(5 - ctrl.count);
//}, 1000, 5);

/*
    通用
    样式类
*/
var nzCss = {
    sty: {
        opacity: "opacity",
        transform: "-webkit-transform"
    },
    format: function (obj) {
        return _nzCssFormat.createNew().init({
            obj: obj
        });
    },
    transition: function (obj, prop, duration, callback) {
        if (obj == null || prop == null || duration == null) {
            return;
        }
        if (window.getComputedStyle(obj).webkitTransition != "all 0s ease 0s") {
            if (window.getComputedStyle(obj).webkitTransition.indexOf(prop) != -1) {
                var _tslist = obj.style.webkitTransition.replace(/  /g, " ").replace(/, /g, ",").split(",");
                for (var i in obj.style) {
                    if (_tslist[i].split(" ")[0].indexOf(prop) != -1) {
                        _tslist[i] = prop + " " + duration + "ms";
                        obj.style.webkitTransition = _tslist.join(",");
                        break;
                    }
                }
            } else {
                obj.style.webkitTransition += ", " + prop + " " + duration + "ms";
            }
        } else {
            obj.style.webkitTransition = prop + " " + duration + "ms";
        }
        if (callback) {
            requestAnimationFrame(callback());
        }
    },
    transition2: function (obj, set, callback) {
        if (obj == null || set == null || Common.isEmptyObject(set)) {
            return;
        }
        
        if (window.getComputedStyle(obj).webkitTransition != "all 0s ease 0s") {
            if (window.getComputedStyle(obj).webkitTransition.indexOf(prop) != -1) {
                var _tslist = obj.style.webkitTransition.replace(/  /g, " ").replace(/, /g, ",").split(",");
                for (var i in obj.style) {
                    if (_tslist[i].split(" ")[0].indexOf(prop) != -1) {
                        _tslist[i] = prop + " " + duration + "ms";
                        obj.style.webkitTransition = _tslist.join(",");
                        break;
                    }
                }
            } else {
                obj.style.webkitTransition += ", " + prop + " " + duration + "ms";
            }
        } else {
            obj.style.webkitTransition = prop + " " + duration + "ms";
        }
        if (callback) {
            requestAnimationFrame(callback());
        }
    },
    opacity: function (obj, val, callback) {
        obj.style.opacity = isNaN(parseInt(val)) ? "1" : parseInt(val).toString();
        if (callback) {
            callback();
        }
    },
    transform: {
        translate: function (obj, x, y, callback) {

            switch (window.getComputedStyle(obj).webkitTransform) {
                case "none":
                    obj.style.webkitTransform = "matrix(1, 0, 0, 1, " + (x == null ? 0 : x) + ", " + (y == null ? 0 : y) + ")";
                    break;
                default:
                    var _arrTS = window.getComputedStyle(obj).webkitTransform.replace(/ /g, "").replace("matrix(", "").replace(")", "").split(",");
                    _arrTS[4] = x == null ? _arrTS[4] : x;
                    _arrTS[5] = y == null ? _arrTS[5] : y;
                    obj.style.webkitTransform = "matrix(" + _arrTS.join(", ") + ")";
            }
            if (callback) {
                requestAnimationFrame(callback());
            }
        },
        translateX: function (obj, x, callback) {
            return nzCss.transform.translate(obj, x, null, callback);
        },
        translateY: function (obj, y, callback) {
            return nzCss.transform.translate(obj, null, y, callback);
        }
    }
}

/*
    类
    实现nzCss链式编程
*/
var _nzCssFormat = {
    createNew: function () {
        var ctrl = {}, _para = {};
        ctrl.init = function (para) {
            _para.obj = para.obj;
            return ctrl;
        }
        ctrl.transition = function (prop, duration, callback) {
            nzCss.transition(_para.obj, prop, duration, callback);
            return ctrl;
        }
        ctrl.opacity = function (val, callback) {
            nzCss.opacity(_para.obj, val, callback);
            return ctrl;
        }
        ctrl.transform = {
            translate: function (x, y, callback) {
                nzCss.transform.translate(_para.obj, x, y, callback);
                return ctrl;
            },
            translateX: function (x, callback) {
                nzCss.transform.translateX(_para.obj, x, callback);
                return ctrl;
            },
            translateY: function (y, callback) {
                nzCss.transform.translateY(_para.obj, y, callback);
                return ctrl;
            }
        }
        return ctrl;
    }
}

/*
    swipe手势监控
    依赖杂志类库
*/
var NZSwipe = {
    createNew: function () {
        var ctrl = {}, _para = {};
        _para.event = {}
        ctrl.init = function (para) {
            _para.parent = $("#" + para.parentId);
            _para.plen = para.plen;
            _para.pg = 0;
            _para.isPreventDefault = false;
            _para.event.turnBefor = para.turnBefor || function (dir, pg) { };//参数: 方向、页码
            _para.event.upBefor = para.upBefor || function (pg) { };//参数: 页码
            _para.event.downBefor = para.downBefor || function (pg) { };//参数: 页码
            _para.event.changeBefor = para.changeBefor || function (dir, pg) { };//参数: 方向、页码
            _para.event.changeAfter = para.changeAfter || function (dir, pg) { };//参数: 方向、页码
            _para.parent.bind("swipeUp", function (e) {
                if (_para.pg == _para.plen - 1) {
                    _para.isPreventDefault = false;
                    _para.event.turnBefor(1, _para.pg);
                    _para.pg = _para.plen - 1;
                } else {
                    _para.isPreventDefault = true;
                    _para.event.upBefor(_para.pg);
                    _para.event.changeBefor(1, _para.pg);
                    _para.event.changeAfter(1, _para.pg + 1);
                    _para.pg++;
                }
            }, _para);
            _para.parent.bind("swipeDown", function (e) {
                if (_para.pg == 0) {
                    _para.isPreventDefault = false;
                    _para.event.turnBefor(0, _para.pg);
                    _para.pg = 0;
                } else {
                    _para.isPreventDefault = true;
                    _para.event.downBefor(_para.pg);
                    _para.event.changeBefor(0, _para.pg);
                    _para.event.changeAfter(0, _para.pg - 1);
                    _para.pg--;
                }
            }, _para);
            return ctrl;
        }
        ctrl.turnBefor = function (cb) {
            //事件>翻页
            _para.event.turnBefor = para.turnBefor;
        }
        ctrl.upBefor = function (cb) {
            //事件>往上翻
            _para.event.upBefor = para.upBefor;
        }
        ctrl.downBefor = function (cb) {
            //事件>往下翻
            _para.event.downBefor = para.downBefor;
        }
        ctrl.changeBefor = function (cb) {
            //事件>翻页
            _para.event.changeBefor = para.changeBefor;
        }
        return ctrl;
    }
}