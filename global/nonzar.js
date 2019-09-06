window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();
var nzRaf = {
    setTimeOut: function (callback, time) {
        var endTime = +new Date() + time,
        _run = function () {
            if (+new Date() >= endTime) {
                callback();
            } else {
                window.requestAnimationFrame(_run);
            }
        };
        _run();
    }
}

/* 选择 */
function nz(id) {
    return NZAmin.createNew().init({
        id: id
    });
}
/*
    amin动画类
    依赖类库
*/
var nzCss = {}
nzCss.transform = "-webkit-transform";
nzCss.opacity = "opacity";
var NZAmin = {
    createNew: function () {
        var ctrl = {}, _para = {};
        //初始化
        ctrl.init = function (para) {
            _para.obj = $(para.id).get(0);
            //事件绑定
            _para.event = {}
            _para.event.transitionEnd = null;
            _para.obj.addEventListener("webkitTransitionEnd", function () {
                if (_para.event.transitionEnd != null) {
                    _para.event.transitionEnd();
                    _para.event.transitionEnd = null;
                }
            }, false);
            return ctrl;
        }
        //设置transition
        ctrl.transiton = function (name, duration,callback) {
            if (name != null && duration != null) {
                //设置transition
                if (_para.obj.style.webkitTransition.length != 0) {
                    if (_para.obj.style.webkitTransition.indexOf(name) != -1) {
                        var _tslist = _para.obj.style.webkitTransition.replace(/  /g, " ").replace(/, /g, ",").split(",");
                        for (var i in _para.obj.style) {
                            if (_tslist[i].split(" ")[0].indexOf(name) != -1) {
                                _tslist[i] = name + " " + duration + "ms";
                                _para.obj.style.webkitTransition = _tslist.join(",");
                                break;
                            }
                        }
                    } else {
                        _para.obj.style.webkitTransition += ", " + name + " " + duration + "ms";
                    }
                } else {
                    _para.obj.style.webkitTransition = name + " " + duration + "ms";
                }
                if (callback) {
                    callback();
                }
            }
            return ctrl;
        }
        //translate移动
        ctrl.translateTo = function (x, y, z, callback) {
            //回调
            if (callback != undefined) {
                _para.event.transitionEnd = callback;
            }
            //移动
            if (_para.obj.style.webkitTransform.length != 0) {
                if (_para.obj.style.webkitTransform.indexOf("translate") != -1) {
                    var _tflist = _para.obj.style.webkitTransform.replace(/, /g, ",").split(" ");
                    for (var i in _tflist) {
                        if (_tflist[i].indexOf("translate") != -1) {
                            _tflist.splice(i, 1);
                        }
                    }
                    _tflist.push("translate3d(" + x + "px, " + y + "px, " + z + "px)");
                    _para.obj.style.webkitTransform = _tflist.join(" ");
                } else {
                    _para.obj.style.webkitTransform += ", translate3d(" + x + "px, " + y + "px, " + z + "px)";
                }
            } else {
                _para.obj.style.webkitTransform = "translate3d(" + x + "px, " + y + "px, " + z + "px)";
            }
            return ctrl;
        }
        //rotate旋转
        ctrl.rotateTo = function (x, y, z, callback) {
            //回调
            if (callback != undefined) {
                _para.event.transitionEnd = callback;
            }
            //移动
            if (_para.obj.style.webkitTransform.length != 0) {
                if (_para.obj.style.webkitTransform.indexOf("rotate") != -1) {
                    var _rtlist = _para.obj.style.webkitTransform.replace(/, /g, ",").split(" ");
                    for (var i in _rtlist) {
                        if (_rtlist[i].indexOf("rotate") != -1) {
                            _rtlist.splice(i, 1);
                        }
                    }
                    _rtlist.push("rotate3d(" + x + "deg, " + y + "deg, " + z + "deg)");
                    _para.obj.style.webkitTransform = _rtlist.join(" ");
                } else {
                    _para.obj.style.webkitTransform += ", rotate3d(" + x + "deg, " + y + "deg, " + z + "deg)";
                }
            } else {
                _para.obj.style.webkitTransform = "rotate3d(" + x + "deg, " + y + "deg, " + z + "deg)";
            }
            return ctrl;
        }
        //透明
        ctrl.opacityTo = function (val, callback) {
            //回调
            if (callback != undefined) {
                _para.event.transitionEnd = callback;
            }
            //透明
            _para.obj.style.opacity = val;
            return ctrl;
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