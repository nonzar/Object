var NZTMove = {
    eventType: {
        touchStart: "touchstart",
        touchMove: "touchmove",
        touchEnd: "touchend"
    },
    createNew: function () {
        var ctrl = {},
            obj = {},
            data = {},
            event = {};
        obj.o,
        obj.$o,
        data.offset,
        data.regp = [0, 0],
        data._regp = [0, 0],
        data.isStart = false;
        event.ts = null,
        event.tm = null,
        event.te = null;
        ctrl.appendCssTsf = "";
        ctrl.getvar = function () {
            return obj;
        }
        ctrl.init = function (set) {
            obj.o = document.querySelector("#" + set.id);
            obj.$o = $(obj.o);
            data.offset = obj.$o.offset();
            //绑定事件
            obj.o.addEventListener(NZTMove.eventType.touchStart, function (e) {
                data.regp = [
                    e.changedTouches[0].clientX - obj.$o.offset().left,
                    e.changedTouches[0].clientY - obj.$o.offset().top
                ];
                data._regp = [
                    data.offset.left + data.regp[0],
                    data.offset.top + data.regp[1]
                ];
                if (event.ts != null) {
                    event.ts();
                }
            }, false);
            obj.o.addEventListener(NZTMove.eventType.touchMove, function (e) {
                if (!data.isStart) { return ctrl; }
                //obj.o.style.webkitTransform = "translate(" + (e.changedTouches[0].clientX - data.offset.left - data.regp[0]) + "px," + (e.changedTouches[0].clientY - data.offset.top - data.regp[1]) + "px) " + ctrl.appendCssTsf;
                obj.o.style.webkitTransform = "translate(" + (e.changedTouches[0].clientX - data._regp[0]) + "px," + (e.changedTouches[0].clientY - data._regp[1]) + "px) " + ctrl.appendCssTsf;
                if (event.tm != null) {
                    event.tm(e);
                }
            }, false);
            obj.o.addEventListener(NZTMove.eventType.touchEnd, function (e) {
                if (event.te != null) {
                    event.te(e);
                }
            }, false);
            return ctrl;
        }
        ctrl.offset = function () {

        }
        ctrl.on = function (eventType, fn) {
            switch (eventType) {
                case NZTMove.eventType.touchStart:
                    event.ts = fn;
                    break;
                case NZTMove.eventType.touchMove:
                    event.tm = fn;
                    break;
                case NZTMove.eventType.touchEnd:
                    event.te = fn;
                    break;
                default:

            }
            return ctrl;
        }
        ctrl.start = function () {
            data.isStart = true;
            return ctrl;
        }
        ctrl.stop = function () {
            data.isStart = false;
            return ctrl;
        }
        return ctrl;
    }
}
