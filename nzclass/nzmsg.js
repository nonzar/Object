/*
    信息提示
    依賴:
        nzobject
        nzchainfn
        nzmask
*/
var NZMsg = {
    controls: [],
    inArray: function (obj) {
        NZObject.inArray(obj, NZMsg.controls);
    },
    createNew: function () {
        var data = {}, obj = {}, ctrl;
        NZMsg.controls.push(ctrl = {});
        ctrl.init = function (set) {
            set = set || {};
            obj.msg = document.createElement("div");
            obj.bd = document.createElement("div");
            obj.sgLoading = document.createElement("img");
            obj.tag = document.createElement("p");
            obj.msg.classList.add("NZMsg");
            obj.bd.classList.add("bd");
            obj.sgLoading.classList.add("sgLoading");
            obj.tag.classList.add("tag");
            obj.bd.appendChild(obj.sgLoading);
            obj.bd.appendChild(obj.tag);
            obj.msg.appendChild(obj.bd);
            document.body.appendChild(obj.msg);
            obj.nzmask = NZMask.createNew().init({
                className: ".NZMsg",
                css: "background-color: rgba(0,0,0,0.8);width: 100%;height: 100%;overflow: hidden;visibility: hidden;z-index: -1;position: fixed;left: 0;top: 0;opacity: 0;transition: opacity 500ms;",
                masks: [obj.msg]
            });
            return ctrl;
        }
        ctrl.show = function (set) {
            obj.sgLoading.style.display = set.load ? "inline-block" : "none";
            if (set.tag) {
                obj.tag.innerHTML = set.tag;
                obj.tag.style.display = "inline-block";
            } else {
                obj.tag.innerHTML = "";
                obj.tag.style.display = "none";
            }
            obj.nzmask.show(0, function () {
                if (set.time) {
                    NZObject.setTimeout(function () {
                        ctrl.hide(function () {
                            if (set.callback) { set.callback(); }
                        });
                    }, set.time);
                    return ctrl;
                }
                if (set.callback) { set.callback(); }
                return ctrl;
            });
        }
        ctrl.hide = function (callback) {
            obj.nzmask.hide(function () {
                if (callback) { callback(); }
            });
        }
        return ctrl;
    }
}