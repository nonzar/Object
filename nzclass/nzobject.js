/* 基类 */
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