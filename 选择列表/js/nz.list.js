/*
 * 列表类
 */
var NZList = {
    createNew: function () {
        var ctrl = {}, para = {};
        /*  储存器 */
        ctrl.private = {}, para.data = {}, para.obj = {}, para.event = {};
        para.data.maxLen = 5;
        para.data.itemHeight = 60;
        para.data.unit = "px";
        /*
         * 以下是公开的变量
         */
        ctrl.list = null;
        ctrl.items = [];
        /*
         * 初始化
         * maxLen:可见项数目[可选,默认5]
         * height:条项高度[必选]
         * items:项内容(string\[string])
         * id:元素id[可选]
         */
        ctrl.init = function (_para) {
            ctrl.clear();
            para.data.maxLen = _para.maxLen != null ? _para.maxLen : para.data.maxLen;
            if (_para.height != null) {
                para.data.itemHeight = parseFloat(_para.height, 10);
                para.data.unit = _para.height.substring(_para.height.indexOf(para.data.itemHeight) + para.data.itemHeight.toString().length);
            }
            //传入项文本数组并创建list并附加到元素
            ctrl.private.createListHTML(ctrl.private.createItemTexts(_para.items), _para.id != null ? _para.id : ctrl.list.getAttribute("id"));
            return ctrl;
        }
        /*
         * 以下方法不建议外部调用
         */
        /* 建立内容数组 */
        ctrl.private.createItemTexts = function (items) {
            var arrTexts = [];
            switch (typeof (items)) {
                case "string":
                    arrTexts.push(items);
                    break;
                case "object":
                    if (!(items instanceof Array)) { break; }
                    for (var i = 0; i < items.length; i++) {
                        arrTexts.push(items[i]);
                    }
                    break;
            }
            return arrTexts;
        }
        /* 创建list结构 */
        ctrl.private.createListHTML = function (items, id) {
            ctrl.items = [];
            if (ctrl.list == null) {
                ctrl.list = document.createElement("ul");
                ctrl.list.setAttribute("class", "nzUiList");
            }
            ctrl.list.style.height = para.data.itemHeight * (items.length > para.data.maxLen ? para.data.maxLen : items.length) + para.data.unit;
            ctrl.list.setAttribute("id", id != null ? id : "");
            for (var i = 0; i < items.length; i++) {
                ctrl.items.push(document.createElement("li"))
                ctrl.items[i].innerHTML = items[i];
                ctrl.items[i].className = "nzUiItem";
                ctrl.items[i].style.fontSize = para.data.itemHeight * 0.56 + para.data.unit;
                ctrl.items[i].style.lineHeight = para.data.itemHeight + para.data.unit;
                ctrl.items[i].style.height = para.data.itemHeight + para.data.unit;
                ctrl.list.appendChild(ctrl.items[i]);
            }
            return ctrl.list;
        }
        /*
         * 以下方法建议外部调用
         */
        /* 编辑item文本 */
        ctrl.setText = function (idx, text) {
            if (0 <= idx && idx <= ctrl.items.length && text != null) {
                ctrl.items[idx].innerHTML = text;
            }
        }
        /* 清空列表 */
        ctrl.clear = function () {
            for (var i = 0; i < ctrl.items.length; i++) {
                ctrl.items[i].parentNode.removeChild(ctrl.items[i]);
            }
            ctrl.items = [];
            return ctrl;
        }
        /* each */
        ctrl.each = function (fun) {
            if (fun) {
                for (var i = 0; i < ctrl.items.length; i++) {
                    fun(i, ctrl.items[i]);
                }
            }
            return ctrl;
        }
        /* 销毁 */
        ctrl.destroy = function () { }
        return ctrl;
    }
}