define(function () {
    var Cyclist = {
        createNew: function () {
            var ctrl = {}, para = {};
            //初始化函数
            ctrl.init = function (_para) {
                para = _para;
                para.criIdx = null;
                para.baseIdx = null;
                para.keyForBtn = [];
                for (var i = 0; i < para.count; i++) {
                    para.keyForBtn.push(i);
                }
            }
            //返回前进count次后的数组列表
            ctrl.getNext = function (count) {
                if (!arguments.length) {
                    count = 1;
                }
                for (var i = 0; i < count; i++) {
                    ctrl.getEle(1);
                }
                return para.keyForBtn;
            }
            //返回后退count次后的数组列表
            ctrl.getPrev = function (count) {
                if (!arguments.length) {
                    count = 1;
                }
                for (var i = 0; i < count; i++) {
                    ctrl.getEle(-1);
                }
                return para.keyForBtn;
            }
            //返回前进\后退1步后的数组列表（基方法）
            ctrl.getEle = function (dir) {
                switch (dir) {
                    case -1:
                        para.criIdx = 0;
                        para.baseIdx = para.count - 1;
                        break;
                    case 1:
                        para.criIdx = para.count - 1;
                        para.baseIdx = 0;
                        break;
                    default:
                        break;
                }
                for (var i = 0; i < para.count; i++) {
                    if (para.keyForBtn[i] == para.criIdx) {
                        para.keyForBtn[i] = para.baseIdx;
                    } else {
                        para.keyForBtn[i] += dir;
                    }
                }
                return para.keyForBtn;
            }
            return ctrl;
        }
    }
    return {
        init: Cyclist
    };
});