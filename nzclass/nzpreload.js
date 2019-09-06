/*
 * 加载类
 * 依赖preloadjs-0.6.0
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