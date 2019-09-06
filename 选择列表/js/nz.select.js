/*
 * 选择类
 */
var NZSelect = {
    createNew: function () {
        var ctrl = {}, para = {};
        /*  储存器 */
        ctrl.private = {}, para.data = {}, para.obj = {}, para.event = {}, para.fun = {}, para.callback = {};
        para.data.displayMode = 0;
        para.data.titHeight = "60";
        para.data.unit = "px";
        para.data.nowListIdx = -1;
        para.data.nextListIdx = -1;
        para.data.tits = [];//[string]
        para.obj.bd = null;
        para.obj.tit = null;
        para.callback.show = null;
        para.callback.close = null;
        /*
         * 以下是公开的变量
         */
        ctrl.box = null;//dom
        ctrl.lists = [];//[dom]
        /*
         * 初始化
         * id:元素id[可选]
         * titHeight:标题高度[必选]
         */
        ctrl.init = function (_para) {
            if (_para.titHeight != null) {
                para.data.titHeight = parseFloat(_para.titHeight, 10);
                para.data.unit = _para.titHeight.substring(_para.titHeight.indexOf(para.data.titHeight) + para.data.titHeight.toString().length);
            }
            //创建box并附加到元素
            ctrl.private.createBoxHTML();
            document.body.appendChild(ctrl.box);
            return ctrl;
        }
        /*
         * 以下方法不建议外部调用
         */
        /* 创建box结构 */
        ctrl.private.createBoxHTML = function (id) {
            para.obj.tit = document.createElement("h4");
            para.obj.tit.setAttribute("class", "nzUiSelectTit");
            para.obj.tit.style.fontSize = para.data.titHeight * 0.5 + para.data.unit;
            para.obj.tit.style.lineHeight = para.data.titHeight + para.data.unit;
            para.obj.tit.style.height = para.data.titHeight + para.data.unit;
            para.obj.bd = document.createElement("div");
            para.obj.bd.setAttribute("class", "nzUiSelectBd");
            para.obj.bd.addEventListener("webkitTransitionEnd", function (evt) {
                if (evt.target != para.obj.bd) { return; }
                if (para.obj.bd.className.indexOf("show") == -1) {
                    //隐藏引发的事件
                    ctrl.private.hideAllList();
                    //是否有要显示的列表idx
                    if (para.data.nextListIdx != -1) {
                        //显示指定列表
                        ctrl.lists[para.data.nextListIdx].list.className = "nzUiList show";
                        //设置标题
                        para.obj.tit.innerHTML = para.data.tits[para.data.nextListIdx];
                        //显示bd
                        para.obj.bd.className = "nzUiSelectBd show";
                    }
                } else {
                    //显示引发的事件
                    //记录当前列表的idx
                    para.data.nowListIdx = para.data.nextListIdx;
                    para.data.nextListIdx = -1;
                    //callback
                    //callback
                    if (para.callback.show) {
                        para.callback.show();
                    }
                }
            }, false);
            ctrl.box = document.createElement("div");
            ctrl.box.setAttribute("class", "nzUiSelect");
            ctrl.box.setAttribute("id", id != null ? id : "");
            ctrl.box.addEventListener("webkitTransitionEnd", function () {
                if (ctrl.box.style.opacity != "1") {
                    //隐藏触发的事件
                    ctrl.box.style.visibility = "hidden";
                    //callback
                    if (para.callback.close) {
                        para.callback.close();
                    }
                }
            }, false);
            para.obj.bd.appendChild(para.obj.tit);
            ctrl.box.appendChild(para.obj.bd);
            return ctrl.box;
        }
        ctrl.private.hideAllList = function () {
            para.obj.tit.innerHTML = "";
            for (var i = 0; i < ctrl.lists.length; i++) {
                ctrl.lists[i].list.className = "nzUiList";
            }
        }
        /*
         * 以下方法建议外部调用
         */
        /* 添加list */
        ctrl.add = function (title, nzlist) {
            para.data.tits.push(title);
            para.obj.bd.appendChild(ctrl.lists[ctrl.lists.push(nzlist) - 1].list);
            return ctrl;
        }
        /* 根据id获取列表idx */
        ctrl.getListIdx = function (id) {
            switch (typeof (id)) {
                case "string":
                    for (var i = 0; i < ctrl.lists.length; i++) {
                        if (ctrl.lists[i].list.getAttribute("id") == id) {
                            return i;
                        }
                    }
                    return -1;
                case "number":
                    return id >= 0 ? (id < ctrl.lists.length ? id : -1) : -1;
                default:
                    return -1;
            }
        }
        /* 设置标题 */
        ctrl.setTit = function (id, tit) {
            var idx = ctrl.getListIdx(id);
            if (idx == -1) { return ctrl; }
            para.data.tits[idx] = tit;
            //更新tit
            if (idx == para.data.nowListIdx) {
                para.obj.tit.innerHTML = para.data.tits[idx];
            }
            return ctrl;
        }
        /*
         * 显示列表
         * id:列表的标识(id\idx)
         */
        ctrl.show = function (id, callback) {
            //callback在transitionEnd里执行
            para.callback.show = callback;
            //获取要显示的列表的idx
            para.data.nextListIdx = ctrl.getListIdx(id);
            //如果当前列表已显示则退出
            if (para.data.nextListIdx == para.data.nowListIdx && ctrl.box.style.visibility == "visible") {
                //callback
                if (para.callback.show) {
                    para.callback.show();
                }
                return;
            }
            //是否已显示列表
            if (ctrl.box.style.visibility != "visible") {
                //未显示
                //隐藏所有列表显示指定列表
                ctrl.private.hideAllList();
                ctrl.lists[para.data.nextListIdx].list.className = "nzUiList show";
                //设置标题
                para.obj.tit.innerHTML = para.data.tits[para.data.nextListIdx];
                //显示box&bd就
                para.obj.bd.className = "nzUiSelectBd show";
                ctrl.box.style.visibility = "visible";
                ctrl.box.style.opacity = "1";
                //记录当前列表的idx
                para.data.nowListIdx = para.data.nextListIdx;
                para.data.nextListIdx = -1;
            } else {
                //已显示
                //隐藏当前列表,后续代码转入动画结束事件里执行
                para.obj.bd.className = "nzUiSelectBd";
            }
            return ctrl;
        }
        /* 关闭列表 */
        ctrl.close = function (callback) {
            para.callback.close = callback;
            //是否已显示列表
            if (ctrl.box.style.visibility.indexOf("visible") != -1) {
                //已显示
                //隐藏当前列表,后续代码转入动画结束事件里执行
                para.obj.bd.className = "nzUiSelectBd";
                //隐藏box
                ctrl.box.style.opacity = "0";
            } else {
                //callback
                if (para.callback.close) {
                    para.callback.close();
                }
            }
            return ctrl;
        }
        /* 销毁 */
        ctrl.destroy = function () { }
        return ctrl;
    }
}

var department = [
    {
        department: "广告支持",
        name: ["张三", "李四", "王五"]
    },
    {
        department: "ios开发",
        name: ["张三", "李四", "王五"]
    }
];