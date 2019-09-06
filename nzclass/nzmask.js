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
        data.changeTime;
        data.temps;
        obj.nzchainfn,
        obj.masks;
        ctrl.init = function (set) {
            set = set || {};
            NZObject.addRule(set.className || ".NZMask", set.css || "background-color: rgba(0,0,0,0.8);width: 100%;height: 100%;overflow: hidden;visibility: hidden;z-index: -1;position: fixed;left: 0;top: 0;opacity: 0;transition: opacity 500ms;");
            data.changeTime = set.changeTime || 500;
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
                    console.log(Boolean(isAsyn));
                    if (!isAsyn) { obj.nzchainfn.fn(); }
                }, data.changeTime);
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
                    obj.masks[data.nowIdx].visibility = "hidden";
                    obj.masks[data.nowIdx].zIndex = "-1";
                    data.nowIdx = -1;
                    if (callback != undefined) {
                        callback(e);
                    }
                    if (!isAsyn) { obj.nzchainfn.fn(); }
                }, data.changeTime);
            });
            return ctrl;
        }
        return ctrl;
    }
}