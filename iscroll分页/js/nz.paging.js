/*
    依赖:iScroll5;
    NZPaging是基于iScroll5(scroll-probe)封装的一个上下滑动分页插件;
    如若需操作iScroll对象,请访问NZPaging(对象).controls[0]\NZPaging(对象).iScroll;
    由于引入了[特定类禁止滑动(.NZPaging-unscroll)]的功能,建议用NZPaging.disable()代替iScroll.disable();
    by 添少
*/
var NZPaging = {
    eventType: {
        beforeScrollStart: "beforeScrollStart",
        scrollCancel: "scrollCancel",
        scrollStart: "scrollStart",
        scroll: "scroll",
        scrollEnd: "scrollEnd",
        flick: "flick",
        zoomStart: "zoomStart",
        zoomEnd: "zoomEnd",
        /* 以下事件非iscroll事件,请用此类提供的on方法绑定 */
        flip: "flip"//翻页
    },
    createNew: function () {
        var ctrl = {}, obj = {}, data = {}, event = {};
        /* 数据 */
        data.lastIndex = [0, null];//上一页idx
        data.disable = false;//关闭(用于区分全局禁止还是类禁止)
        /* 访问内部对象 */
        ctrl.controls = [];
        ctrl.iScroll;
        /* 设置事件 */
        /* 事件>翻页 */
        event.flip_fn = function () { }
        event.flip = function () {
            obj.pages[obj.iScroll.currentPage.pageY].classList.remove("NZPaging-prev");
            obj.pages[obj.iScroll.currentPage.pageY].classList.add("NZPaging-active");
            if (data.lastIndex[0] != null) {
                obj.pages[data.lastIndex[0]].classList.remove("NZPaging-active");
                obj.pages[data.lastIndex[0]].classList.add("NZPaging-prev");
            }
            if (data.lastIndex[1] != null) {
                obj.pages[data.lastIndex[1]].classList.remove("NZPaging-prev");
            }
            data.lastIndex[1] = data.lastIndex[0];
            data.lastIndex[0] = obj.iScroll.currentPage.pageY;
            event.flip_fn(obj.iScroll.currentPage.pageY);
        }
        /* 初始化 */
        ctrl.init = function (_para) {
            //获取dom
            obj.parent = document.querySelector(_para.id);
            obj.body = obj.parent.querySelector("ul");
            obj.pages = document.querySelectorAll(_para.id + ">ul>li");
            obj.unscrolls = obj.body.querySelectorAll(".NZPaging-unscroll");
            //设置dom
            ctrl.setCss(_para.resetCss);
            //重置iscroll
            ctrl.refresh();
            //iScroll初始化
            ctrl.iScroll = obj.iScroll = new IScroll(_para.id, {
                probeType: 1,
                snap: true,
                momentum: false,
                tap: false
            });
            //绑定事件
            obj.iScroll.on(NZPaging.eventType.scrollEnd, function () {
                //是否触发flip事件
                if (this.currentPage.pageY != data.lastIndex[0]) {
                    event.flip();
                }
            });
            for (var i = 0; i < obj.unscrolls.length; i++) {
                obj.unscrolls[i].addEventListener("touchstart", function () {
                    obj.iScroll.disable();
                }, false);
                obj.unscrolls[i].addEventListener("touchend", function () {
                    obj.iScroll.enable();
                }, false);
            }
            window.addEventListener("resize", function () {
                //刷新iScroll
                ctrl.refresh();
            }, false);
            //controls
            ctrl.controls.push(obj.iScroll);
            ctrl.controls.push(obj.parent);
            ctrl.controls.push(obj.body);
            ctrl.controls.push(obj.pages);
            return ctrl;
        }
        /* 初始化css */
        ctrl.setCss = function (reset) {
            //reset css
            if (reset) {
                obj.parent.style.padding = "0";
                obj.parent.style.margin = "0";
                obj.body.style.listStyleType = "none";
                obj.body.style.padding = "0";
                obj.body.style.margin = "0";
                for (var i = 0; i < obj.pages.length; i++) {
                    obj.pages[i].style.listStyleType = "none";
                    obj.pages[i].style.padding = "0";
                    obj.pages[i].style.margin = "0";
                }
            }
            obj.parent.classList.add("NZPaging");
            obj.parent.style.height = "100%";
            obj.parent.style.overflow = "hidden";
            obj.body.classList.add("NZPaging-body");
            for (var i = 0; i < obj.pages.length; i++) {
                obj.pages[i].classList.add("NZPaging-page");
                obj.pages[i].style.overflow = "hidden";
            }
        }
        /* 绑定extra事件 */
        ctrl.on = function (eventType, fn) {
            switch (eventType) {
                case "flip":
                    event.flip_fn = fn;
                    break;
                default:

            }
        }
        /* 全局禁止滑动 */
        ctrl.disable = function () {
            data.disable = true;
            obj.iScroll.disable();
        }
        /* 全局允许滑动 */
        ctrl.disable = function () {
            obj.iScroll.enable();
        }
        /* 刷新 */
        ctrl.refresh = function () {
            obj.parent.style.height = window.innerHeight + "px";
            for (var i = 0; i < obj.pages.length; i++) {
                obj.pages[i].style.height = window.innerHeight + "px";
            }
            if (obj.iScroll) {
                obj.iScroll.refresh();
            }
            return ctrl;
        }
        return ctrl;
    }
}