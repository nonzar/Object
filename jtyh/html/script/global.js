var ctrl = {};
ctrl.pageScript = {}
ctrl.init = function (page) {
    $(window).resize(function () {
        ctrl.pageScale();
    });
    ctrl.pageScript(page);
}
ctrl.pageScript = function (page) {
    switch (page) {
        case "script_idx":
            ctrl.pageScript.idx();
            break;
        case "script_log":
            ctrl.pageScript.log();
            break;
        default:

    }
}
ctrl.pageScale = function () {
    var w = $(window).width(),
        $wrap = $(".wrap");
    if (w < 1356) {
        var scale = (w / 1356).toString();
        scale.substring(0, scale.indexOf(".") + 3);
        $wrap.css("zoom", scale);
    } else {
        $wrap.css("zoom", 1);
    }
}
ctrl.pageScript.idx = function () {
    iscroll = new IScroll("#iscroll1", {
        probeType: 1,
        snap: true,
        momentum: false,
        disableMouse: true,
        tap: false, keyBindings: {
            pageUp: 34,
            pageDown: 33,
            end: 35,
            home: 36,
            up: 40,
            down: 38
        }
    });
    $('.wb_tool .btnPrev').click(function () {
        iscroll.prev();
    });
    $('.wb_tool .btnNext').click(function () {
        iscroll.next();
    });
}
ctrl.pageScript.log = function () {
    $(".wb-itemList a").click(function () {
        $(".g_select span").text(this.innerHTML);
        $(".wb-itemList").removeClass("show");
    });
    $(".g_select").click(function () {
        $(".g_select").toggleClass("drop");
        $(".wb-itemList").toggleClass("show");
    });
    $(".g_text input").each(function (i, e) {

        $(e).focusin(function () {
            $(e).parent().addClass("focus");
        });
        $(e).focusout(function () {
            $(e).parent().removeClass("focus");
        });
    })
}
$(function () {
    ctrl.pageScale();
});